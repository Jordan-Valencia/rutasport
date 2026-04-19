CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  "order" INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);

ALTER TABLE products ADD COLUMN sizes TEXT;

INSERT OR IGNORE INTO categories (name, "order", isActive) VALUES
  ('Running',    1, 1),
  ('Fútbol',     2, 1),
  ('Basketball', 3, 1),
  ('Training',   4, 1),
  ('Lifestyle',  5, 1),
  ('Tenis',      6, 1),
  ('Trail',      7, 1),
  ('Niños',      8, 1);
