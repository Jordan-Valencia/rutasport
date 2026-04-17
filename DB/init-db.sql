-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  sport TEXT NOT NULL,
  image TEXT NOT NULL,
  isBestSeller BOOLEAN DEFAULT 0,
  isNew BOOLEAN DEFAULT 0,
  description TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  type TEXT NOT NULL,
  logo TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

-- Tabla de banners destacados
CREATE TABLE IF NOT EXISTS feature_banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  buttonText TEXT NOT NULL,
  bgColor TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1,
  createdAt TEXT DEFAULT (datetime('now'))
);

-- Tabla de categorías deportivas
CREATE TABLE IF NOT EXISTS sports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);

-- Tabla de héroes (campaigns)
CREATE TABLE IF NOT EXISTS heroes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaignName TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT NOT NULL,
  videoUrl TEXT,
  ctaText TEXT DEFAULT 'COMPRAR AHORA',
  isActive BOOLEAN DEFAULT 1,
  "order" INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now'))
);

-- Insertar deportes
INSERT OR IGNORE INTO sports (name, "order", isActive) VALUES
  ('Fútbol', 1, 1),
  ('Running', 2, 1),
  ('Basketball', 3, 1),
  ('Training', 4, 1),
  ('Tenis', 5, 1),
  ('Golf', 6, 1);

-- Insertar productos
INSERT INTO products (name, price, category, sport, image, isBestSeller, isNew, description) VALUES
  ('Nike Air Zoom Pegasus', '$120.00', 'Running', 'Running', '/images/product-running-1.jpg', 1, 0, 'Tenis de running versátiles para todo tipo de corredores'),
  ('Adidas Ultraboost Light', '$180.00', 'Running', 'Running', '/images/product-running-2.jpg', 0, 1, 'Máxima energía en cada zancada'),
  ('Puma Future Rider', '$90.00', 'Casual', 'Lifestyle', '/images/product-casual-1.jpg', 0, 0, 'Estilo retro con comodidad moderna'),
  ('Nike LeBron XX', '$200.00', 'Basketball', 'Basketball', '/images/product-basketball-1.jpg', 1, 0, 'Potencia y estilo en la cancha'),
  ('Adidas Predator', '$220.00', 'Fútbol', 'Fútbol', '/images/product-soccer-1.jpg', 1, 0, 'Control total del balón'),
  ('Nike Metcon 9', '$130.00', 'Training', 'Training', '/images/product-training-1.jpg', 0, 1, 'Estabilidad para entrenamientos intensos');

-- Insertar equipos
INSERT INTO teams (name, country, type) VALUES
  ('Argentina', 'Argentina', 'Selecciones'),
  ('Brasil', 'Brasil', 'Selecciones'),
  ('España', 'España', 'Selecciones'),
  ('Alemania', 'Alemania', 'Selecciones'),
  ('Francia', 'Francia', 'Selecciones'),
  ('Inglaterra', 'Inglaterra', 'Selecciones'),
  ('América', 'México', 'Clubes Locales'),
  ('Guadalajara', 'México', 'Clubes Locales'),
  ('Cruz Azul', 'México', 'Clubes Locales'),
  ('Pumas', 'México', 'Clubes Locales'),
  ('Real Madrid', 'España', 'Clubes'),
  ('Barcelona', 'España', 'Clubes'),
  ('Manchester City', 'Inglaterra', 'Clubes'),
  ('Bayern Munich', 'Alemania', 'Clubes');

-- Insertar banners
INSERT INTO feature_banners (title, subtitle, description, image, buttonText, bgColor, "order") VALUES
  ('Nueva Colección Running', 'INNOVACIÓN', 'Tecnología de punta para mejorar tu rendimiento', '/images/sneaker-1.jpg', 'EXPLORAR', '#1a237e', 1),
  ('Edición Limitada Fútbol', 'EXCLUSIVO', 'Los mejores boots usados por profesionales', '/images/sneaker-2.jpg', 'DESCUBRIR', '#000000', 2);

-- Insertar héroes
INSERT INTO heroes (campaignName, category, description, imageUrl, videoUrl, ctaText, isActive, "order") VALUES
  ('JUST DO IT', 'RUNNING', 'Supera tus límites. Cada paso cuenta.', '/images/hero-lifestyle-1.jpg', '/videos/hero-running.mp4', 'COMPRAR AHORA', 1, 1);
