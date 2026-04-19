-- Migration 001: Add brands table + brand column to products
-- Run: wrangler d1 execute DB --local --file=DB/migrations/001_add_brands.sql
-- Run remote: wrangler d1 execute DB --remote --file=DB/migrations/001_add_brands.sql

CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  logo TEXT,
  "order" INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);

ALTER TABLE products ADD COLUMN brand TEXT;

-- Default brands from existing catalog
INSERT OR IGNORE INTO brands (name, "order", isActive) VALUES
  ('Nike',          1, 1),
  ('Adidas',        2, 1),
  ('Oakley',        3, 1),
  ('Puma',          4, 1),
  ('New Balance',   5, 1),
  ('Under Armour',  6, 1),
  ('Converse',      7, 1),
  ('Vans',          8, 1),
  ('Jordan',        9, 1),
  ('Reebok',       10, 1),
  ('Asics',        11, 1);
