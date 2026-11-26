import { Injectable } from '@angular/core'
import { CartItem } from './cart.service'
import { formatCOP } from '../shared/cop.pipe'

export const RUTASPORT_WHATSAPP_NUMBER = '573151322221'

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

  private open(url: string): void {
    if (typeof window === 'undefined') return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  openCheckout(items: CartItem[]): void {
    this.open(this.buildCheckoutUrl(items))
  }
}
