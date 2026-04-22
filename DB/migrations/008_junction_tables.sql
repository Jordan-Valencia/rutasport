-- Migration 008: create product_categories and product_sports junction tables
-- Local:  wrangler d1 execute rutasport --local --file=DB/migrations/008_junction_tables.sql
-- Remote: wrangler d1 execute rutasport --remote --file=DB/migrations/008_junction_tables.sql

CREATE TABLE IF NOT EXISTS product_categories (
  product_id  INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE IF NOT EXISTS product_sports (
  product_id INTEGER NOT NULL,
  sport_id   INTEGER NOT NULL,
  PRIMARY KEY (product_id, sport_id)
);

-- Migrate existing single-value relations from old columns
INSERT OR IGNORE INTO product_categories (product_id, category_id)
  SELECT id, category_id FROM products WHERE category_id IS NOT NULL;

INSERT OR IGNORE INTO product_sports (product_id, sport_id)
  SELECT id, sport_id FROM products WHERE sport_id IS NOT NULL;
