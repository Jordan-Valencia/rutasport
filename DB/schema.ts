import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';

// Tabla de productos
export const productsTable = sqliteTable('products', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  price: text().notNull(),
  category: text().notNull(),
  sport: text().notNull(),
  image: text().notNull(),
  isBestSeller: int({ mode: 'boolean' }).default(false),
  isNew: int({ mode: 'boolean' }).default(false),
  description: text(),
  createdAt: text().default(new Date().toISOString()),
});

// Tabla de equipos
export const teamsTable = sqliteTable('teams', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  country: text().notNull(),
  type: text().notNull(), // 'Selecciones', 'Clubes Locales', 'Clubes'
  logo: text(),
  createdAt: text().default(new Date().toISOString()),
});

// Tabla de banners destacados
export const featureBannersTable = sqliteTable('feature_banners', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  subtitle: text().notNull(),
  description: text(),
  image: text().notNull(),
  buttonText: text().notNull(),
  bgColor: text().notNull(),
  order: int().default(0),
  isActive: int({ mode: 'boolean' }).default(true),
  createdAt: text().default(new Date().toISOString()),
});

// Tabla de categorías deportivas
export const sportsTable = sqliteTable('sports', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  icon: text(),
  order: int().default(0),
  isActive: int({ mode: 'boolean' }).default(true),
});

// Tabla de héroes (campaigns)
export const heroesTable = sqliteTable('heroes', {
  id: int().primaryKey({ autoIncrement: true }),
  campaignName: text().notNull(),
  category: text().notNull(),
  description: text(),
  imageUrl: text().notNull(),
  videoUrl: text(),
  ctaText: text().default('COMPRAR AHORA'),
  isActive: int({ mode: 'boolean' }).default(true),
  order: int().default(0),
  createdAt: text().default(new Date().toISOString()),
});
