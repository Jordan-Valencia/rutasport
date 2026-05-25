import { Env, jsonOk, jsonErr, CORS_OPTIONS, generateToken, JSON_HEADERS } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as { email?: string }
    const email = body.email?.trim().toLowerCase()
    if (!email) return jsonErr('Email requerido')

    const row = await env.DB
      .prepare('SELECT id, email FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: number; email: string }>()

    if (row) {
      const token = generateToken()
      const expiresAt = new Date(Date.now() + 3_600_000).toISOString()

      await env.DB
        .prepare('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)')
        .bind(row.id, token, expiresAt)
        .run()

      const origin = request.headers.get('Origin') ?? 'https://rutasport.com'
      const resetLink = `${origin}/recuperar/${token}`

      // Email sending handled externally via a separate service
      // This function stores the token; the Express/password-reset.ts handles SMTP
    }

    return jsonOk({ success: true })
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
