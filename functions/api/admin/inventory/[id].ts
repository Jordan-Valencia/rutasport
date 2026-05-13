// GET  /api/admin/inventory/:id  → stock por talla para el producto
// PUT  /api/admin/inventory/:id  → { size, stock } para actualizar una talla
interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const result = await env.DB
      .prepare('SELECT size, stock FROM product_inventory WHERE product_id = ? ORDER BY CAST(size AS REAL)')
      .bind(params.id)
      .all()
    return json(result.results)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as { size: string; stock: number }
    if (!b.size || typeof b.stock !== 'number' || b.stock < 0) {
      return json({ error: 'size y stock (>= 0) son requeridos' }, 400)
    }
    await env.DB
      .prepare('UPDATE product_inventory SET stock = ? WHERE product_id = ? AND size = ?')
      .bind(b.stock, params.id, b.size)
      .run()
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
