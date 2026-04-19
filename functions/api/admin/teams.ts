interface Env { DB: D1Database }

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const result = await env.DB.prepare('SELECT * FROM teams ORDER BY id ASC').all()
    return json(result.results)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    if (!b.name || !b.country || !b.type) {
      return json({ error: 'Missing required fields: name, country, type' }, 400)
    }
    const result = await env.DB.prepare(
      'INSERT INTO teams (name, country, type, logo) VALUES (?, ?, ?, ?)'
    ).bind(b.name, b.country, b.type, b.logo || null).run()
    return json({ id: result.meta.last_row_id }, 201)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
