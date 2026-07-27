CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_date DATE NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_pickup_date_idx ON orders (pickup_date);

-- Live, decrementing stock per product for the current cycle. `synced_updated_at`
-- tracks the Storyblok story's own `updated_at` — whenever that's newer than
-- what's stored here, it means the wife has just republished (a new week's
-- menu), so `remaining_stock` gets reset to the current Storyblok `stock`
-- field value. This mirrors the lazy-expiry pattern already used for
-- abandoned checkouts: no cron job or webhook needed, just a check-and-sync
-- on every read/write.
CREATE TABLE IF NOT EXISTS product_stock (
  product_uuid UUID PRIMARY KEY,
  synced_updated_at TIMESTAMPTZ NOT NULL,
  remaining_stock INTEGER NOT NULL CHECK (remaining_stock >= 0)
);

-- Standing ("order ahead") items don't reset weekly — each has a fixed
-- per-pickup-date cap (e.g. max 5 wedding cakes), tracked independently for
-- every future date, since a standing order can target any date months out.
-- A row is created (at the product's configured cap) the first time that
-- (product, date) pair is touched, and only ever decrements from there.
CREATE TABLE IF NOT EXISTS standing_stock (
  product_uuid UUID NOT NULL,
  pickup_date DATE NOT NULL,
  remaining_stock INTEGER NOT NULL CHECK (remaining_stock >= 0),
  PRIMARY KEY (product_uuid, pickup_date)
);
