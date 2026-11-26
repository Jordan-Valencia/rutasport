# Checkout por WhatsApp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el checkout de ePayco por un botón PAGAR que abre WhatsApp con el pedido exacto del carrito, más un botón de WhatsApp al lado, sin login y sin backend de pagos.

**Architecture:** Toda la lógica vive en el cliente. `WhatsappService` convierte los items de `CartService` en un mensaje y en una URL `wa.me`; `CartDrawerComponent` solo invoca ese servicio. Se eliminan el servicio de checkout, el servicio de ePayco, la página de éxito, `/api/orders`, `functions/api/epayco/*` y las dependencias npm de ePayco.

**Tech Stack:** Angular 21 (signals, standalone components), TypeScript 5.9, Vitest vía `@angular/build:unit-test`, Tailwind v4, Cloudflare Pages Functions.

## Global Constraints

- Número de WhatsApp: `573151322221` (constante exportada, sin `+` ni espacios).
- El mensaje debe incluir el `model` exacto de cada item, la talla si existe, la cantidad y el total formateado con `formatCOP`.
- Sin login para el flujo de WhatsApp.
- No se suben secretos ni `.dev.vars` al repositorio.
- Todo el texto de la interfaz en español.

---

### Task 1: Servicio `WhatsappService` con pruebas

**Files:**
- Create: `src/app/services/whatsapp.service.ts`
- Create: `src/app/services/whatsapp.service.spec.ts`

**Interfaces:**
- Consumes: `CartItem` de `./cart.service`, `formatCOP` de `../shared/cop.pipe`.
- Produces: `RUTASPORT_WHATSAPP_NUMBER: string`, `WhatsappService.buildOrderMessage(items: CartItem[]): string`, `buildCheckoutUrl(items: CartItem[]): string`, `buildContactUrl(): string`, `openCheckout(items: CartItem[]): void`, `openContact(): void`.

- [ ] **Step 1: Escribir la prueba que falla**

```ts
import { describe, expect, it } from 'vitest'
import { RUTASPORT_WHATSAPP_NUMBER, WhatsappService } from './whatsapp.service'
import { CartItem } from './cart.service'

describe('WhatsappService', () => {
  const service = new WhatsappService()

  const items: CartItem[] = [
    {
      productId: 65,
      name: 'NIKE CORTEZ WHITE/BLACK',
      model: 'DM4044-105',
      brand: 'Nike',
      price: 169900,
      image: '',
      size: '9',
      quantity: 2,
      maxStock: 5,
    },
    {
      productId: 64,
      name: 'SKECHERS AERO BURST BLACK/WHITE',
      model: 'SN246210',
      price: 189900,
      image: '',
      quantity: 1,
    },
  ]

  it('incluye el modelo exacto, la talla, la cantidad y el total', () => {
    const message = service.buildOrderMessage(items)

    expect(message).toContain('NIKE CORTEZ WHITE/BLACK')
    expect(message).toContain('Modelo: DM4044-105')
    expect(message).toContain('Talla: 9')
    expect(message).toContain('Cantidad: 2')
    expect(message).toContain('$ 169.900 c/u')
    expect(message).toContain('SKECHERS AERO BURST BLACK/WHITE')
    expect(message).toContain('Modelo: SN246210')
    expect(message).toContain('Total: $ 529.700')
  })

  it('omite la talla cuando el item no tiene', () => {
    const message = service.buildOrderMessage(items)
    const secondItemBlock = message.split('SKECHERS AERO BURST BLACK/WHITE')[1].split('Total:')[0]

    expect(secondItemBlock).not.toContain('Talla:')
  })

  it('construye la URL con el numero de la tienda y el mensaje codificado', () => {
    const url = service.buildCheckoutUrl(items)
    const encoded = url.split('?text=')[1]

    expect(url).toContain(`wa.me/${RUTASPORT_WHATSAPP_NUMBER}`)
    expect(encoded).toBeDefined()
    expect(decodeURIComponent(encoded!)).toBe(service.buildOrderMessage(items))
  })

  it('el boton de contacto usa el mismo numero y un saludo', () => {
    const url = service.buildContactUrl()

    expect(url).toContain(`wa.me/${RUTASPORT_WHATSAPP_NUMBER}`)
    expect(decodeURIComponent(url.split('?text=')[1]!)).toContain('Hola RutaSport')
  })
})
```

