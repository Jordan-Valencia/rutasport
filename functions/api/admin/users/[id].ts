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
      full_name?: string
      email?: string
      phone?: string
      address?: string
    }

    const current = await env.DB
      .prepare('SELECT id, email, full_name, phone, address FROM users WHERE id = ?')
      .bind(id)
      .first<any>()

    if (!current) return json({ error: 'Usuario no encontrado' }, 404)

    const newEmail = body.email?.trim() || current.email
    if (newEmail !== current.email) {
      const conflict = await env.DB
        .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .bind(newEmail, id)
        .first()
      if (conflict) return json({ error: 'Email ya en uso' }, 409)
    }

    await env.DB
      .prepare(`
        UPDATE users
        SET full_name = ?, email = ?, phone = ?, address = ?
        WHERE id = ?
      `)
      .bind(
        body.full_name !== undefined ? (body.full_name || null) : current.full_name,
        newEmail,
        body.phone    !== undefined ? (body.phone    || null) : current.phone,
        body.address  !== undefined ? (body.address  || null) : current.address,
        id,
      )
      .run()

    return json({ ok: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
