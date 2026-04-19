import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core'

// ─── Lookup tables ────────────────────────────────────────────────────────────

export const brandsTable = sqliteTable('brands', {
  id:       int().primaryKey({ autoIncrement: true }),
  name:     text().notNull().unique(),
  logo:     text(),
  order:    int().default(0),
  isActive: int({ mode: 'boolean' }).default(true),
})

export const categoriesTable = sqliteTable('categories', {
  id:       int().primaryKey({ autoIncrement: true }),
  name:     text().notNull().unique(),
  order:    int().default(0),
  isActive: int({ mode: 'boolean' }).default(true),
})

export const sportsTable = sqliteTable('sports', {
  id:       int().primaryKey({ autoIncrement: true }),
  name:     text().notNull().unique(),
  icon:     text(),
  order:    int().default(0),
  isActive: int({ mode: 'boolean' }).default(true),
})

export const gendersTable = sqliteTable('genders', {
  id:    int().primaryKey({ autoIncrement: true }),
  name:  text().notNull().unique(),  // 'Hombre' | 'Mujer' | 'Niños' | 'Unisex'
  order: int().default(0),
})

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsTable = sqliteTable('products', {
  id:           int().primaryKey({ autoIncrement: true }),
  name:         text().notNull(),
  price:        text().notNull(),
  brand_id:     int(),               // FK → brands.id
  category_id:  int(),               // FK → categories.id
  sport_id:     int(),               // FK → sports.id
  gender_id:    int(),               // FK → genders.id
  image:        text().notNull().default(''),  // imagen principal / thumbnail
  isBestSeller: int({ mode: 'boolean' }).default(false),
  isNew:        int({ mode: 'boolean' }).default(false),
  description:  text(),
  sizes:        text(),              // tallas disponibles separadas por coma: "7,7.5,8"
  createdAt:    text().default(new Date().toISOString()),
})

// ─── Galería de imágenes (vistas del modelo) ──────────────────────────────────

export const productImagesTable = sqliteTable('product_images', {
  id:         int().primaryKey({ autoIncrement: true }),
  product_id: int().notNull(),       // FK → products.id (ON DELETE CASCADE)
  url:        text().notNull(),
  alt:        text().default(''),
  sort_order: int().default(0),
})

// ─── Resto del contenido ──────────────────────────────────────────────────────

export const featureBannersTable = sqliteTable('feature_banners', {
  id:          int().primaryKey({ autoIncrement: true }),
  title:       text().notNull(),
  subtitle:    text().notNull(),
  description: text(),
  image:       text().notNull(),
  buttonText:  text().notNull(),
  bgColor:     text().notNull(),
  order:       int().default(0),
  isActive:    int({ mode: 'boolean' }).default(true),
  createdAt:   text().default(new Date().toISOString()),
})

export const heroesTable = sqliteTable('heroes', {
  id:           int().primaryKey({ autoIncrement: true }),
  campaignName: text().notNull(),
  category:     text().notNull(),
  description:  text(),
  imageUrl:     text().notNull(),
  videoUrl:     text(),
  ctaText:      text().default('COMPRAR AHORA'),
  isActive:     int({ mode: 'boolean' }).default(true),
  order:        int().default(0),
  createdAt:    text().default(new Date().toISOString()),
})
