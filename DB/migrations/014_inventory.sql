-- 014_inventory.sql
CREATE TABLE IF NOT EXISTS product_inventory (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       TEXT NOT NULL,
  stock      INTEGER NOT NULL DEFAULT 1,
  UNIQUE(product_id, size)
);

-- Seed 1 unit per size for all existing products
-- Converts "7,7.5,8" → json_each(["7","7.5","8"]) to split comma-separated sizes
INSERT OR IGNORE INTO product_inventory (product_id, size, stock)
SELECT p.id, trim(je.value) AS size, 1
FROM products p,
  json_each('["' || replace(p.sizes, ',', '","') || '"]') je
WHERE p.sizes IS NOT NULL
  AND p.sizes != ''
  AND trim(je.value) != '';
