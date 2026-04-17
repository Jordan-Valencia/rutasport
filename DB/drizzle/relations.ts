import { relations } from 'drizzle-orm/relations';
import {
  productsTable,
  teamsTable,
  featureBannersTable,
  sportsTable,
  heroesTable,
} from './schema';

// Las relaciones se definen aquí si es necesario
// Por ahora no hay relaciones entre tablas

export const productsRelations = relations(productsTable, () => ({}));
export const teamsRelations = relations(teamsTable, () => ({}));
export const featureBannersRelations = relations(
  featureBannersTable,
  () => ({}),
);
export const sportsRelations = relations(sportsTable, () => ({}));
export const heroesRelations = relations(heroesTable, () => ({}));
