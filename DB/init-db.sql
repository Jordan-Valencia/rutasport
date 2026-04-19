-- ═══════════════════════════════════════════════════
--  RutaSport — DB init (fresh install)
--  Borrar el directorio .wrangler/state antes de correr
-- ═══════════════════════════════════════════════════

PRAGMA foreign_keys = ON;

-- ── Lookup tables ────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL UNIQUE,
  logo     TEXT,
  "order"  INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS categories (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL UNIQUE,
  "order"  INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sports (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL UNIQUE,
  icon     TEXT,
  "order"  INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS genders (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL UNIQUE,
  "order" INTEGER DEFAULT 0
);

-- ── Products ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  price        TEXT NOT NULL,
  brand_id     INTEGER REFERENCES brands(id),
  category_id  INTEGER REFERENCES categories(id),
  sport_id     INTEGER REFERENCES sports(id),
  gender_id    INTEGER REFERENCES genders(id),
  image        TEXT NOT NULL DEFAULT '',
  isBestSeller BOOLEAN DEFAULT 0,
  isNew        BOOLEAN DEFAULT 0,
  description  TEXT,
  sizes        TEXT,
  createdAt    TEXT DEFAULT (datetime('now'))
);

-- ── Galería (imágenes secundarias del modelo) ─────────
CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- ── Banners ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feature_banners (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  subtitle    TEXT NOT NULL,
  description TEXT,
  image       TEXT NOT NULL,
  buttonText  TEXT NOT NULL,
  bgColor     TEXT NOT NULL,
  "order"     INTEGER DEFAULT 0,
  isActive    BOOLEAN DEFAULT 1,
  createdAt   TEXT DEFAULT (datetime('now'))
);

-- ── Heroes ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS heroes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  campaignName TEXT NOT NULL,
  category     TEXT NOT NULL,
  description  TEXT,
  imageUrl     TEXT NOT NULL,
  videoUrl     TEXT,
  ctaText      TEXT DEFAULT 'COMPRAR AHORA',
  isActive     BOOLEAN DEFAULT 1,
  "order"      INTEGER DEFAULT 0,
  createdAt    TEXT DEFAULT (datetime('now'))
);

-- ══════════════════════════════════════════════════════
--  SEED DATA
-- ══════════════════════════════════════════════════════

-- Brands  (IDs: Nike=1, Adidas=2, Oakley=3, ...)
INSERT OR IGNORE INTO brands (name, "order") VALUES
  ('Nike',         1),
  ('Adidas',       2),
  ('Oakley',       3),
  ('Puma',         4),
  ('New Balance',  5),
  ('Under Armour', 6),
  ('Converse',     7),
  ('Vans',         8),
  ('Jordan',       9),
  ('Reebok',      10),
  ('Asics',       11);

-- Categories  (IDs: Running=1, Fútbol=2, Basketball=3, Training=4, Lifestyle=5, Tenis=6, Trail=7, Niños=8)
INSERT OR IGNORE INTO categories (name, "order") VALUES
  ('Running',    1),
  ('Fútbol',     2),
  ('Basketball', 3),
  ('Training',   4),
  ('Lifestyle',  5),
  ('Tenis',      6),
  ('Trail',      7),
  ('Niños',      8);

-- Sports  (IDs: Fútbol=1, Running=2, Basketball=3, Training=4, Tenis=5, Lifestyle=6, Trail=7)
INSERT OR IGNORE INTO sports (name, icon, "order") VALUES
  ('Fútbol',    '⚽', 1),
  ('Running',   '🏃', 2),
  ('Basketball','🏀', 3),
  ('Training',  '💪', 4),
  ('Tenis',     '🎾', 5),
  ('Lifestyle', '👟', 6),
  ('Trail',     '🏔️', 7);

-- Genders  (IDs: Hombre=1, Mujer=2, Niños=3, Unisex=4)
INSERT OR IGNORE INTO genders (name, "order") VALUES
  ('Hombre', 1),
  ('Mujer',  2),
  ('Niños',  3),
  ('Unisex', 4);

-- ── Productos ─────────────────────────────────────────
-- brand_id: Adidas=2, Oakley=3
-- category_id: Running=1, Fútbol=2, Lifestyle=5
-- sport_id: Fútbol=1, Running=2, Lifestyle=6
-- gender_id: Hombre=1, Mujer=2, Niños=3, Unisex=4

