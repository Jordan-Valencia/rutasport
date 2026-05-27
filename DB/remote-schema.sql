PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE brands (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL UNIQUE,
  logo     TEXT,
  "order"  INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);
CREATE TABLE categories (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL UNIQUE,
  "order"  INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);
CREATE TABLE sports (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL UNIQUE,
  icon     TEXT,
  "order"  INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT 1
);
CREATE TABLE genders (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL UNIQUE,
  "order" INTEGER DEFAULT 0
);
CREATE TABLE products (
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
, video TEXT, `badge` text DEFAULT 'ORIGINAL', brand TEXT);
CREATE TABLE product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE feature_banners (
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
CREATE TABLE heroes (
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
, slogan TEXT);
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		);
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL
);
CREATE TABLE product_categories (
  product_id  INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, category_id)
);
CREATE TABLE product_sports (
  product_id INTEGER NOT NULL,
  sport_id   INTEGER NOT NULL,
  PRIMARY KEY (product_id, sport_id)
);
CREATE TABLE orders (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  reference            TEXT    NOT NULL UNIQUE,
  status               TEXT    NOT NULL DEFAULT 'PENDING',
  total_in_cents       INTEGER NOT NULL,
  epayco_refpayco TEXT,
  createdAt            TEXT    DEFAULT (datetime('now'))
, user_id INTEGER REFERENCES users(id), shipping_status TEXT NOT NULL DEFAULT 'PROCESSING', tracking_number TEXT, shipping_notes TEXT, updatedAt TEXT, cancelled_at TEXT, cancel_reason TEXT);
CREATE TABLE order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  name       TEXT    NOT NULL,
  brand      TEXT,
  model      TEXT,
  size       TEXT,
  price      TEXT    NOT NULL,
  quantity   INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  address       TEXT,
  createdAt     TEXT    DEFAULT (datetime('now'))
, region TEXT, city   TEXT);
CREATE TABLE user_sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT    NOT NULL UNIQUE,
  expires_at TEXT    NOT NULL,
  createdAt  TEXT    DEFAULT (datetime('now'))
);
CREATE TABLE pageviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  path       TEXT NOT NULL,
  referrer   TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE product_inventory (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       TEXT NOT NULL,
  stock      INTEGER NOT NULL DEFAULT 1,
  UNIQUE(product_id, size)
);
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `password_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`used` integer DEFAULT false,
	`createdAt` text DEFAULT (datetime('now'))
);
DELETE FROM sqlite_sequence;
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);
CREATE INDEX idx_pageviews_created ON pageviews(created_at);
CREATE INDEX idx_pageviews_path    ON pageviews(path);
CREATE UNIQUE INDEX `password_reset_tokens_token_unique` ON `password_reset_tokens` (`token`);
