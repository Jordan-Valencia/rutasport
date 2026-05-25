-- Add updatedAt, cancelled_at, cancel_reason columns to orders table
ALTER TABLE orders ADD COLUMN updatedAt TEXT DEFAULT (datetime('now'));
ALTER TABLE orders ADD COLUMN cancelled_at TEXT;
ALTER TABLE orders ADD COLUMN cancel_reason TEXT;
