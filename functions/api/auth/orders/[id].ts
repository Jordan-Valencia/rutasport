import { getAuthenticatedUser, jsonOk, jsonErr, CORS_OPTIONS } from '../_helpers'

interface Env { DB: D1Database }

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestGet: PagesFunction<Env> = async ({ env, request, params }) => {
  const user = await getAuthenticatedUser(request, env.DB)
  if (!user) return jsonErr('No autenticado', 401)

  const id = Number(params['id'])
  if (!id) return jsonErr('ID inválido', 400)

  const order = await env.DB
    .prepare(`
      SELECT id, reference, status, shipping_status, tracking_number,
             shipping_notes, total_in_cents, createdAt, updatedAt,
             cancelled_at, cancel_reason
      FROM orders
      WHERE id = ? AND user_id = ?
    `)
    .bind(id, user.id)
    .first<any>()

  if (!order) return jsonErr('Pedido no encontrado', 404)

  const items = await env.DB
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .bind(order.id)
    .all<any>()

  return jsonOk({ ...order, items: items.results })
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request, params }) => {
  const user = await getAuthenticatedUser(request, env.DB)
  if (!user) return jsonErr('No autenticado', 401)

  const id = Number(params['id'])
  if (!id) return jsonErr('ID inválido', 400)

  const order = await env.DB
    .prepare('SELECT id, status, user_id FROM orders WHERE id = ? AND user_id = ?')
    .bind(id, user.id)
    .first<{ id: number; status: string; user_id: number }>()

  if (!order) return jsonErr('Pedido no encontrado', 404)

  const cancellable = ['PENDING', 'RESERVED']
  if (!cancellable.includes(order.status)) {
    return jsonErr('Este pedido ya no puede cancelarse', 400)
  }

  await env.DB
    .prepare("UPDATE orders SET status = 'CANCELLED', cancelled_at = datetime('now'), cancel_reason = 'Cancelado por el usuario', updatedAt = datetime('now') WHERE id = ?")
    .bind(id)
    .run()

  return jsonOk({ ok: true, message: 'Pedido cancelado correctamente' })
}
