import { int, text, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core'

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
  price:        int().notNull(),
  brand_id:     int(),               // FK → brands.id
  gender_id:    int(),               // FK → genders.id
  image:        text().notNull().default(''),  // imagen principal / thumbnail
  isBestSeller: int({ mode: 'boolean' }).default(false),
  isNew:        int({ mode: 'boolean' }).default(false),
  description:  text(),
  sizes:        text(),              // tallas disponibles separadas por coma: "7,7.5,8"
  createdAt:    text().default(new Date().toISOString()),
})

// ─── Relaciones many-to-many de productos ─────────────────────────────────────

export const productCategoriesTable = sqliteTable('product_categories', {
  product_id:  int().notNull(),     // FK → products.id
  category_id: int().notNull(),     // FK → categories.id
}, (t) => [
  primaryKey({ columns: [t.product_id, t.category_id] }),
])

export const productSportsTable = sqliteTable('product_sports', {
  product_id: int().notNull(),      // FK → products.id
  sport_id:   int().notNull(),      // FK → sports.id
}, (t) => [
  primaryKey({ columns: [t.product_id, t.sport_id] }),
])

// ─── Galería de imágenes (vistas del modelo) ──────────────────────────────────

export const productImagesTable = sqliteTable('product_images', {
  id:         int().primaryKey({ autoIncrement: true }),
  product_id: int().notNull(),       // FK → products.id (ON DELETE CASCADE)
  url:        text().notNull(),
  alt:        text().default(''),
  sort_order: int().default(0),
})

// ─── Inventario por talla ─────────────────────────────────────────────────────

export const productInventoryTable = sqliteTable('product_inventory', {
  id:         int().primaryKey({ autoIncrement: true }),
  product_id: int().notNull(),   // FK → products.id ON DELETE CASCADE
  size:       text().notNull(),  // talla sin prefijo: "7", "7.5", "8"
  stock:      int().notNull().default(1),
})

// ─── Pedidos (integración Wompi) ──────────────────────────────────────────────

export const ordersTable = sqliteTable('orders', {
  id:                   int().primaryKey({ autoIncrement: true }),
  reference:            text().notNull().unique(),
  status:               text().notNull().default('PENDING'), // PENDING | APPROVED | DECLINED | VOIDED | ERROR
  total_in_cents:       int().notNull(),
  wompi_transaction_id: text(),
  createdAt:            text().default(new Date().toISOString()),
})

export const orderItemsTable = sqliteTable('order_items', {
  id:         int().primaryKey({ autoIncrement: true }),
  order_id:   int().notNull(),
  product_id: int().notNull(),
  name:       text().notNull(),
  brand:      text(),
  model:      text(),
  size:       text(),
  price:      int().notNull(),
  quantity:   int().notNull(),
})

// ─── Usuarios y sesiones ──────────────────────────────────────────────────────

export const usersTable = sqliteTable('users', {
  id:            int().primaryKey({ autoIncrement: true }),
  email:         text().notNull().unique(),
  password_hash: text().notNull(),
  full_name:     text(),
  phone:         text(),
  region:        text(),
  city:          text(),
  address:       text(),
  createdAt:     text().default(new Date().toISOString()),
})

export const userSessionsTable = sqliteTable('user_sessions', {
  id:         int().primaryKey({ autoIncrement: true }),
  user_id:    int().notNull(),          // FK → users.id ON DELETE CASCADE
  token:      text().notNull().unique(),
  expires_at: text().notNull(),
  createdAt:  text().default(new Date().toISOString()),
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
