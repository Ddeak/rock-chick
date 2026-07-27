import { Hono } from 'hono';
import { cors } from 'hono/cors';
import Stripe from 'stripe';
import { sql } from './db.js';
import {
  getBookablePickupDates,
  isPickupDateBookable,
  STANDING_WEEKS_AHEAD,
  WEEKLY_WEEKS_AHEAD,
} from './orderDates.js';
import {
  getOrderingSettings,
  getProductByUuid,
  type OrderType,
  type Product,
} from './storyblok.js';
import {
  getStandingStockRemaining,
  reserveStandingStock,
  reserveStock,
  syncStock,
} from './stock.js';

const app = new Hono();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';

app.use('/*', cors({ origin: FRONTEND_ORIGIN }));

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono',
];

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'));
});

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey);
}

// A pending reservation that never completes payment shouldn't permanently
// hold its pickup date — lazily expire old ones whenever we touch capacity,
// rather than needing a cron job or Stripe webhook for this.
async function expireStalePendingOrders(): Promise<void> {
  await sql`
    UPDATE orders SET status = 'expired'
    WHERE status = 'pending' AND created_at < now() - interval '30 minutes'
  `;
}

// Date-level availability is purely about the cutoff/blackout window now —
// whether a *product* still has capacity for a given date is a separate
// concern (see /stock and /standing-stock), not something this endpoint
// tracks. (Earlier this checked the `orders` table for "already booked"
// dates, a leftover from the one-order-per-day model — no longer correct
// now that capacity is per-product stock, not per-day order count.)
app.get('/availability', async (c) => {
  const type: OrderType = c.req.query('type') === 'standing' ? 'standing' : 'weekly';
  const weeksAhead = type === 'standing' ? STANDING_WEEKS_AHEAD : WEEKLY_WEEKS_AHEAD;

  const settings = await getOrderingSettings();
  const dates = getBookablePickupDates(new Date(), settings, weeksAhead);

  return c.json({ dates });
});

app.get('/stock', async (c) => {
  const uuidsParam = c.req.query('uuids');
  const uuids = uuidsParam ? uuidsParam.split(',').filter(Boolean) : [];

  const result: Record<string, number> = {};

  for (const uuid of uuids) {
    const product = await getProductByUuid(uuid);
    if (!product) {
      continue;
    }
    result[uuid] = await sql.begin((tx) => syncStock(tx, uuid, product));
  }

  return c.json({ stock: result });
});

app.get('/standing-stock', async (c) => {
  const uuidsParam = c.req.query('uuids');
  const date = c.req.query('date');
  const uuids = uuidsParam ? uuidsParam.split(',').filter(Boolean) : [];

  if (!date) {
    return c.json({ error: 'date is required' }, 400);
  }

  const result: Record<string, number> = {};

  for (const uuid of uuids) {
    const product = await getProductByUuid(uuid);
    if (!product) {
      continue;
    }
    result[uuid] = await getStandingStockRemaining(sql, uuid, product, date);
  }

  return c.json({ stock: result });
});

interface CheckoutRequestItem {
  uuid: string;
  quantity: number;
}

