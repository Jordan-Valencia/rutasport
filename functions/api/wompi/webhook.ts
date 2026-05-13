interface Env {
  DB: D1Database
  WOMPI_EVENTS_KEY: string
}

interface WompiEvent {
  event: string
  data: {
    transaction: {
      id: string
      reference: string
      status: string
      amount_in_cents: number
    }
  }
  timestamp: number
  signature: {
    checksum: string
    properties: string[]
  }
}

async function sha256hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((o, k) => o?.[k], obj)?.toString() ?? ''
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const event = await request.json() as WompiEvent

    // Verificar firma del webhook
    // checksum = SHA256(property_values + timestamp + events_secret)
    const propertyValues = event.signature.properties.map(p => getNestedValue(event, p))
    const stringToHash = [...propertyValues, event.timestamp, env.WOMPI_EVENTS_KEY].join('')
    const expected = await sha256hex(stringToHash)

    if (expected !== event.signature.checksum) {
      return new Response('Firma inválida', { status: 401 })
    }

    const { id, reference, status } = event.data.transaction

    // Obtener la orden para poder consultar sus items
    const order = await env.DB
      .prepare('SELECT id FROM orders WHERE reference = ?')
      .bind(reference)
      .first<{ id: number }>()

    await env.DB
      .prepare('UPDATE orders SET status = ?, wompi_transaction_id = ? WHERE reference = ?')
      .bind(status, id, reference)
      .run()

    // Si el pago falló, liberar el stock reservado
    if (order && (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR')) {
      const items = await env.DB
        .prepare('SELECT product_id, size, quantity FROM order_items WHERE order_id = ?')
        .bind(order.id)
        .all<{ product_id: number; size: string | null; quantity: number }>()

      for (const item of items.results) {
        if (!item.size) continue
        // Las tallas en order_items están como "US7.5"; inventory las guarda sin prefijo
        const rawSize = item.size.replace(/^US/i, '')
        await env.DB
          .prepare('UPDATE product_inventory SET stock = stock + ? WHERE product_id = ? AND size = ?')
          .bind(item.quantity, item.product_id, rawSize)
          .run()
      }
    }

    return new Response('OK', { status: 200 })
  } catch (e: any) {
    return new Response(e.message ?? 'Error', { status: 500 })
  }
}
