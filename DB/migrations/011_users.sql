-- 011_users.sql
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  address       TEXT,
  createdAt     TEXT    DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT    NOT NULL UNIQUE,
  expires_at TEXT    NOT NULL,
  createdAt  TEXT    DEFAULT (datetime('now'))
);
