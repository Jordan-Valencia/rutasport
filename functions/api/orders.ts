interface Env {
  DB: D1Database
  WOMPI_PUBLIC_KEY: string
  WOMPI_INTEGRITY_KEY: string
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

async function sha256hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as { items: OrderItem[] }

    if (!body.items?.length) {
      return new Response(JSON.stringify({ error: 'Carrito vacío' }), { status: 400, headers })
    }

    // Asociar orden al usuario autenticado (opcional)
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

    // Verificar y reservar stock por talla
    // Las tallas llegan como "US7.5" desde el carrito; inventory las guarda sin prefijo ("7.5")
    for (const item of body.items) {
      const rawSize = item.size ? item.size.replace(/^US/i, '') : null
      if (!rawSize) continue

      const inv = await env.DB
        .prepare('SELECT stock FROM product_inventory WHERE product_id = ? AND size = ?')
        .bind(item.productId, rawSize)
        .first<{ stock: number }>()

      if (!inv || inv.stock < item.quantity) {
        return new Response(
          JSON.stringify({ error: `Sin stock disponible para talla ${item.size}` }),
          { status: 409, headers }
        )
      }
    }

    // Decrementar stock (reserva atómica por item)
    for (const item of body.items) {
      const rawSize = item.size ? item.size.replace(/^US/i, '') : null
      if (!rawSize) continue
      await env.DB
        .prepare(`UPDATE product_inventory SET stock = stock - ?
                  WHERE product_id = ? AND size = ? AND stock >= ?`)
        .bind(item.quantity, item.productId, rawSize, item.quantity)
        .run()
    }

    // Total en pesos COP → centavos para Wompi
    const totalCOP = body.items.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0)
    const amountInCents = totalCOP * 100

    // Referencia única
    const reference = `RS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    // Crear orden en DB
    const order = await env.DB
      .prepare(`INSERT INTO orders (reference, status, total_in_cents, user_id) VALUES (?, 'PENDING', ?, ?) RETURNING id`)
      .bind(reference, amountInCents, userId)
      .first<{ id: number }>()

    if (!order) throw new Error('Error al crear la orden')

    // Insertar items
    const stmts = body.items.map(item =>
      env.DB.prepare(
        `INSERT INTO order_items (order_id, product_id, name, brand, model, size, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(order.id, item.productId, item.name, item.brand ?? null, item.model ?? null, item.size ?? null, Math.round(Number(item.price)), item.quantity)
    )
    await env.DB.batch(stmts)

    // Firma de integridad: SHA256(reference + amountInCents + "COP" + integrityKey)
    const signature = await sha256hex(`${reference}${amountInCents}COP${env.WOMPI_INTEGRITY_KEY}`)

    // URL de retorno según el host de la petición
    const origin = new URL(request.url).origin
    const redirectUrl = `${origin}/pago/exitoso`

    const wompiUrl = new URL('https://checkout.wompi.co/p/')
    wompiUrl.searchParams.set('public-key', env.WOMPI_PUBLIC_KEY)
    wompiUrl.searchParams.set('currency', 'COP')
    wompiUrl.searchParams.set('amount-in-cents', amountInCents.toString())
    wompiUrl.searchParams.set('reference', reference)
    wompiUrl.searchParams.set('signature:integrity', signature)
    wompiUrl.searchParams.set('redirect-url', redirectUrl)

    return new Response(
      JSON.stringify({ orderId: order.id, reference, wompiUrl: wompiUrl.toString() }),
      { headers }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? 'Error interno' }),
      { status: 500, headers }
    )
  }
}
