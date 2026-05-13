import { Injectable, signal, computed } from '@angular/core'
import { formatCOP } from '../shared/cop.pipe'

export interface CartItem {
  productId: number
  name: string
  brand?: string
  model?: string
  price: number
  image: string
  size?: string
  quantity: number
  maxStock?: number  // stock máximo disponible para esta talla al momento de agregar
}

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>([])
  isOpen = signal(false)

  readonly count = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  )

  readonly totalCOP = computed(() =>
    this.items().reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  readonly totalFormatted = computed(() => formatCOP(this.totalCOP()))

  open() { this.isOpen.set(true) }
  close() { this.isOpen.set(false) }
  toggle() { this.isOpen.update(v => !v) }

  add(item: Omit<CartItem, 'quantity'>) {
    const idx = this.items().findIndex(
      i => i.productId === item.productId && i.size === item.size && i.model === item.model
    )

    if (idx >= 0) {
      this.items.update(arr =>
        arr.map((i, n) => {
          if (n !== idx) return i
          const limit = item.maxStock ?? i.maxStock
          if (limit !== undefined && i.quantity >= limit) return i
          return { ...i, quantity: i.quantity + 1, maxStock: item.maxStock ?? i.maxStock }
        })
      )
    } else {
      this.items.update(arr => [...arr, { ...item, quantity: 1 }])
    }

    this.open()
  }

  remove(index: number) {
    this.items.update(arr => arr.filter((_, i) => i !== index))
  }

  increment(index: number) {
    const item = this.items()[index]
    if (!item) return
    if (item.maxStock !== undefined && item.quantity >= item.maxStock) return
    this.items.update(arr =>
      arr.map((i, n) => n === index ? { ...i, quantity: i.quantity + 1 } : i)
    )
  }

  atMaxStock(index: number): boolean {
    const item = this.items()[index]
    if (!item || item.maxStock === undefined) return false
    return item.quantity >= item.maxStock
  }

  decrement(index: number) {
    const item = this.items()[index]
    if (!item) return

    if (item.quantity <= 1) {
      this.remove(index)
    } else {
      this.items.update(arr =>
        arr.map((i, n) => n === index ? { ...i, quantity: i.quantity - 1 } : i)
      )
    }
  }

  clear() {
    this.items.set([])
  }
}
