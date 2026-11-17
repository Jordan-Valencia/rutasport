# RutaSport — Tienda en línea de artículos deportivos

Aplicación **e-commerce en producción** para un cliente real, desarrollada de punta a punta: catálogo, carrito, órdenes, autenticación y pago en línea. Desplegada en **Cloudflare** con renderizado del lado del servidor (SSR).

> 🌐 Producción: **[ruta-sport.com](https://ruta-sport.com)**

---

## Características

- **Catálogo** con filtros por deporte, género, novedades y más vendidos, con búsqueda difusa (fuzzy search).
- **Carrito de compras** y flujo de **órdenes**.
- **Autenticación de usuarios** y **recuperación de contraseña**.
- **Pago en línea** integrado con **Epayco**.
- **Correos transaccionales** (confirmaciones, recuperación de cuenta).
- **Panel administrativo** para gestión de productos e inventario.
- **SSR** (renderizado en servidor) para SEO y carga inicial rápida.

## Stack

| Capa | Tecnología |
|------|------------|
| Front-end | Angular 21, TypeScript, Tailwind CSS v4, GSAP |
| Back-end / API | Cloudflare Pages Functions (Workers), Express |
| Base de datos | Cloudflare D1 (SQLite) + Drizzle ORM |
| Pagos | Epayco |
| Email | Nodemailer |
| Deploy | Cloudflare Pages / Workers (Wrangler) |
| Pruebas | Vitest |

## Arquitectura

```
rutasport/
├── src/              # Aplicación Angular (SSR)
│   ├── app/          # Componentes, rutas, servicios
│   └── server.ts     # Entry point del servidor SSR
├── functions/        # Cloudflare Pages Functions (API, imágenes, videos)
├── DB/               # Esquema y migraciones (Drizzle / D1)
├── public/           # Assets estáticos
├── scripts/          # Utilidades (init D1, carga de productos, dedup)
└── wrangler.toml     # Configuración de Cloudflare
```

## Requisitos

- Node.js 20+
- npm
- Cuenta de Cloudflare (para D1 y Pages) y Wrangler CLI

## Puesta en marcha local

```bash
npm install

# Base de datos local (D1)
npm run db:init:FRESH_ONLY

# Servidor de desarrollo
npm start          # ng serve -> http://localhost:4200

# Desarrollo con Cloudflare Pages Functions + proxy
npm run cf
```

### Variables de entorno

Crea un archivo **`.dev.vars`** (no se sube al repositorio) con:

```
EPAYCO_PUBLIC_KEY=
EPAYCO_PRIVATE_KEY=
EPAYCO_CUSTOMER_ID=
EPAYCO_TEST=true
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm start` | Servidor de desarrollo Angular |
| `npm run build` | Build de producción |
| `npm run cf` | Cloudflare Pages dev con Functions |
| `npm run db:init:FRESH_ONLY` | Inicializa la base de datos D1 local |
| `npm test` | Pruebas con Vitest |
| `npm run deploy:all` | Build + migraciones + deploy a Cloudflare |

## Despliegue

```bash
npm run deploy:all
```

Compila la aplicación, aplica las migraciones a D1 remoto y publica en Cloudflare Pages.

---

Desarrollado por **Jordan Valencia** · [jordan-valencia.com](https://jordan-valencia.com) · [github.com/Jordan-Valencia](https://github.com/Jordan-Valencia)
