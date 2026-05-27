import { EpaycoService } from './epayco/epayco.service'

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

interface OrderItem {
  productId: number
  name: string
  brand?: string
  model?: string
  price: number
  size?: string
  quantity: number
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as { items: OrderItem[] }

    if (!body.items?.length) {
      return new Response(JSON.stringify({ error: 'Carrito vacío' }), { status: 400, headers })
    }

    let userId: number | null = null
    const authHeader = request.headers.get('Authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (token) {
      const session = await env.DB
        .prepare(`SELECT user_id FROM user_sessions WHERE token = ? AND datetime(expires_at) > datetime('now')`)
        .bind(token)
        .first<{ user_id: number }>()
      userId = session?.user_id ?? null
    }

    for (const item of body.items) {
      const rawSize = item.size ? item.size.replace(/^US/i, '') : null
      if (!rawSize) continue

      const inv = await env.DB
        .prepare('SELECT stock FROM product_inventory WHERE product_id = ? AND size = ?')
        .bind(item.productId, rawSize)
        .first<{ stock: number }>()

      if (!inv || inv.stock < item.quantity) {
        return new Response(
          JSON.stringify({
            error: 'Sin stock disponible',
            outOfStock: [{
              productId: item.productId,
              size: item.size,
              name: item.name,
              available: inv?.stock ?? 0,
            }],
          }),
          { status: 409, headers }
        )
      }
    }

    const totalCOP = body.items.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0)
    const reference = `RS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    const order = await env.DB
      .prepare(`INSERT INTO orders (reference, status, total_in_cents, user_id) VALUES (?, 'RESERVED', ?, ?) RETURNING id`)
      .bind(reference, totalCOP, userId)
      .first<{ id: number }>()

    if (!order) throw new Error('Error al crear la orden')

    const stmts = body.items.map(item =>
      env.DB.prepare(
        `INSERT INTO order_items (order_id, product_id, name, brand, model, size, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(order.id, item.productId, item.name, item.brand ?? null, item.model ?? null, item.size ?? null, Math.round(Number(item.price)), item.quantity)
    )
    await env.DB.batch(stmts)

    const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '0.0.0.0'
    const origin = new URL(request.url).origin

    const epayco = getEpaycoService(env)

    let billing: { email?: string; name?: string } | undefined
    if (userId) {
      const user = await env.DB
        .prepare('SELECT email, full_name FROM users WHERE id = ?')
        .bind(userId)
        .first<{ email: string; full_name: string | null }>()
      if (user) {
        billing = {
          email: user.email,
          ...(user.full_name ? { name: user.full_name } : {}),
        }
      }
    }

    const session = await epayco.createSession({
      invoice: reference,
      description: `Pedido ${reference}`,
      amount: totalCOP,
      ip: clientIp,
      responseUrl: `${origin}/pago/exitoso`,
      confirmationUrl: `${origin}/api/epayco/webhook`,
      ...(billing ? { billing } : {}),
    })

    return new Response(
      JSON.stringify({
        orderId: order.id,
        reference,
        totalCOP,
        sessionId: session.sessionId,
        test: epayco.isTest,
      }),
      { headers }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? 'Error interno', name: e.name, stack: e.stack }),
      { status: 500, headers }
    )
  }
}
