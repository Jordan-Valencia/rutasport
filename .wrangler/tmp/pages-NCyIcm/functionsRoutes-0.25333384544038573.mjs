import { onRequestDelete as __api_admin_banners__id__ts_onRequestDelete } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\banners\\[id].ts"
import { onRequestPut as __api_admin_banners__id__ts_onRequestPut } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\banners\\[id].ts"
import { onRequestDelete as __api_admin_brands__id__ts_onRequestDelete } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\brands\\[id].ts"
import { onRequestPut as __api_admin_brands__id__ts_onRequestPut } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\brands\\[id].ts"
import { onRequestDelete as __api_admin_categories__id__ts_onRequestDelete } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\categories\\[id].ts"
import { onRequestPut as __api_admin_categories__id__ts_onRequestPut } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\categories\\[id].ts"
import { onRequestDelete as __api_admin_heroes__id__ts_onRequestDelete } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\heroes\\[id].ts"
import { onRequestPut as __api_admin_heroes__id__ts_onRequestPut } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\heroes\\[id].ts"
import { onRequestDelete as __api_admin_products__id__ts_onRequestDelete } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\products\\[id].ts"
import { onRequestPut as __api_admin_products__id__ts_onRequestPut } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\products\\[id].ts"
import { onRequestDelete as __api_admin_sports__id__ts_onRequestDelete } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\sports\\[id].ts"
import { onRequestPut as __api_admin_sports__id__ts_onRequestPut } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\sports\\[id].ts"
import { onRequestGet as __api_admin_banners_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\banners.ts"
import { onRequestPost as __api_admin_banners_ts_onRequestPost } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\banners.ts"
import { onRequestGet as __api_admin_brands_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\brands.ts"
import { onRequestPost as __api_admin_brands_ts_onRequestPost } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\brands.ts"
import { onRequestGet as __api_admin_categories_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\categories.ts"
import { onRequestPost as __api_admin_categories_ts_onRequestPost } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\categories.ts"
import { onRequestGet as __api_admin_genders_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\genders.ts"
import { onRequestGet as __api_admin_heroes_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\heroes.ts"
import { onRequestPost as __api_admin_heroes_ts_onRequestPost } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\heroes.ts"
import { onRequestGet as __api_admin_products_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\products.ts"
import { onRequestPost as __api_admin_products_ts_onRequestPost } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\products.ts"
import { onRequestGet as __api_admin_sports_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\sports.ts"
import { onRequestPost as __api_admin_sports_ts_onRequestPost } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\sports.ts"
import { onRequestDelete as __api_admin_upload_ts_onRequestDelete } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\upload.ts"
import { onRequestGet as __api_admin_upload_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\upload.ts"
import { onRequestPost as __api_admin_upload_ts_onRequestPost } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\admin\\upload.ts"
import { onRequestGet as __api_banners_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\banners.ts"
import { onRequestGet as __api_brands_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\brands.ts"
import { onRequestGet as __api_categories_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\categories.ts"
import { onRequestGet as __api_heroes_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\heroes.ts"
import { onRequestGet as __api_products_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\products.ts"
import { onRequestGet as __api_sports_ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\api\\sports.ts"
import { onRequestGet as __images___path___ts_onRequestGet } from "C:\\Users\\Jordan\\Desktop\\trabajos\\RutaSport\\functions\\images\\[[path]].ts"

export const routes = [
    {
      routePath: "/api/admin/banners/:id",
      mountPath: "/api/admin/banners",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_banners__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/banners/:id",
      mountPath: "/api/admin/banners",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_banners__id__ts_onRequestPut],
    },
  {
      routePath: "/api/admin/brands/:id",
      mountPath: "/api/admin/brands",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_brands__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/brands/:id",
      mountPath: "/api/admin/brands",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_brands__id__ts_onRequestPut],
    },
  {
      routePath: "/api/admin/categories/:id",
      mountPath: "/api/admin/categories",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_categories__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/categories/:id",
      mountPath: "/api/admin/categories",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_categories__id__ts_onRequestPut],
    },
  {
      routePath: "/api/admin/heroes/:id",
      mountPath: "/api/admin/heroes",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_heroes__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/heroes/:id",
      mountPath: "/api/admin/heroes",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_heroes__id__ts_onRequestPut],
    },
  {
      routePath: "/api/admin/products/:id",
      mountPath: "/api/admin/products",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_products__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/products/:id",
      mountPath: "/api/admin/products",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_products__id__ts_onRequestPut],
    },
  {
      routePath: "/api/admin/sports/:id",
      mountPath: "/api/admin/sports",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_sports__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/sports/:id",
      mountPath: "/api/admin/sports",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_sports__id__ts_onRequestPut],
    },
  {
      routePath: "/api/admin/banners",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_banners_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/banners",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_banners_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/brands",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_brands_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/brands",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_brands_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/categories",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_categories_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/categories",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_categories_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/genders",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_genders_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/heroes",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_heroes_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/heroes",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_heroes_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/products",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_products_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/products",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_products_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/sports",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_sports_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/sports",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_sports_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/upload",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_upload_ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/upload",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_upload_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/upload",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_upload_ts_onRequestPost],
    },
  {
      routePath: "/api/banners",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_banners_ts_onRequestGet],
    },
  {
      routePath: "/api/brands",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_brands_ts_onRequestGet],
    },
  {
      routePath: "/api/categories",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_categories_ts_onRequestGet],
    },
  {
      routePath: "/api/heroes",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_heroes_ts_onRequestGet],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_products_ts_onRequestGet],
    },
  {
      routePath: "/api/sports",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_sports_ts_onRequestGet],
    },
  {
      routePath: "/images/:path*",
      mountPath: "/images",
      method: "GET",
      middlewares: [],
      modules: [__images___path___ts_onRequestGet],
    },
  ]