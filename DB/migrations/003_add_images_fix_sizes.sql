-- Migration 003: add images column + fix product sizes
ALTER TABLE products ADD COLUMN images TEXT;

-- Oakley sizes
UPDATE products SET sizes='7.5,10'   WHERE name='FOF100334-001';
UPDATE products SET sizes='8.5,11'   WHERE name='FOF100575-213';
UPDATE products SET sizes='11'       WHERE name='FOF100631-001';
UPDATE products SET sizes='7'        WHERE name='FOF100614-001';
UPDATE products SET sizes='7.5'      WHERE name='FOF100334-053';
UPDATE products SET sizes='7,10'     WHERE name='FOF100670-323';
UPDATE products SET sizes='7,7.5,10' WHERE name='FOF100334-323';
UPDATE products SET sizes='7,10'     WHERE name='FOF100335-323';
UPDATE products SET sizes='7,10,11'  WHERE name='FOF100669-323';
UPDATE products SET sizes='10'       WHERE name='FOF100546-01K';
UPDATE products SET sizes='10'       WHERE name='FOF100631-25N';
UPDATE products SET sizes='10'       WHERE name='FOF100522-22Y';
UPDATE products SET sizes='10'       WHERE name='FOF100546-87B';
UPDATE products SET sizes='9.5,10'   WHERE name='FOF100576-053';
UPDATE products SET sizes='12'       WHERE name='FOF100545-207';
UPDATE products SET sizes='9.5,11'   WHERE name='FOF100634-323';
UPDATE products SET sizes='10'       WHERE name='FOF100547-01K';
UPDATE products SET sizes='9.5'      WHERE name='FOF100614-314';
UPDATE products SET sizes='9.5'      WHERE name='FOF100469-882';

-- Adidas sizes
UPDATE products SET sizes='5,5.5,6.5,7'   WHERE name='JQ2540';
UPDATE products SET sizes='5.5,7,7.5,8.5' WHERE name='ID8764';
UPDATE products SET sizes='6,7,7.5'        WHERE name='IH8225';
UPDATE products SET sizes='5.5,7,7.5'      WHERE name='ID8742';
UPDATE products SET sizes='8,10,11'        WHERE name='JR7151';
UPDATE products SET sizes='6,7,7.5,8'      WHERE name='JR9142';
UPDATE products SET sizes='9,9.5,10,11'    WHERE name='KJ1735';
UPDATE products SET sizes='8,9,9.5,10'     WHERE name='JQ6958';
UPDATE products SET sizes='6,6.5,7,8'      WHERE name='JS4435';
UPDATE products SET sizes='4,4.5,6'        WHERE name='KJ1738';
UPDATE products SET sizes='6,6.5,7'        WHERE name='JP5911';
UPDATE products SET sizes='4,6.5,7'        WHERE name='ID8329';
UPDATE products SET sizes='6.5,7,7.5,8'    WHERE name='HQ2329';
UPDATE products SET sizes='6.5,7,7.5'      WHERE name='JQ2610';

-- Also create tables if missing (fix 500 errors)
CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  logo TEXT,
  "order" INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);
INSERT OR IGNORE INTO brands (name, "order", isActive) VALUES
  ('Nike',1,1),('Adidas',2,1),('Oakley',3,1),('Puma',4,1),
  ('New Balance',5,1),('Under Armour',6,1),('Converse',7,1),
  ('Vans',8,1),('Jordan',9,1),('Reebok',10,1),('Asics',11,1);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  "order" INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);
INSERT OR IGNORE INTO categories (name, "order", isActive) VALUES
  ('Running',1,1),('Fútbol',2,1),('Basketball',3,1),('Training',4,1),
  ('Lifestyle',5,1),('Tenis',6,1),('Trail',7,1),('Niños',8,1);
