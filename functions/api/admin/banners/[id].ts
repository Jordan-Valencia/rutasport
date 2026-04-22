interface Env { DB: D1Database }

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const existing = await env.DB.prepare('SELECT * FROM feature_banners WHERE id = ?').bind(params.id).first() as any
    if (!existing) return json({ error: 'Banner not found' }, 404)
    const b = await request.json() as any
    const m = { ...existing, ...b }
    await env.DB.prepare(
      'UPDATE feature_banners SET title=?, subtitle=?, description=?, image=?, buttonText=?, bgColor=?, "order"=?, isActive=? WHERE id=?'
    ).bind(m.title || null, m.subtitle || null, m.description || null, m.image || null, m.buttonText || null, m.bgColor || null, m.order ?? 0, m.isActive ? 1 : 0, params.id).run()
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const result = await env.DB.prepare('DELETE FROM feature_banners WHERE id = ?').bind(params.id).run()
    if (result.meta.changes === 0) return json({ error: 'Banner not found' }, 404)
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
