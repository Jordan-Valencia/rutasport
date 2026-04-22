PRAGMA foreign_keys=OFF;
CREATE TABLE `__new_feature_banners` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text,
  `subtitle` text,
  `description` text,
  `image` text,
  `buttonText` text,
  `bgColor` text,
  `order` integer DEFAULT 0,
  `isActive` integer DEFAULT true,
  `createdAt` text
);
INSERT INTO `__new_feature_banners`("id", "title", "subtitle", "description", "image", "buttonText", "bgColor", "order", "isActive", "createdAt")
  SELECT "id", "title", "subtitle", "description", "image", "buttonText", "bgColor", "order", "isActive", "createdAt" FROM `feature_banners`;
DROP TABLE `feature_banners`;
ALTER TABLE `__new_feature_banners` RENAME TO `feature_banners`;
PRAGMA foreign_keys=ON;
