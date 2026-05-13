interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const users = await env.DB
      .prepare(`
        SELECT u.id, u.email, u.full_name, u.phone, u.address, u.createdAt,
               COUNT(o.id) AS order_count
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        GROUP BY u.id
        ORDER BY u.createdAt DESC
      `)
      .all<any>()
    return json(users.results)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