- [ ] **Step 2: Ejecutar la prueba y verificar que falla**

Run: `npm test -- --watch=false`
Expected: FAIL — `Failed to resolve import "./whatsapp.service"`.

- [ ] **Step 3: Implementar el servicio**

```ts
import { Injectable } from '@angular/core'
import { CartItem } from './cart.service'
import { formatCOP } from '../shared/cop.pipe'

export const RUTASPORT_WHATSAPP_NUMBER = '573151322221'

const CONTACT_GREETING = 'Hola RutaSport, tengo una pregunta sobre un producto.'

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  buildOrderMessage(items: CartItem[]): string {
    const lines = ['Hola RutaSport, quiero confirmar este pedido:', '']

    items.forEach((item, index) => {
      const detail = [
        item.model ? `Modelo: ${item.model}` : null,
        item.size ? `Talla: ${item.size}` : null,
        `Cantidad: ${item.quantity}`,
      ]
        .filter((part): part is string => part !== null)
        .join(' · ')

      lines.push(`${index + 1}. ${item.name}`)
      lines.push(`   ${detail}`)
      lines.push(`   ${formatCOP(item.price)} c/u → ${formatCOP(item.price * item.quantity)}`)
    })

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    lines.push('')
    lines.push(`Total: ${formatCOP(total)}`)
    lines.push('')
    lines.push('Por favor cuadren el pago y el envío. Quedo atento.')

    return lines.join('\n')
  }

  buildUrl(message: string): string {
    return `https://wa.me/${RUTASPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  buildCheckoutUrl(items: CartItem[]): string {
    return this.buildUrl(this.buildOrderMessage(items))
  }

  buildContactUrl(): string {
    return this.buildUrl(CONTACT_GREETING)
  }

  private open(url: string): void {
    if (typeof window === 'undefined') return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  openCheckout(items: CartItem[]): void {
    this.open(this.buildCheckoutUrl(items))
  }

  openContact(): void {
    this.open(this.buildContactUrl())
  }
}
```

- [ ] **Step 4: Ejecutar la prueba y verificar que pasa**

Run: `npm test -- --watch=false`
Expected: PASS (4 pruebas nuevas; la prueba existente de `app.spec.ts` también debe pasar).

- [ ] **Step 5: Commit**

```bash
git add src/app/services/whatsapp.service.ts src/app/services/whatsapp.service.spec.ts
git commit -m "feat: agregar servicio para generar pedidos por WhatsApp"
```

---

### Task 2: Botones PAGAR y WhatsApp en el carrito

**Files:**
- Modify: `src/app/home/cart-drawer/cart-drawer.component.ts`
- Modify: `src/app/home/cart-drawer/cart-drawer.component.html`

**Interfaces:**
- Consumes: `WhatsappService.openCheckout(items: CartItem[])`, `WhatsappService.openContact()` del Task 1; `CartService.items()`, `CartService.clear()` existentes.
- Produces: botones funcionales en el pie del drawer.

- [ ] **Step 1: Reemplazar la lógica del componente**

Contenido completo de `cart-drawer.component.ts`:

```ts
import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CartService } from '../../services/cart.service'
import { WhatsappService } from '../../services/whatsapp.service'
import { CopPipe } from '../../shared/cop.pipe'

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, CopPipe],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  protected cart = inject(CartService)
  protected whatsapp = inject(WhatsappService)
  protected isClosing = signal(false)

  closeWithAnimation() {
    this.isClosing.set(true)
    setTimeout(() => {
      this.cart.close()
      this.isClosing.set(false)
    }, 320)
  }
}
```

- [ ] **Step 2: Quitar el bloque de alerta de stock del HTML**

Eliminar el bloque completo `@if (checkout.outOfStockItems().length > 0) { ... }` (líneas 50–88 del archivo original), incluida la variable `checkout` que ya no existe.

- [ ] **Step 3: Quitar el overlay de agotado de cada item**

Eliminar el bloque `@if (isOutOfStock(item)) { ... }` y el binding `[class.cart-item-oos]="isOutOfStock(item)"` del item del carrito.

- [ ] **Step 4: Reemplazar el pie del carrito**

Sustituir desde `<!-- Error message -->` hasta el final del `<!-- Badge ePayco -->` por:

```html
        <!-- Botones de pedido -->
        <div class="flex gap-3">
          <button
            (click)="whatsapp.openCheckout(cart.items())"
            class="cursor-pointer flex-[2] py-4 bg-[#E31C1C] hover:bg-[#C41515] active:scale-[0.99] text-white font-black tracking-widest transition-all flex items-center justify-center gap-2 text-sm rounded-2xl shadow-lg shadow-red-900/30">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            PAGAR
          </button>

          <button
            (click)="whatsapp.openContact()"
            class="cursor-pointer flex-1 py-4 bg-[#25D366] hover:bg-[#1EBE57] active:scale-[0.99] text-white font-black tracking-wide transition-all flex items-center justify-center gap-2 text-xs rounded-2xl shadow-lg shadow-green-900/30"
            aria-label="Escribir por WhatsApp a la tienda">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            WhatsApp
          </button>
        </div>

        <p class="text-center text-[11px] text-white/35 leading-relaxed">
          Pago y envío se acuerdan por WhatsApp al <strong class="text-white/60">315 132 2221</strong>.
        </p>
