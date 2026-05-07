-- Migration 009: add video column to products
-- Local:  wrangler d1 execute rutasport --local --file=DB/migrations/009_add_product_video.sql
-- Remote: wrangler d1 execute rutasport --remote --file=DB/migrations/009_add_product_video.sql

ALTER TABLE products ADD COLUMN video TEXT;