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
})
