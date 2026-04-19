interface Env { DB: D1Database }

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    if (!b.campaignName || !b.category || !b.imageUrl) {
      return json({ error: 'Missing required fields: campaignName, category, imageUrl' }, 400)
    }
    const result = await env.DB.prepare(
      'UPDATE heroes SET campaignName=?, category=?, description=?, imageUrl=?, videoUrl=?, ctaText=?, isActive=?, "order"=? WHERE id=?'
    ).bind(b.campaignName, b.category, b.description || null, b.imageUrl, b.videoUrl || null, b.ctaText || 'COMPRAR AHORA', b.isActive ? 1 : 0, b.order ?? 0, params.id).run()
    if (result.meta.changes === 0) return json({ error: 'Hero not found' }, 404)
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
