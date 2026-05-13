interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const orders = await env.DB
      .prepare(`
        SELECT o.id, o.reference, o.status, o.shipping_status, o.tracking_number,
               o.shipping_notes, o.total_in_cents, o.wompi_transaction_id, o.createdAt,
               u.id   AS user_id,
               u.email AS user_email,
               u.full_name AS user_name,
               u.phone AS user_phone,
               u.region AS user_region,
               u.city AS user_city,
               u.address AS user_address
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        ORDER BY o.createdAt DESC
        LIMIT 500
      `)
      .all<any>()

    if (!orders.results.length) return json([])

    const ids = orders.results.map(o => o.id)
    const placeholders = ids.map(() => '?').join(',')
    const items = await env.DB
      .prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`)
      .bind(...ids)
      .all<any>()

    const byOrder: Record<number, any[]> = {}
    for (const item of items.results) {
      if (!byOrder[item.order_id]) byOrder[item.order_id] = []
      byOrder[item.order_id].push(item)
    }

    return json(orders.results.map(o => ({ ...o, items: byOrder[o.id] ?? [] })))
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
