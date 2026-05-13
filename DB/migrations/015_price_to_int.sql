-- Normalize price column from text to integer in products and order_items.
-- Strips non-numeric characters (commas, dollar signs, spaces) before casting.
UPDATE products
   SET price = CAST(REPLACE(REPLACE(REPLACE(REPLACE(price, ',', ''), '.', ''), '$', ''), ' ', '') AS INTEGER)
 WHERE price IS NOT NULL;

UPDATE order_items
   SET price = CAST(REPLACE(REPLACE(REPLACE(REPLACE(price, ',', ''), '.', ''), '$', ''), ' ', '') AS INTEGER)
 WHERE price IS NOT NULL;