```

- [ ] **Step 5: Verificar que no queden referencias a `checkout` en el componente**

Run: `grep -n "checkout\|isOutOfStock\|epayco" src/app/home/cart-drawer/`
Expected: sin coincidencias.

- [ ] **Step 6: Commit**

```bash
git add src/app/home/cart-drawer/cart-drawer.component.ts src/app/home/cart-drawer/cart-drawer.component.html
git commit -m "feat: mostrar botones de pago y WhatsApp en el carrito"
```

---

### Task 3: Eliminar ePayco del front-end

**Files:**
- Delete: `src/app/services/checkout.service.ts`
- Delete: `src/app/services/epayco-checkout.service.ts`
- Delete: `src/app/pago/exitoso/exitoso.component.ts`
- Delete: `src/app/pago/exitoso/exitoso.component.html`
- Modify: `src/app/app.routes.ts`
- Modify: `src/app/terminos/terminos.component.html`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: aplicación sin referencias a ePayco en el cliente.

- [ ] **Step 1: Eliminar archivos**

```bash
git rm src/app/services/checkout.service.ts \
       src/app/services/epayco-checkout.service.ts \
       src/app/pago/exitoso/exitoso.component.ts \
       src/app/pago/exitoso/exitoso.component.html
```

- [ ] **Step 2: Quitar la ruta `pago/exitoso`**

En `src/app/app.routes.ts`, eliminar:

```ts
  {
    path: 'pago/exitoso',
    loadComponent: () => import('./pago/exitoso/exitoso.component').then(m => m.PagoExitosoComponent),
  },
```

- [ ] **Step 3: Reemplazar las secciones de ePayco en los términos**

En `src/app/terminos/terminos.component.html`, sustituir las secciones `5.5 Términos propios de ePayco` y `5.6 Datos tratados por ePayco` (dos `<h3>` y sus `<p>`) por:

```html
      <h3 class="font-semibold text-sm text-gray-800">5.5 Coordinación del pago</h3>
      <p class="text-sm text-gray-700 leading-relaxed">
        El pago y el envío se acuerdan directamente con RutaSport por WhatsApp al
        <strong>3151322221</strong>. RutaSport no solicita datos financieros sensibles por chat y confirmará la
        disponibilidad, el valor y la forma de entrega antes de despachar el pedido.
      </p>
