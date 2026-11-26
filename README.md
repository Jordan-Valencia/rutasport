# RutaSport — Tienda en línea de artículos deportivos

Aplicación **e-commerce en producción** para un cliente real, desarrollada de punta a punta: catálogo, carrito, autenticación y pedidos por WhatsApp. Desplegada en **Cloudflare** con renderizado del lado del servidor (SSR).

> 🌐 Producción: **[ruta-sport.com](https://ruta-sport.com)**

---

## Características

- **Catálogo** con filtros por deporte, género, novedades y más vendidos, con búsqueda difusa (fuzzy search).
- **Carrito de compras**: solo aparecen los productos que el cliente va agregando, con modelo, talla, cantidad y precio.
- **Autenticación de usuarios** y **recuperación de contraseña**.
- **Pedidos por WhatsApp**: el botón **PAGAR** abre el chat con el pedido exacto ya escrito; la tienda cuadra el pago y el envío. No requiere login ni pasarela de pago.
- **Correos transaccionales** (confirmaciones, recuperación de cuenta).
- **Panel administrativo** para gestión de productos e inventario.
- **SSR** (renderizado en servidor) para SEO y carga inicial rápida.

## Stack

| Capa | Tecnología |
|------|------------|
| Front-end | Angular 21, TypeScript, Tailwind CSS v4, GSAP |
| Back-end / API | Cloudflare Pages Functions (Workers), Express |
| Base de datos | Cloudflare D1 (SQLite) + Drizzle ORM |
| Pedidos | WhatsApp (`wa.me`) |
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
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

Ya no se requieren credenciales de pasarela de pago: el pedido se confirma por WhatsApp al **315 132 2221**.

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
