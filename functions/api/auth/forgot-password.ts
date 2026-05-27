import { Env, jsonOk, jsonErr, CORS_OPTIONS, generateToken } from './_helpers'

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

    if (!row) return jsonErr('Este correo no está registrado', 404)

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 3_600_000).toISOString()

    await env.DB
      .prepare('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)')
      .bind(row.id, token, expiresAt)
      .run()

    const origin = 'https://ruta-sport.com'
    const resetLink = `${origin}/recuperar/${token}`

    const html = `
      <div style="max-width:520px;margin:0 auto;font-family:Arial,sans-serif;background:#050505;color:#fff;padding:40px 30px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:26px;font-weight:900;letter-spacing:-.03em;">
            <span style="color:#fff;font-style:italic;">RUTA</span><span style="color:#E31C1C;font-style:italic;">SPORT</span>
          </span>
        </div>
        <h1 style="font-size:22px;font-weight:900;margin:0 0 12px;letter-spacing:-.02em;">Recupera tu acceso</h1>
        <p style="color:rgba(255,255,255,.6);font-size:14px;line-height:1.6;margin:0 0 28px;">
          Recibimos una solicitud para restablecer tu contraseña.<br>
          Haz clic en el botón para crear una nueva:
        </p>
        <div style="text-align:center;margin-bottom:28px;">
          <a href="${resetLink}"
             style="display:inline-block;background:#E31C1C;color:#fff;text-decoration:none;
                    font-weight:900;font-size:13px;letter-spacing:.15em;text-transform:uppercase;
                    padding:14px 36px;border-radius:6px;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color:rgba(255,255,255,.35);font-size:12px;line-height:1.5;margin:0;">
          Este enlace expira en 1 hora.<br>
          Si no solicitaste este cambio, ignora este mensaje.
        </p>
      </div>
    `

    if (!env.RESEND_API_KEY) {
      return jsonErr(
        'Configura RESEND_API_KEY en Cloudflare Pages > Settings > Environment Variables. ' +
        'Obtén una key gratis en https://resend.com (100 emails/día)',
        500,
      )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RutaSport <noreply@ruta-sport.com>',
        to: email,
        subject: 'Recuperación de contraseña — RutaSport',
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return jsonErr(`Error al enviar email (Resend): ${err}`, 500)
    }

    return jsonOk({ success: true })
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
