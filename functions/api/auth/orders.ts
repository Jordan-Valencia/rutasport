import { getAuthenticatedUser, jsonOk, jsonErr, CORS_OPTIONS } from './_helpers'

interface Env { DB: D1Database }

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const user = await getAuthenticatedUser(request, env.DB)
  if (!user) return jsonErr('No autenticado', 401)

  const orders = await env.DB
    .prepare(`
      SELECT id, reference, status, shipping_status, tracking_number,
             shipping_notes, total_in_cents, createdAt, updatedAt
      FROM orders
      WHERE user_id = ?
      ORDER BY createdAt DESC
    `)
    .bind(user.id)
    .all<any>()

  if (!orders.results.length) return jsonOk([])

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

  return jsonOk(orders.results.map(o => ({ ...o, items: byOrder[o.id] ?? [] })))
}
