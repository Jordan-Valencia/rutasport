import { sqliteTable, AnySQLiteColumn, integer, text, numeric, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const heroes = sqliteTable("heroes", {
	id: integer().primaryKey({ autoIncrement: true }),
	campaignName: text().notNull(),
	category: text().notNull(),
	description: text(),
	imageUrl: text().notNull(),
	videoUrl: text(),
	ctaText: text().default("COMPRAR AHORA"),
	isActive: numeric().default(1),
	order: integer().default(0),
	createdAt: text().default("sql`(datetime('now'))`"),
});

export const brands = sqliteTable("brands", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	logo: text(),
	order: integer().default(0),
	isActive: integer().default(true),
},
(table) => [
	uniqueIndex("brands_name_unique").on(table.name),
]);

export const categories = sqliteTable("categories", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	order: integer().default(0),
	isActive: integer().default(true),
},
(table) => [
	uniqueIndex("categories_name_unique").on(table.name),
]);

export const genders = sqliteTable("genders", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	order: integer().default(0),
},
(table) => [
	uniqueIndex("genders_name_unique").on(table.name),
]);

export const productImages = sqliteTable("product_images", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	productId: integer("product_id").notNull(),
	url: text().notNull(),
	alt: text().default(""),
	sortOrder: integer("sort_order").default(0),
});

export const products = sqliteTable("products", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	price: text().notNull(),
	brandId: integer("brand_id"),
	categoryId: integer("category_id"),
	sportId: integer("sport_id"),
	genderId: integer("gender_id"),
	image: text().default("").notNull(),
	isBestSeller: integer().default(false),
	isNew: integer().default(false),
	description: text(),
	sizes: text(),
	createdAt: text().default("2026-04-19T01:59:30.678Z"),
});

export const featureBanners = sqliteTable("feature_banners", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	subtitle: text().notNull(),
	description: text(),
	image: text().notNull(),
	buttonText: text().notNull(),
	bgColor: text().notNull(),
	order: integer().default(0),
	isActive: integer().default(true),
	createdAt: text().default("2026-04-19T01:59:30.679Z"),
});

export const sports = sqliteTable("sports", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	icon: text(),
	order: integer().default(0),
	isActive: integer().default(true),
},
(table) => [
	uniqueIndex("sports_name_unique").on(table.name),
]);

