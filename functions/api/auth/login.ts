import { Env, jsonOk, jsonErr, CORS_OPTIONS, verifyPassword, generateToken, setSessionCookie, JSON_HEADERS } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as { email?: string; password?: string }

    const email = body.email?.trim().toLowerCase()
    const password = body.password?.trim()

    if (!email || !password) return jsonErr('Email y contraseña son requeridos')

    const row = await env.DB
      .prepare('SELECT id, email, password_hash, full_name, phone, address, createdAt FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: number; email: string; password_hash: string; full_name: string | null; phone: string | null; address: string | null; createdAt: string }>()

    if (!row) return jsonErr('Credenciales incorrectas', 401)

    const valid = await verifyPassword(password, row.password_hash)
    if (!valid) return jsonErr('Credenciales incorrectas', 401)

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    await env.DB
      .prepare('INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)')
      .bind(row.id, token, expiresAt)
      .run()

    const { password_hash: _, ...user } = row

    return new Response(JSON.stringify({ token, user }), {
      status: 200,
      headers: {
        ...JSON_HEADERS,
        'Set-Cookie': setSessionCookie(token),
      },
    })
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
