-- Add user association and shipping tracking to orders
ALTER TABLE orders ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE orders ADD COLUMN shipping_status TEXT NOT NULL DEFAULT 'PROCESSING';
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
ALTER TABLE orders ADD COLUMN shipping_notes TEXT;

-- Pageviews for traffic analytics
CREATE TABLE IF NOT EXISTS pageviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  path       TEXT NOT NULL,
  referrer   TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pageviews_created ON pageviews(created_at);
CREATE INDEX IF NOT EXISTS idx_pageviews_path    ON pageviews(path);
