interface Env { DB: D1Database }

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  const result = await env.DB.prepare('SELECT * FROM feature_banners ORDER BY "order" ASC').all()
  return json(result.results)
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  const b = await request.json() as any
  const result = await env.DB.prepare(
    'INSERT INTO feature_banners (title, subtitle, description, image, buttonText, bgColor, "order", isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(b.title, b.subtitle, b.description || null, b.image, b.buttonText, b.bgColor, b.order ?? 0, b.isActive ? 1 : 0).run()
  return json({ id: result.meta.last_row_id }, 201)
}
