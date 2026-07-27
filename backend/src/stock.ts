import type postgres from 'postgres';
import type { Product } from './storyblok.js';

// Syncs a product's live stock counter against its current Storyblok state,
// resetting it if the story has been updated since we last saw it — i.e.
// the wife has republished a new cycle's menu. Returns the current
// (post-sync) remaining stock. Must be called within a transaction so the
// row lock (FOR UPDATE) holds until the caller is done with it.
export async function syncStock(
  sql: postgres.TransactionSql,
  uuid: string,
  product: Product,
): Promise<number> {
  const [existing] = await sql<{ synced_updated_at: string; remaining_stock: number }[]>`
    SELECT synced_updated_at, remaining_stock FROM product_stock WHERE product_uuid = ${uuid}
    FOR UPDATE
  `;

  const needsSync = !existing || new Date(product.updatedAt) > new Date(existing.synced_updated_at);

  if (!needsSync) {
    return existing.remaining_stock;
  }

  await sql`
    INSERT INTO product_stock (product_uuid, synced_updated_at, remaining_stock)
    VALUES (${uuid}, ${product.updatedAt}, ${product.stock})
    ON CONFLICT (product_uuid)
    DO UPDATE SET synced_updated_at = ${product.updatedAt}, remaining_stock = ${product.stock}
  `;

  return product.stock;
}

// Syncs, then atomically decrements by `quantity`. Must be called with a
// transaction-scoped `sql` alongside every other item in the same order, so
// that if any one item lacks enough stock, the whole order rolls back
// rather than partially decrementing some items.
export async function reserveStock(
  sql: postgres.TransactionSql,
  uuid: string,
  product: Product,
  quantity: number,
): Promise<boolean> {
  await syncStock(sql, uuid, product);

  const [updated] = await sql<{ remaining_stock: number }[]>`
    UPDATE product_stock
    SET remaining_stock = remaining_stock - ${quantity}
    WHERE product_uuid = ${uuid} AND remaining_stock >= ${quantity}
    RETURNING remaining_stock
  `;

  return updated !== undefined;
}

// Standing items don't reset weekly — each (product, pickup date) pair gets
// its own independent counter, created at the product's configured
// `dailyCapacity` the first time that date is touched, and only ever
// decrementing from there. `INSERT ... ON CONFLICT DO NOTHING` makes the
// first-touch race safe: if two requests both try to create the same
// (product, date) row simultaneously, one wins and the other becomes a
// no-op, then both proceed to the atomically-guarded decrement below.
export async function reserveStandingStock(
  sql: postgres.TransactionSql,
  uuid: string,
  product: Product,
  pickupDate: string,
  quantity: number,
): Promise<boolean> {
  await sql`
    INSERT INTO standing_stock (product_uuid, pickup_date, remaining_stock)
    VALUES (${uuid}, ${pickupDate}, ${product.dailyCapacity})
    ON CONFLICT (product_uuid, pickup_date) DO NOTHING
  `;

  const [updated] = await sql<{ remaining_stock: number }[]>`
    UPDATE standing_stock
    SET remaining_stock = remaining_stock - ${quantity}
    WHERE product_uuid = ${uuid} AND pickup_date = ${pickupDate} AND remaining_stock >= ${quantity}
    RETURNING remaining_stock
  `;

  return updated !== undefined;
}

export async function getStandingStockRemaining(
  sql: postgres.Sql,
  uuid: string,
  product: Product,
  pickupDate: string,
): Promise<number> {
  const [existing] = await sql<{ remaining_stock: number }[]>`
    SELECT remaining_stock FROM standing_stock
    WHERE product_uuid = ${uuid} AND pickup_date = ${pickupDate}
  `;
  return existing ? existing.remaining_stock : product.dailyCapacity;
}
