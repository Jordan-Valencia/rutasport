interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const id = Number(params['id'])
    if (!id) return json({ error: 'ID inválido' }, 400)

    const body = await request.json() as {
      shipping_status?: string
      tracking_number?: string
      shipping_notes?: string
    }

    const current = await env.DB
      .prepare('SELECT id, shipping_status, tracking_number, shipping_notes FROM orders WHERE id = ?')
      .bind(id)
      .first<any>()

    if (!current) return json({ error: 'Orden no encontrada' }, 404)

    await env.DB
      .prepare(`
        UPDATE orders
        SET shipping_status  = ?,
            tracking_number  = ?,
            shipping_notes   = ?
        WHERE id = ?
      `)
      .bind(
        body.shipping_status  ?? current.shipping_status,
        body.tracking_number  !== undefined ? (body.tracking_number || null) : current.tracking_number,
        body.shipping_notes   !== undefined ? (body.shipping_notes  || null) : current.shipping_notes,
        id,
      )
      .run()

    return json({ ok: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
