-- Migration 004: add genders table, product_images table, drop teams
-- Local:  wrangler d1 execute rutasport --local --file=DB/migrations/004_add_genders_product_images.sql
-- Remote: wrangler d1 execute rutasport --remote --file=DB/migrations/004_add_genders_product_images.sql

CREATE TABLE IF NOT EXISTS genders (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL UNIQUE,
  "order" INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO genders (name, "order") VALUES
  ('Hombre', 1),
  ('Mujer',  2),
  ('Niños',  3),
  ('Unisex', 4);

CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS teams;
