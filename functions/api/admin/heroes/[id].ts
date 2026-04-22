interface Env { DB: D1Database }

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const existing = await env.DB.prepare('SELECT * FROM heroes WHERE id = ?').bind(params.id).first() as any
    if (!existing) return json({ error: 'Hero not found' }, 404)
    const b = await request.json() as any
    const merged = { ...existing, ...b }
    await env.DB.prepare(
      'UPDATE heroes SET campaignName=?, category=?, description=?, imageUrl=?, ctaText=?, isActive=?, "order"=? WHERE id=?'
    ).bind(merged.campaignName || null, merged.category || null, merged.description || null, merged.imageUrl || null, merged.ctaText || 'COMPRAR AHORA', merged.isActive ? 1 : 0, merged.order ?? 0, params.id).run()
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const result = await env.DB.prepare('DELETE FROM heroes WHERE id = ?').bind(params.id).run()
    if (result.meta.changes === 0) return json({ error: 'Hero not found' }, 404)
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
