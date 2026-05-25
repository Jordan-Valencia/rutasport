import { Env, jsonOk, jsonErr, CORS_OPTIONS, JSON_HEADERS } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as { token?: string; password?: string }
    const { token, password } = body

    if (!token) return jsonErr('Token requerido')
    if (!password || password.length < 6) return jsonErr('La contraseña debe tener al menos 6 caracteres')

    const row = await env.DB
      .prepare(`
        SELECT id, user_id, expires_at FROM password_reset_tokens
        WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')
      `)
      .bind(token)
      .first<{ id: number; user_id: number; expires_at: string }>()

    if (!row) return jsonErr('Token inválido o expirado')

    const { hashPassword } = await import('./_helpers')
    const password_hash = await hashPassword(password)

    await env.DB.batch([
      env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(password_hash, row.user_id),
      env.DB.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?').bind(row.id),
    ])

    return jsonOk({ success: true })
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
