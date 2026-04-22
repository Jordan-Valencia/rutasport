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
  model        TEXT,
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

-- ── Junction tables (many-to-many) ───────────────────
CREATE TABLE IF NOT EXISTS product_categories (
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE IF NOT EXISTS product_sports (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sport_id   INTEGER NOT NULL REFERENCES sports(id),
  PRIMARY KEY (product_id, sport_id)
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
INSERT INTO products (name, model, price, brand_id, category_id, sport_id, gender_id, image, isBestSeller, isNew, description, sizes) VALUES
  -- ── Oakley ────────────────────────────────────────
  ('Halftrack Mid II',        'FOF100334-001', '$599.900', 3, 5, 6, 4, '', 0, 0,
   'Zapatilla urbana de caña media con la inconfundible estética militar de Oakley. Suela robusta con tracción premium y upper de materiales de alta durabilidad para el día a día con actitud.',
   '7.5,10'),
  ('Flak III',                'FOF100575-213', '$699.900', 3, 5, 6, 1, '', 0, 0,
   'Diseño audaz con suela chunky y upper en materiales técnicos de alta calidad. El Flak III combina el ADN deportivo de Oakley con una silueta urbana que destaca en cada paso.',
   '8.5,11'),
  ('Bridge',                  'FOF100631-001', '$599.900', 3, 5, 6, 1, '', 0, 0,
   'Silueta limpia y contemporánea con el detalle icónico de Oakley. Construcción ligera con amortiguación confortable, perfecta para el estilo urbano casual.',
   '11'),
  ('Anorak Low',              'FOF100614-001', '$649.900', 3, 5, 6, 2, '', 0, 0,
   'Inspirada en el mundo outdoor, la Anorak Low mezcla resistencia y estilo. Upper con detalle tipo anorak, suela robusta con agarre superior y construcción premium para la mujer activa.',
   '7'),
  ('Halftrack Mid II',        'FOF100334-053', '$535.900', 3, 5, 6, 2, '', 0, 0,
   'Versión femenina del clásico Halftrack Mid II con paleta de colores exclusiva. Caña media con soporte de tobillo y suela con tracción omnidireccional.',
   '7.5'),
  ('Halftrack III Mid',       'FOF100670-323', '$629.900', 3, 5, 6, 4, '', 0, 0,
   'Evolución del Halftrack con diseño renovado y materiales mejorados. Caña media con sistema de amarre reforzado y mayor amortiguación para una comodidad urbana superior.',
   '7,10'),
  ('Halftrack Mid II',        'FOF100334-323', '$535.900', 3, 5, 6, 4, '', 0, 0,
   'Diseño unisex versátil del Halftrack Mid II en colorway especial. Combinación equilibrada de soporte y comodidad con la estética bold característica de Oakley.',
   '7,7.5,10'),
  ('Halftrack Low II',        'FOF100335-323', '$535.900', 3, 5, 6, 4, '', 0, 0,
   'Versión de caña baja del Halftrack para mayor libertad de movimiento. Suela con tracción multidireccional y upper transpirable con construcción robusta.',
   '7,10'),
  ('Halftrack III Low',       'FOF100669-323', '$629.900', 3, 5, 6, 4, '', 0, 0,
   'La tercera generación del Halftrack en versión baja. Materiales actualizados, mejor amortiguación y perfil dinámico que define el estilo urbano contemporáneo.',
   '7,10,11'),
  ('Teeth Noise',             'FOF100546-01K', '$759.900', 3, 5, 6, 1, '', 0, 1,
   'La silueta más atrevida de Oakley con la icónica suela Teeth. Diseño disruptivo con maximalismo en cada detalle para quienes buscan hacer una declaración de estilo única.',
   '10'),
  ('Bridge',                  'FOF100631-25N', '$599.900', 3, 5, 6, 1, '', 0, 0,
   'Segunda coloración del icónico Bridge de Oakley. Misma silueta limpia con acabados premium y el sello distintivo que caracteriza la línea lifestyle de la marca.',
   '10'),
  ('Halftrack Low II Premium','FOF100522-22Y', '$468.900', 3, 5, 6, 1, '', 0, 0,
   'Edición premium del Halftrack Low II con materiales de mayor calidad y detalles exclusivos. La versión más refinada del icónico modelo para el hombre que exige más.',
   '10'),
  ('Teeth Noise',             'FOF100546-87B', '$759.900', 3, 5, 6, 1, '', 0, 1,
   'Colorway alternativo del Teeth Noise con el mismo ADN disruptivo. Suela con dientes icónicos y upper en paleta exclusiva que redefine el street style masculino.',
   '10'),
  ('Granadier',               'FOF100576-053', '$599.900', 3, 5, 6, 1, '', 0, 0,
   'Inspiración militar en su máxima expresión. El Granadier combina construcción robusta con estética táctica: suela de alta resistencia, upper de materiales duraderos y silueta imponente.',
   '9.5,10'),
  ('Teeth 1',                 'FOF100545-207', '$715.900', 3, 5, 6, 1, '', 0, 0,
   'El modelo original que dio origen a la legendaria serie Teeth de Oakley. Suela dentada icónica que marcó tendencia en el streetwear, con upper premium y construcción que perdura.',
   '12'),
  ('Flak 365 II Lite',        'FOF100634-323', '$699.900', 3, 5, 6, 1, '', 0, 1,
   'Versión ligera del Flak 365 II para el uso diario más exigente. Construcción aligerada sin sacrificar el diseño audaz de la línea Flak, con materiales técnicos de última generación.',
   '9.5,11'),
  ('Teeth Bomb',              'FOF100547-01K', '$749.900', 3, 5, 6, 1, '', 0, 0,
   'Interpretación explosiva del diseño Teeth de Oakley. Suela voluminosa con detalle de dientes exagerado, upper de alto impacto visual y construcción que no pasa desapercibida.',
   '10'),
  ('Anorak Low',              'FOF100614-314', '$649.900', 3, 5, 6, 1, '', 0, 0,
   'Versión masculina de la Anorak Low con colorway exclusivo para hombre. Construcción premium con upper de inspiración outdoor y suela de alta tracción para el urbano aventurero.',
   '9.5'),
  ('Halftrack Low II',        'FOF100469-882', '$629.900', 3, 5, 6, 1, '', 0, 0,
   'Colorway especial del Halftrack Low II en edición para hombre. Suela robusta con tracción premium y upper de materiales seleccionados para el estilo urbano con actitud.',
   '9.5'),
  -- ── Adidas ────────────────────────────────────────
  ('Response Runner',         'JQ2540',        '$299.900', 2, 5, 6, 2, '', 1, 0,
   'Zapatilla de running femenina con amortiguación Cloudfoam y upper transpirable. Diseño ergonómico pensado para el máximo confort en entrenamientos diarios o el estilo urbano activo.',
   '5,5.5,6.5,7'),
  ('Galaxy 7',                'ID8764',        '$339.900', 2, 5, 6, 4, '', 0, 0,
   'La séptima generación del clásico Galaxy de Adidas, ahora más cómodo y versátil. Amortiguación confiable con suela de goma resistente, ideal para el running diario o el estilo casual.',
   '5.5,7,7.5,8.5'),
  ('Duramo SL 2',             'IH8225',        '$399.900', 2, 5, 6, 2, '', 0, 1,
   'Ultra ligera y transpirable, diseñada para la mujer activa. Malla engineered de alta ventilación con soporte estructurado y amortiguación SL para un rendimiento sin interrupciones.',
   '6,7,7.5'),
  ('Questar 3',               'ID8742',        '$499.900', 2, 5, 6, 2, '', 0, 0,
   'La Questar 3 femenina ofrece amortiguación responsive Cloudfoam. Perfecta para corredoras de nivel intermedio que exigen rendimiento y estilo en cada kilómetro recorrido.',
   '5.5,7,7.5'),
  ('Duramo RC2',              'JR7151',        '$319.900', 2, 1, 2, 1, '', 0, 0,
   'Inspirada en el mundo de las competencias, la Duramo RC2 combina ligereza extrema con amortiguación de alta respuesta. El compañero ideal para el corredor urbano que no frena.',
   '8,10,11'),
  ('Terrex Tracefinder 2',    'JR9142',        '$399.900', 2, 1, 2, 4, '', 0, 0,
   'Zapatilla de trail running para terrenos variados. Suela TERREX con tacos de agarre multidireccional, upper resistente y protección reforzada en puntera para conquistar cualquier camino.',
   '6,7,7.5,8'),
  ('Response Runner 2',       'KJ1735',        '$299.900', 2, 5, 6, 1, '', 1, 0,
   'Segunda generación de la popular Response Runner con mayor amortiguación y upper actualizado. El compañero perfecto para el corredor urbano que busca comodidad y estilo en cada zancada.',
   '9,9.5,10,11'),
  ('Runfalcon 5 TR',          'JQ6958',        '$399.900', 2, 5, 6, 1, '', 0, 1,
   'Quinta generación del Runfalcon con características trail para hombre. Suela con tracción mejorada para superficies mixtas, upper de malla resistente y amortiguación cómoda en cada paso.',
   '8,9,9.5,10'),
  ('Duramo RC2',              'JS4435',        '$299.900', 2, 5, 6, 4, '', 0, 0,
   'Versión unisex de la Duramo RC2 con diseño neutro y versátil. Amortiguación de alta respuesta en un paquete ligero y dinámico para todo tipo de actividades.',
   '6,6.5,7,8'),
  ('Response Runner 2',       'KJ1738',        '$299.900', 2, 5, 6, 2, '', 0, 0,
   'Versión femenina de la Response Runner 2 con upper ajustado y soporte medial. Amortiguación Cloudfoam para máximo confort en rutinas de running o el día a día activo.',
   '4,4.5,6'),
  ('Runfalcon 5 TR',          'JP5911',        '$399.900', 2, 2, 1, 4, '', 0, 0,
   'Diseño versátil del Runfalcon 5 TR adaptado para múltiples superficies. Suela de alta tracción y upper resistente ideales para entrenamiento multideportivo y actividades al aire libre.',
   '6,6.5,7'),
  ('Switch Move',             'ID8329',        '$299.900', 2, 5, 6, 2, '', 0, 0,
   'Zapatilla de entrenamiento cruzado ligera y flexible para la mujer en movimiento. Diseño minimalista con suela de alta tracción lateral, perfecta para clases de fitness o el día a día activo.',
   '4,6.5,7'),
  ('Runvista',                'HQ2329',        '$299.900', 2, 5, 6, 4, '', 0, 0,
   'Silueta retro-running con ADN contemporáneo y diseño unisex. Amortiguación cómoda y upper en malla con overlays para un look sporty casual que combina con cualquier outfit.',
   '6.5,7,7.5,8'),
  ('Galaxy 7',                'JQ2610',        '$299.900', 2, 5, 6, 2, '', 0, 0,
   'Versión femenina del Galaxy 7 con colorways exclusivos para mujer. Amortiguación Cloudfoam y suela duradera para el running diario o el estilo urbano activo.',
   '6.5,7,7.5'),
  ('Questar 3',               'JP6604',        '$399.900', 2, 2, 1, 4, '', 0, 0,
   'La Questar 3 en versión unisex para entrenamiento multideporte. Amortiguación responsive y diseño versátil que va del campo de entrenamiento al street style sin esfuerzo.',
   '10.5');

-- ── Poblar junction tables desde category_id / sport_id ──
INSERT OR IGNORE INTO product_categories (product_id, category_id)
  SELECT id, category_id FROM products WHERE category_id IS NOT NULL;

INSERT OR IGNORE INTO product_sports (product_id, sport_id)
  SELECT id, sport_id FROM products WHERE sport_id IS NOT NULL;

-- ── Banners ───────────────────────────────────────────
INSERT INTO feature_banners (title, subtitle, description, image, buttonText, bgColor, "order", isActive) VALUES
  ('Nueva Colección Oakley', 'EXCLUSIVO', 'Los modelos más recientes de Oakley ya disponibles', '', 'EXPLORAR', '#0f172a', 1, 1),
  ('Adidas Running',         'INNOVACIÓN', 'Tecnología de punta para mejorar tu rendimiento', '',  'DESCUBRIR', '#1a1a2e', 2, 1);

-- ── Héroes ────────────────────────────────────────────
INSERT INTO heroes (campaignName, category, description, imageUrl, ctaText, isActive, "order") VALUES
  ('NUEVA TEMPORADA',   'LIFESTYLE', 'Supera tus límites. Cada paso cuenta.',      '', 'COMPRAR AHORA', 1, 1),
  ('OAKLEY COLLECTION', 'RUNNING',   'Rendimiento sin compromisos. Tecnología.', '', 'VER COLECCIÓN', 1, 2),
  ('ADIDAS X SPORT',    'FÚTBOL',    'Para los que van más lejos en cada partido.','', 'EXPLORAR',      1, 3);
