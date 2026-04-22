import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

export interface CartItem {
  productId: number
  name: string
  brand?: string
  price: string
  image: string
  size?: string
  quantity: number
}

const WHATSAPP_NUMBER = '573011186124'

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID)

  items = signal<CartItem[]>([])
  isOpen = signal(false)

  readonly count = computed(() => this.items().reduce((a, i) => a + i.quantity, 0))

  readonly totalCOP = computed(() =>
    this.items().reduce((acc, item) => {
      const num = parseInt(item.price.replace(/[^\d]/g, '')) || 0
      return acc + num * item.quantity
    }, 0)
  )

  readonly totalFormatted = computed(() =>
    '$' + this.totalCOP().toLocaleString('es-CO')
  )

  open()   { this.isOpen.set(true) }
  close()  { this.isOpen.set(false) }
  toggle() { this.isOpen.update(v => !v) }

  add(item: Omit<CartItem, 'quantity'>) {
    const idx = this.items().findIndex(
      i => i.productId === item.productId && i.size === item.size
    )
    if (idx >= 0) {
      this.items.update(arr => arr.map((i, n) => n === idx ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      this.items.update(arr => [...arr, { ...item, quantity: 1 }])
    }
    this.open()
  }

  remove(index: number) { this.items.update(arr => arr.filter((_, i) => i !== index)) }

  increment(index: number) {
    this.items.update(arr => arr.map((i, n) => n === index ? { ...i, quantity: i.quantity + 1 } : i))
  }

  decrement(index: number) {
    const item = this.items()[index]
    if (item.quantity <= 1) {
      this.remove(index)
    } else {
      this.items.update(arr => arr.map((i, n) => n === index ? { ...i, quantity: i.quantity - 1 } : i))
    }
  }

  clear() { this.items.set([]) }

  checkout() {
    if (!isPlatformBrowser(this.platformId)) return
    const lines = this.items().map(item => {
      const size  = item.size  ? ` - Talla: ${item.size}` : ''
      const brand = item.brand ? ` (${item.brand})` : ''
      return `• ${item.name}${brand}${size} × ${item.quantity} — ${item.price}`
    })
    const msg = `Hola, quisiera hacer el siguiente pedido:\n\n${lines.join('\n')}\n\n*Total: ${this.totalFormatted()} + envío*`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }
}
