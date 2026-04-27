interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    if (!b.name) return json({ error: 'Missing required field: name' }, 400)
    const result = await env.DB.prepare(
      'UPDATE categories SET name=?, "order"=?, isActive=? WHERE id=?'
    ).bind(b.name, b.order ?? 0, b.isActive ? 1 : 0, params.id).run()
    if (result.meta.changes === 0) return json({ error: 'Category not found' }, 404)
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    await env.DB.prepare('DELETE FROM product_categories WHERE category_id = ?').bind(params.id).run()
    const result = await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(params.id).run()
    if (result.meta.changes === 0) return json({ error: 'Category not found' }, 404)
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