```

- [ ] **Step 4: Verificar que no queden referencias**

Run: `grep -rni "epayco\|pago/exitoso\|CheckoutService" src/ || echo "sin referencias"`
Expected: sin referencias (excepto texto histórico permitido en `admin/tabs/orders-tab`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: eliminar ePayco y la pagina de pago del cliente"
```

---

### Task 4: Eliminar el backend de ePayco y las dependencias

**Files:**
- Delete: `functions/api/orders.ts`
- Delete: `functions/api/epayco/epayco.service.ts`
- Delete: `functions/api/epayco/transaction.ts`
- Delete: `functions/api/epayco/webhook.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: sin endpoints de pago; la API pública de productos sigue intacta.

- [ ] **Step 1: Eliminar los archivos de Functions**

```bash
git rm functions/api/orders.ts functions/api/epayco/epayco.service.ts \
       functions/api/epayco/transaction.ts functions/api/epayco/webhook.ts
```

- [ ] **Step 2: Quitar dependencias npm de ePayco**

En `package.json`, eliminar estas dos líneas de `dependencies`:

```json
    "epayco-checkout-community-sdk": "^1.0.1",
    "epayco-sdk-node": "^1.4.4",
```

- [ ] **Step 3: Regenerar el lockfile**

```bash
npm install
```

Expected: `package-lock.json` actualizado sin los paquetes de ePayco.

- [ ] **Step 4: Verificar el build**

```bash
npm run build
```

Expected: compilación exitosa. `dist/CalzadoAndres/browser` generado.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: quitar endpoints y dependencias de ePayco"
```

---

### Task 5: Documentación y verificación en producción

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: flujo implementado en Tasks 1–4.
- Produces: repo documentado y cambio publicado en `main`.

- [ ] **Step 1: Actualizar el README**

En `README.md`:
- Quitar la línea de **Pago en línea integrado con Epayco** y reemplazarla por **Pedidos por WhatsApp: el cliente confirma el modelo y la tienda cuadra pago y envío**.
- En la tabla del stack, cambiar la fila `| Pagos | Epayco |` por `| Pedidos | WhatsApp (wa.me) |`.
- En Variables de entorno, eliminar las tres líneas `EPAYCO_*` y dejar solo:
  ```
  GMAIL_USER=
  GMAIL_APP_PASSWORD=
  ```
  acompañadas de la nota de que ya no se requieren credenciales de pasarela.

- [ ] **Step 2: Ejecutar pruebas y build finales**

```bash
npm test -- --watch=false && npm run build
```

Expected: todas las pruebas pasan y el build compila.

- [ ] **Step 3: Commits, push y despliegue**

```bash
git add README.md docs/superpowers/
git commit -m "docs: documentar checkout por WhatsApp"
git push origin main
```

Cloudflare Pages despliega automáticamente desde `main`.

- [ ] **Step 4: Verificar producción**

Run: `curl -s https://ruta-sport.com/api/products | head -c 200`
Expected: JSON de productos, sin error 500.

- [ ] **Step 5: Entregar nota opcional al usuario**

Comandos para borrar secrets sin uso (no ejecutar automáticamente):

```bash
npx wrangler pages secret delete EPAYCO_PUBLIC_KEY --project-name rutasport
npx wrangler pages secret delete EPAYCO_PRIVATE_KEY --project-name rutasport
npx wrangler pages secret delete EPAYCO_CUSTOMER_ID --project-name rutasport
npx wrangler pages secret delete EPAYCO_TEST --project-name rutasport
```