INSERT INTO products (name, price, brand_id, category_id, sport_id, gender_id, image, isBestSeller, isNew, sizes) VALUES
  -- ── Oakley ────────────────────────────────────────
  ('FOF100334-001', '$599.900', 3, 5, 6, 4, '', 0, 0, '7.5,10'),
  ('FOF100575-213', '$699.900', 3, 5, 6, 1, '', 0, 0, '8.5,11'),
  ('FOF100631-001', '$599.900', 3, 5, 6, 1, '', 0, 0, '11'),
  ('FOF100614-001', '$649.900', 3, 5, 6, 2, '', 0, 0, '7'),
  ('FOF100334-053', '$535.900', 3, 5, 6, 2, '', 0, 0, '7.5'),
  ('FOF100670-323', '$629.900', 3, 5, 6, 4, '', 0, 0, '7,10'),
  ('FOF100334-323', '$535.900', 3, 5, 6, 4, '', 0, 0, '7,7.5,10'),
  ('FOF100335-323', '$535.900', 3, 5, 6, 4, '', 0, 0, '7,10'),
  ('FOF100669-323', '$629.900', 3, 5, 6, 4, '', 0, 0, '7,10,11'),
  ('FOF100546-01K', '$759.900', 3, 5, 6, 1, '', 0, 1, '10'),
  ('FOF100631-25N', '$599.900', 3, 5, 6, 1, '', 0, 0, '10'),
  ('FOF100522-22Y', '$468.900', 3, 5, 6, 1, '', 0, 0, '10'),
  ('FOF100546-87B', '$759.900', 3, 5, 6, 1, '', 0, 1, '10'),
  ('FOF100576-053', '$599.900', 3, 5, 6, 1, '', 0, 0, '9.5,10'),
  ('FOF100545-207', '$715.900', 3, 5, 6, 1, '', 0, 0, '12'),
  ('FOF100634-323', '$699.900', 3, 5, 6, 1, '', 0, 1, '9.5,11'),
  ('FOF100547-01K', '$749.900', 3, 5, 6, 1, '', 0, 0, '10'),
  ('FOF100614-314', '$649.900', 3, 5, 6, 1, '', 0, 0, '9.5'),
  ('FOF100469-882', '$629.900', 3, 5, 6, 1, '', 0, 0, '9.5'),
  -- ── Adidas ────────────────────────────────────────
  ('JQ2540',  '$299.900', 2, 5, 6, 2, '', 1, 0, '5,5.5,6.5,7'),
  ('ID8764',  '$339.900', 2, 5, 6, 4, '', 0, 0, '5.5,7,7.5,8.5'),
  ('IH8225',  '$399.900', 2, 5, 6, 2, '', 0, 1, '6,7,7.5'),
  ('ID8742',  '$499.900', 2, 5, 6, 2, '', 0, 0, '5.5,7,7.5'),
  ('JR7151',  '$319.900', 2, 1, 2, 1, '', 0, 0, '8,10,11'),
  ('JR9142',  '$399.900', 2, 1, 2, 4, '', 0, 0, '6,7,7.5,8'),
  ('KJ1735',  '$299.900', 2, 5, 6, 1, '', 1, 0, '9,9.5,10,11'),
  ('JQ6958',  '$399.900', 2, 5, 6, 1, '', 0, 1, '8,9,9.5,10'),
  ('JS4435',  '$299.900', 2, 5, 6, 4, '', 0, 0, '6,6.5,7,8'),
  ('KJ1738',  '$299.900', 2, 5, 6, 2, '', 0, 0, '4,4.5,6'),
  ('JP5911',  '$399.900', 2, 2, 1, 4, '', 0, 0, '6,6.5,7'),
  ('ID8329',  '$299.900', 2, 5, 6, 2, '', 0, 0, '4,6.5,7'),
  ('HQ2329',  '$299.900', 2, 5, 6, 4, '', 0, 0, '6.5,7,7.5,8'),
  ('JQ2610',  '$299.900', 2, 5, 6, 2, '', 0, 0, '6.5,7,7.5');

-- ── Banners ───────────────────────────────────────────
INSERT INTO feature_banners (title, subtitle, description, image, buttonText, bgColor, "order", isActive) VALUES
  ('Nueva Colección Oakley', 'EXCLUSIVO', 'Los modelos más recientes de Oakley ya disponibles', '', 'EXPLORAR', '#0f172a', 1, 1),
  ('Adidas Running',         'INNOVACIÓN', 'Tecnología de punta para mejorar tu rendimiento', '',  'DESCUBRIR', '#1a1a2e', 2, 1);

-- ── Héroes ────────────────────────────────────────────
INSERT INTO heroes (campaignName, category, description, imageUrl, ctaText, isActive, "order") VALUES
  ('NUEVA TEMPORADA',   'LIFESTYLE', 'Supera tus límites. Cada paso cuenta.',      '', 'COMPRAR AHORA', 1, 1),
  ('OAKLEY COLLECTION', 'RUNNING',   'Rendimiento sin compromisos. Tecnología.', '', 'VER COLECCIÓN', 1, 2),
  ('ADIDAS X SPORT',    'FÚTBOL',    'Para los que van más lejos en cada partido.','', 'EXPLORAR',      1, 3);
