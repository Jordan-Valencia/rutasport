PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_heroes` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `campaignName` text,
  `category` text,
  `description` text,
  `imageUrl` text,
  `ctaText` text DEFAULT 'COMPRAR AHORA',
  `isActive` integer DEFAULT true,
  `order` integer DEFAULT 0,
  `createdAt` text
);
INSERT INTO `__new_heroes`("id", "campaignName", "category", "description", "imageUrl", "ctaText", "isActive", "order", "createdAt")
  SELECT "id", "campaignName", "category", "description", "imageUrl", "ctaText", "isActive", "order", "createdAt" FROM `heroes`;
DROP TABLE `heroes`;
ALTER TABLE `__new_heroes` RENAME TO `heroes`;
PRAGMA foreign_keys=ON;
