-- Tablas de pedidos para integración con Wompi

CREATE TABLE IF NOT EXISTS orders (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  reference            TEXT    NOT NULL UNIQUE,
  status               TEXT    NOT NULL DEFAULT 'PENDING',
  total_in_cents       INTEGER NOT NULL,
  wompi_transaction_id TEXT,
  createdAt            TEXT    DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
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