app.post('/checkout', async (c) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return c.json({ error: 'Stripe is not configured' }, 501);
  }

  const body = await c.req.json<{
    items?: CheckoutRequestItem[];
    pickupDate?: string;
  }>();
  const requestedItems = body.items ?? [];
  const pickupDate = body.pickupDate;

  if (requestedItems.length === 0) {
    return c.json({ error: 'Cart is empty' }, 400);
  }
  if (!pickupDate) {
    return c.json({ error: 'Pickup date is required' }, 400);
  }

  await expireStalePendingOrders();

  // Fetch authoritative product data (price + stock + order type) from
  // Storyblok up front — Storyblok isn't transactional, so this happens
  // before the database transaction that actually reserves stock.
  const products = new Map<string, Product>();
  for (const requested of requestedItems) {
    const product = await getProductByUuid(requested.uuid);
    if (!product) {
      return c.json({ error: `Product ${requested.uuid} not found` }, 400);
    }
    products.set(requested.uuid, product);
  }

  // A single order can't mix weekly-cycle and standing items — they have
  // fundamentally different pickup-date rules (one fixed upcoming date vs.
  // any future date), so this must be enforced server-side too, not just
  // as a cart UI guard.
  const orderTypes = new Set(Array.from(products.values()).map((p) => p.orderType));
  if (orderTypes.size > 1) {
    return c.json(
      { error: 'This Week’s Menu and Standing Menu items cannot be ordered together' },
      400,
    );
  }
  const orderType: OrderType = orderTypes.values().next().value ?? 'weekly';

  const settings = await getOrderingSettings();
  const weeksAhead = orderType === 'standing' ? STANDING_WEEKS_AHEAD : WEEKLY_WEEKS_AHEAD;
  if (!isPickupDateBookable(pickupDate, new Date(), settings, weeksAhead)) {
    return c.json({ error: 'That pickup date is no longer available' }, 409);
  }

  let orderId = '';
  let insufficientStockName: string | null = null;
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const reservedItems: { uuid: string; quantity: number }[] = [];

  try {
    await sql.begin(async (tx) => {
      const orderItemsSnapshot: { name: string; quantity: number; unitPrice: number }[] = [];
      let totalAmount = 0;

      for (const requested of requestedItems) {
        const product = products.get(requested.uuid);
        if (!product) {
          throw new Error(`Product ${requested.uuid} missing after lookup`);
        }
        const quantity = Math.min(99, Math.max(1, Math.round(requested.quantity)));

        const reserved =
          orderType === 'standing'
            ? await reserveStandingStock(tx, requested.uuid, product, pickupDate, quantity)
            : await reserveStock(tx, requested.uuid, product, quantity);
        if (!reserved) {
          insufficientStockName = product.name;
          throw new Error('INSUFFICIENT_STOCK');
        }
        reservedItems.push({ uuid: requested.uuid, quantity });

        lineItems.push({
          quantity,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.name,
              images: product.image?.filename ? [product.image.filename] : undefined,
            },
          },
        });
        orderItemsSnapshot.push({
          name: product.name,
          quantity,
          unitPrice: product.price,
        });
        totalAmount += product.price * quantity;
      }

      const [order] = await tx<{ id: string }[]>`
        INSERT INTO orders (pickup_date, items, total_amount, status)
        VALUES (${pickupDate}, ${tx.json(orderItemsSnapshot)}, ${totalAmount}, 'pending')
        RETURNING id
      `;
      orderId = order.id;
    });
  } catch (error) {
    if (insufficientStockName) {
      return c.json({ error: `Sorry, "${insufficientStockName}" just sold out.` }, 409);
    }
    console.error('Failed to reserve order', error);
    return c.json({ error: 'Unable to reserve your order' }, 500);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${FRONTEND_ORIGIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_ORIGIN}/cart`,
    });

    await sql`UPDATE orders SET stripe_session_id = ${session.id} WHERE id = ${orderId}`;

    return c.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session creation failed', error);
    // Compensate: the DB transaction already committed the stock decrement
    // and order row, but Stripe never actually started — release both.
    await sql.begin(async (tx) => {
      for (const { uuid, quantity } of reservedItems) {
        if (orderType === 'standing') {
          await tx`
            UPDATE standing_stock SET remaining_stock = remaining_stock + ${quantity}
            WHERE product_uuid = ${uuid} AND pickup_date = ${pickupDate}
          `;
        } else {
          await tx`
            UPDATE product_stock SET remaining_stock = remaining_stock + ${quantity}
            WHERE product_uuid = ${uuid}
          `;
        }
      }
      await tx`DELETE FROM orders WHERE id = ${orderId}`;
    });
    return c.json({ error: 'Unable to start checkout' }, 502);
  }
});

app.get('/checkout/session/:id', async (c) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return c.json({ error: 'Stripe is not configured' }, 501);
  }

  try {
    const sessionId = c.req.param('id');
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';

    if (paid) {
      await sql`
        UPDATE orders SET status = 'paid'
        WHERE stripe_session_id = ${sessionId} AND status = 'pending'
      `;
    }

    return c.json({ paid });
  } catch (error) {
    console.error('Stripe session retrieval failed', error);
    return c.json({ error: 'Unable to verify session' }, 502);
  }
});

export default app;
