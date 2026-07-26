import { Hono } from 'hono';
import { cors } from 'hono/cors';
import Stripe from 'stripe';
import { getProductByUuid } from './storyblok.js';

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

interface CheckoutRequestItem {
  uuid: string;
  quantity: number;
}

app.post('/checkout', async (c) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return c.json({ error: 'Stripe is not configured' }, 501);
  }

  const body = await c.req.json<{ items?: CheckoutRequestItem[] }>();
  const requestedItems = body.items ?? [];

  if (requestedItems.length === 0) {
    return c.json({ error: 'Cart is empty' }, 400);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const requested of requestedItems) {
    const product = await getProductByUuid(requested.uuid);
    if (!product) {
      return c.json({ error: `Product ${requested.uuid} not found` }, 400);
    }
    const quantity = Math.min(99, Math.max(1, Math.round(requested.quantity)));
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
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${FRONTEND_ORIGIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_ORIGIN}/cart`,
    });
    return c.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session creation failed', error);
    return c.json({ error: 'Unable to start checkout' }, 502);
  }
});

app.get('/checkout/session/:id', async (c) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return c.json({ error: 'Stripe is not configured' }, 501);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(c.req.param('id'));
    return c.json({ paid: session.payment_status === 'paid' });
  } catch (error) {
    console.error('Stripe session retrieval failed', error);
    return c.json({ error: 'Unable to verify session' }, 502);
  }
});

export default app;
