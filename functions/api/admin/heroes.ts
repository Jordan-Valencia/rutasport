interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const result = await env.DB.prepare('SELECT * FROM heroes ORDER BY "order" ASC').all()
    return json(result.results)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    const result = await env.DB.prepare(
      'INSERT INTO heroes (campaignName, category, description, imageUrl, ctaText, isActive, "order") VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(b.campaignName || null, b.category || null, b.description || null, b.imageUrl || null, b.ctaText || 'COMPRAR AHORA', b.isActive ? 1 : 0, b.order ?? 0).run()
    return json({ id: result.meta.last_row_id }, 201)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
