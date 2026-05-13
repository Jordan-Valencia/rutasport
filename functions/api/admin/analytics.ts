interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const [daily, topPages, totals, orderStats] = await Promise.all([
      env.DB.prepare(`
        SELECT date(created_at) AS day,
               COUNT(*)                          AS views,
               COUNT(DISTINCT session_id)        AS sessions
        FROM pageviews
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY day
        ORDER BY day ASC
      `).all<any>(),

      env.DB.prepare(`
        SELECT path, COUNT(*) AS views
        FROM pageviews
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY path
        ORDER BY views DESC
        LIMIT 10
      `).all<any>(),

      env.DB.prepare(`
        SELECT
          COUNT(*)                                                                       AS total,
          COUNT(CASE WHEN created_at >= datetime('now', '-1 day')  THEN 1 END)          AS today,
          COUNT(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 END)          AS week,
          COUNT(DISTINCT CASE WHEN created_at >= datetime('now', '-30 days') THEN session_id END) AS unique_sessions
        FROM pageviews
      `).first<any>(),

      env.DB.prepare(`
        SELECT
          COUNT(*)                                                                  AS total,
          COUNT(CASE WHEN status = 'APPROVED' THEN 1 END)                          AS approved,
          COUNT(CASE WHEN status = 'PENDING'  THEN 1 END)                          AS pending,
          SUM(CASE WHEN status = 'APPROVED' THEN total_in_cents ELSE 0 END) / 100  AS revenue_cop
        FROM orders
      `).first<any>(),
    ])

    return json({ daily: daily.results, topPages: topPages.results, totals, orderStats })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
