CREATE TABLE `brands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo` text,
	`order` integer DEFAULT 0,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_name_unique` ON `brands` (`name`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`order` integer DEFAULT 0,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `feature_banners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`subtitle` text NOT NULL,
	`description` text,
	`image` text NOT NULL,
	`buttonText` text NOT NULL,
	`bgColor` text NOT NULL,
	`order` integer DEFAULT 0,
	`isActive` integer DEFAULT true,
	`createdAt` text DEFAULT '2026-04-19T01:16:21.970Z'
);
--> statement-breakpoint
CREATE TABLE `genders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `genders_name_unique` ON `genders` (`name`);--> statement-breakpoint
CREATE TABLE `heroes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`campaignName` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`videoUrl` text,
	`ctaText` text DEFAULT 'COMPRAR AHORA',
	`isActive` integer DEFAULT true,
	`order` integer DEFAULT 0,
	`createdAt` text DEFAULT '2026-04-19T01:16:21.970Z'
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`url` text NOT NULL,
	`alt` text DEFAULT '',
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`brand_id` integer,
	`category_id` integer,
	`sport_id` integer,
	`gender_id` integer,
	`image` text DEFAULT '' NOT NULL,
	`isBestSeller` integer DEFAULT false,
	`isNew` integer DEFAULT false,
	`description` text,
	`sizes` text,
	`createdAt` text DEFAULT '2026-04-19T01:16:21.969Z'
);
--> statement-breakpoint
CREATE TABLE `sports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`order` integer DEFAULT 0,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sports_name_unique` ON `sports` (`name`);--> statement-breakpoint
DROP TABLE `users_table`;