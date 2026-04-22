import { sqliteTable, AnySQLiteColumn, integer, text, numeric, uniqueIndex } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const heroes = sqliteTable("heroes", {
	id: integer().primaryKey({ autoIncrement: true }),
	campaignName: text(),
	category: text(),
	description: text(),
	imageUrl: text(),
	ctaText: text(),
	isActive: integer().default(1),
	order: integer().default(0),
	createdAt: text(),
});

export const brands = sqliteTable("brands", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	logo: text(),
	order: integer().default(0),
	isActive: integer().default(1),
},
(table) => [
	uniqueIndex("brands_name_unique").on(table.name),
]);

export const categories = sqliteTable("categories", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	order: integer().default(0),
	isActive: integer().default(1),
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
	model: text(),
	price: text().notNull(),
	brandId: integer("brand_id"),
	categoryId: integer("category_id"),
	sportId: integer("sport_id"),
	genderId: integer("gender_id"),
	image: text().default("").notNull(),
	isBestSeller: integer().default(0),
	isNew: integer().default(0),
	description: text(),
	sizes: text(),
	createdAt: text().default("2026-04-19T01:59:30.678Z"),
});

export const featureBanners = sqliteTable("feature_banners", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text(),
	subtitle: text(),
	description: text(),
	image: text(),
	buttonText: text(),
	bgColor: text(),
	order: integer().default(0),
	createdAt: text(),
});

export const sports = sqliteTable("sports", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	icon: text(),
	order: integer().default(0),
},
(table) => [
	uniqueIndex("sports_name_unique").on(table.name),
]);

