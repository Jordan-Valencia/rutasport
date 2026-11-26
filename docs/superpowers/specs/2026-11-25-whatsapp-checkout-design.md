# Checkout por WhatsApp — Diseño

**Fecha:** 2026-11-25
**Proyecto:** RutaSport (`rutasport`)

## Objetivo

Reemplazar el pago con ePayco por un flujo en el que el cliente confirma su pedido por WhatsApp. El carrito sigue siendo un carrito normal con los productos que el cliente va agregando, y al final muestra un botón **PAGAR** que abre WhatsApp con el pedido exacto ya escrito, más un botón de WhatsApp al lado para escribir a la tienda. La tienda cuadra manualmente el pago y el envío.

## Decisiones aprobadas por el usuario

1. **Número de WhatsApp:** `573151322221` (el de la tienda, el mismo que ya aparece en el footer y en los términos). No se usa el número personal del desarrollador.
2. **ePayco se elimina por completo:** no se conserva como botón secundario.
3. **Sin login:** el botón de WhatsApp funciona para cualquier visitante, sin redirección a `/login`.
4. **Botón PAGAR:** abre `wa.me` con el mensaje del pedido prellenado. Un segundo botón de WhatsApp al lado abre el mismo número con un saludo corto.

## Comportamiento

### Carrito

- `CartService` no cambia: conserva únicamente los items que el cliente agrega, con `name`, `model`, `size`, `quantity`, `price` y `image`.
- Se eliminan las alertas de stock que dependían de `POST /api/orders`. La disponibilidad la confirma la tienda en el chat.
- Se conservan el total, los controles de cantidad, la eliminación de items y "Vaciar carrito".

### Pie del carrito

- Fila con dos botones: **PAGAR** (principal) y **WhatsApp** (secundario, al lado).
- Texto debajo: *"Pago y envío se acuerdan por WhatsApp al 315 132 2221."*
- `PAGAR` → `https://wa.me/573151322221?text=<pedido codificado>`.
- `WhatsApp` → `https://wa.me/573151322221?text=<saludo corto codificado>`.
- Ambos abren en pestaña nueva con `noopener,noreferrer`.

### Mensaje del pedido

Generado en el cliente a partir de `cart.items()`, en este formato:

```
Hola RutaSport, quiero confirmar este pedido:

1. NIKE CORTEZ WHITE/BLACK
   Modelo: DM4044-105 · Talla: 9 · Cantidad: 2
   $ 169.900 c/u → $ 339.800

Total: $ 339.800

Por favor cuadren el pago y el envío. Quedo atento.
```

- El modelo se incluye tal cual viene de la base de datos (`item.model`).
- La talla se incluye solo si existe; el modelo también.
- El total se calcula con la misma función `formatCOP` que usa el carrito.
- Se usa `encodeURIComponent` para la URL.

## Arquitectura y cambios

| Acción | Archivos |
|---|---|
| Crear | `src/app/services/whatsapp.service.ts`, `src/app/services/whatsapp.service.spec.ts` |
| Modificar | `src/app/home/cart-drawer/cart-drawer.component.html`, `.ts`, `src/app/app.routes.ts`, `src/app/terminos/terminos.component.html`, `README.md`, `package.json`, `package-lock.json` |
| Eliminar | `src/app/services/checkout.service.ts`, `src/app/services/epayco-checkout.service.ts`, `src/app/pago/exitoso/exitoso.component.ts`, `.html`, `functions/api/orders.ts`, `functions/api/epayco/epayco.service.ts`, `transaction.ts`, `webhook.ts` |
| Sin cambios | `CartService`, API de productos/catálogo/autenticación, historial de órdenes del admin |

`WhatsappService` es el único responsable de construir mensajes y URLs; el componente del carrito solo lo invoca. No se introduce backend nuevo.

## Manejo de errores y casos límite

- Carrito vacío: los botones no se renderizan (el footer ya está dentro de `@if (cart.items().length > 0)`).
- Item sin modelo o sin talla: se omiten esos campos, pero se conservan nombre, cantidad y precio.
- SSR: `window` solo se accede dentro de los manejadores de clic, con guarda `typeof window !== 'undefined'`.

## Pruebas

- Unitarias para `buildOrderMessage` (modelo exacto, talla, cantidad, total) y para las URLs (número correcto, mensaje codificado/descodificado).
- `npm run build` debe compilar sin referencias a ePayco.
- Verificar en producción que `https://ruta-sport.com/api/products` siga respondiendo tras el push a `main`.

## Fuera de alcance

- Borrar los secrets `EPAYCO_*` de Cloudflare (quedan sin uso; se documenta el comando opcional).
- Migrar o purgar órdenes históricas de ePayco en D1.
- Cambiar el diseño visual general de la tienda.
