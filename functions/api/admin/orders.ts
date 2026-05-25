interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const url = new URL(request.url)

    // Pagination
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') ?? '50', 10) || 50))
    const offset = (page - 1) * limit

    // Date filters
    const dateFrom = url.searchParams.get('dateFrom') ?? ''
    const dateTo = url.searchParams.get('dateTo') ?? ''

    // Search
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()

    // Sort
    const sort = url.searchParams.get('sort') ?? 'createdAt'
    const order = url.searchParams.get('order') === 'asc' ? 'ASC' : 'DESC'
    const allowedSorts: Record<string, string> = {
      createdAt: 'o.createdAt',
      total_in_cents: 'o.total_in_cents',
      status: 'o.status',
    }
    const sortCol = allowedSorts[sort] ?? 'o.createdAt'

    const conditions: string[] = []
    const params: any[] = []

    if (dateFrom) { conditions.push('o.createdAt >= ?'); params.push(dateFrom) }
    if (dateTo) { conditions.push('o.createdAt <= ?'); params.push(dateTo + 'T23:59:59') }
    if (search) {
      conditions.push(`(LOWER(o.reference) LIKE ? OR LOWER(u.email) LIKE ? OR LOWER(u.full_name) LIKE ?)`)
      const q = `%${search}%`
      params.push(q, q, q)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    // Count total for pagination
    const countResult = await env.DB
      .prepare(`SELECT COUNT(*) as total FROM orders o LEFT JOIN users u ON u.id = o.user_id ${where}`)
      .bind(...params)
      .first<{ total: number }>()

    const totalOrders = countResult?.total ?? 0

    const orders = await env.DB
      .prepare(`
        SELECT o.id, o.reference, o.status, o.shipping_status, o.tracking_number,
               o.shipping_notes, o.total_in_cents, o.epayco_refpayco, o.createdAt,
               o.updatedAt, o.cancelled_at, o.cancel_reason,
               u.id   AS user_id,
               u.email AS user_email,
               u.full_name AS user_name,
               u.phone AS user_phone,
               u.region AS user_region,
               u.city AS user_city,
               u.address AS user_address
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        ${where}
        ORDER BY ${sortCol} ${order}
        LIMIT ? OFFSET ?
      `)
      .bind(...params, limit, offset)
      .all<any>()

    if (!orders.results.length) return json({ items: [], total: 0, page, limit })

    const ids = orders.results.map(o => o.id)
    const placeholders = ids.map(() => '?').join(',')
    const items = await env.DB
      .prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`)
      .bind(...ids)
      .all<any>()

    const byOrder: Record<number, any[]> = {}
    for (const item of items.results) {
      if (!byOrder[item.order_id]) byOrder[item.order_id] = []
      byOrder[item.order_id].push(item)
    }

    return json({
      items: orders.results.map(o => ({ ...o, items: byOrder[o.id] ?? [] })),
      total: totalOrders,
      page,
      limit,
    })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
