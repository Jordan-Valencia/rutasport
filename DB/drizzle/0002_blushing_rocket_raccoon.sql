PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feature_banners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`subtitle` text NOT NULL,
	`description` text,
	`image` text NOT NULL,
	`buttonText` text NOT NULL,
	`bgColor` text NOT NULL,
	`order` integer DEFAULT 0,
	`isActive` integer DEFAULT true,
	`createdAt` text DEFAULT '2026-04-19T01:33:14.040Z'
);
--> statement-breakpoint
INSERT INTO `__new_feature_banners`("id", "title", "subtitle", "description", "image", "buttonText", "bgColor", "order", "isActive", "createdAt") SELECT "id", "title", "subtitle", "description", "image", "buttonText", "bgColor", "order", "isActive", "createdAt" FROM `feature_banners`;--> statement-breakpoint
DROP TABLE `feature_banners`;--> statement-breakpoint
ALTER TABLE `__new_feature_banners` RENAME TO `feature_banners`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_heroes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`campaignName` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`videoUrl` text,
	`ctaText` text DEFAULT 'COMPRAR AHORA',
	`isActive` integer DEFAULT true,
	`order` integer DEFAULT 0,
	`createdAt` text DEFAULT '2026-04-19T01:33:14.040Z'
);
--> statement-breakpoint
INSERT INTO `__new_heroes`("id", "campaignName", "category", "description", "imageUrl", "videoUrl", "ctaText", "isActive", "order", "createdAt") SELECT "id", "campaignName", "category", "description", "imageUrl", "videoUrl", "ctaText", "isActive", "order", "createdAt" FROM `heroes`;--> statement-breakpoint
DROP TABLE `heroes`;--> statement-breakpoint
ALTER TABLE `__new_heroes` RENAME TO `heroes`;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`brand_id` integer,
	`category_id` integer,
	`sport_id` integer,
	`gender_id` integer,
	`image` text DEFAULT '' NOT NULL,
	`images` text,
	`isBestSeller` integer DEFAULT false,
	`isNew` integer DEFAULT false,
	`description` text,
	`sizes` text,
	`createdAt` text DEFAULT '2026-04-19T01:33:14.039Z'
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "name", "price", "brand_id", "category_id", "sport_id", "gender_id", "image", "images", "isBestSeller", "isNew", "description", "sizes", "createdAt") SELECT "id", "name", "price", "brand_id", "category_id", "sport_id", "gender_id", "image", "images", "isBestSeller", "isNew", "description", "sizes", "createdAt" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;