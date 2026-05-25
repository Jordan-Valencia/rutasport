import { EpaycoService } from './epayco.service'

interface Env {
  DB: D1Database
  EPAYCO_PUBLIC_KEY: string
  EPAYCO_PRIVATE_KEY: string
  EPAYCO_CUSTOMER_ID: string
  EPAYCO_TEST: string
}

function getEpaycoService(env: Env): EpaycoService {
  return new EpaycoService({
    publicKey: env.EPAYCO_PUBLIC_KEY,
    privateKey: env.EPAYCO_PRIVATE_KEY,
    customerId: env.EPAYCO_CUSTOMER_ID,
    test: env.EPAYCO_TEST !== 'false',
  })
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const epayco = getEpaycoService(env)
    const data = await epayco.parseWebhookBody(request)

    const refPayco = data.x_ref_payco ?? data.ref_payco ?? ''
    const transactionId = data.x_transaction_id ?? ''
    const amount = data.x_amount ?? ''
    const currency = data.x_currency_code ?? 'COP'
    const signature = data.x_signature ?? ''
    const response = data.x_response ?? ''
    const extra1 = data.x_extra1 ?? ''

    const isValid = await epayco.verifyWebhookSignature({
      refPayco,
      transactionId,
      amount,
      currency,
      signature,
      response,
      extra1,
      raw: data,
    })

    if (!isValid) {
      return new Response('Firma inválida', { status: 401 })
    }

    const reference = data.x_id_factura ?? data.x_id_invoice ?? data.x_extra1 ?? ''
    if (!reference) {
      return new Response('Referencia no encontrada', { status: 400 })
    }

    const order = await env.DB
      .prepare('SELECT id, status, total_in_cents FROM orders WHERE reference = ?')
      .bind(reference)
      .first<{ id: number; status: string; total_in_cents: number }>()

    if (!order) {
      return new Response('Orden no encontrada', { status: 404 })
    }

    if (order.status === 'APPROVED') {
      return new Response('OK', { status: 200 })
    }

    const parsedAmount = parseInt(amount, 10)
    if (parsedAmount !== order.total_in_cents) {
      return new Response('Monto no coincide con la orden', { status: 400 })
    }

    const status = epayco.mapWebhookStatus(response)

    if (status === 'APPROVED') {
      const items = await env.DB
        .prepare('SELECT product_id, size, quantity FROM order_items WHERE order_id = ?')
        .bind(order.id)
        .all<{ product_id: number; size: string | null; quantity: number }>()

      for (const item of items.results) {
        if (!item.size) continue
        const rawSize = item.size.replace(/^US/i, '')
        await env.DB
          .prepare('UPDATE product_inventory SET stock = stock - ? WHERE product_id = ? AND size = ? AND stock >= ?')
          .bind(item.quantity, item.product_id, rawSize, item.quantity)
          .run()
      }
    }

    await env.DB
      .prepare("UPDATE orders SET status = ?, epayco_refpayco = ?, updatedAt = datetime('now') WHERE reference = ?")
      .bind(status, refPayco, reference)
      .run()

    return new Response('OK', { status: 200 })
  } catch (e: any) {
    return new Response(e.message ?? 'Error', { status: 500 })
  }
}
