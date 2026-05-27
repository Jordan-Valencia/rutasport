import 'dotenv/config'
import { Router, Request, Response } from 'express'
import { randomBytes, pbkdf2Sync, randomUUID } from 'node:crypto'
import { createTransport } from 'nodemailer'

const ACCOUNT_ID = process.env['CLOUDFLARE_ACCOUNT_ID']!
const DATABASE_ID = process.env['CLOUDFLARE_DATABASE_ID']!
const D1_TOKEN = process.env['CLOUDFLARE_D1_TOKEN']!
const GMAIL_USER = process.env['GMAIL_USER']?.trim()
const GMAIL_APP_PASSWORD = process.env['GMAIL_APP_PASSWORD']?.trim()

const D1_API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`

interface ResetEntry {
  userId: number
  expiresAt: number
}

const tokens = new Map<string, ResetEntry>()

const CLEANUP_INTERVAL = 60_000
setInterval(() => {
  const now = Date.now()
  for (const [token, entry] of tokens) {
    if (entry.expiresAt < now) tokens.delete(token)
  }
}, CLEANUP_INTERVAL)

async function queryD1(sql: string, params: unknown[] = []): Promise<any> {
  const res = await fetch(D1_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${D1_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  })
  const body = await res.json() as any
  if (!body.success) throw new Error(body.errors?.[0]?.message ?? 'D1 query failed')
  return body.result[0]
}

function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = pbkdf2Sync(password, salt, 100_000, 32, 'sha256')
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

const router = Router()

router.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string }
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Email requerido' })
      return
    }
    const cleanEmail = email.trim().toLowerCase()

    let user: any
    try {
      const result = await queryD1('SELECT id, email FROM users WHERE email = ?', [cleanEmail])
      user = result.results?.[0] ?? null
    } catch {
      user = null
    }

    if (!user) {
      res.status(404).json({ error: 'Este correo no está registrado' })
      return
    }

    const token = randomUUID()
    tokens.set(token, {
      userId: user.id,
      expiresAt: Date.now() + 3_600_000,
    })

    const origin = process.env['APP_ORIGIN'] || 'http://localhost:4200'
    const resetLink = `${origin}/recuperar/${token}`

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error('[forgot-password] GMAIL_USER o GMAIL_APP_PASSWORD no están configurados en .env')
      res.status(500).json({ error: 'Error de configuración del servidor de correo' })
      return
    }

    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    })

    await transporter.sendMail({
      from: `"RutaSport" <${GMAIL_USER}>`,
      to: cleanEmail,
      subject: 'Recuperación de contraseña — RutaSport',
      html: `
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
      `,
    })

    res.json({ success: true })
  } catch (e: any) {
    console.error('[forgot-password]', e.message || e)
    res.status(500).json({ error: `Error al enviar el correo: ${e.message || 'Error interno'}` })
  }
})

router.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body as { token?: string; password?: string }

    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Token requerido' })
      return
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    const entry = tokens.get(token)
    if (!entry) {
      res.status(400).json({ error: 'Token inválido o expirado' })
      return
    }
    if (entry.expiresAt < Date.now()) {
      tokens.delete(token)
      res.status(400).json({ error: 'Token expirado' })
      return
    }

    const password_hash = hashPassword(password)

    try {
      await queryD1('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, entry.userId])
    } catch {
      res.status(500).json({ error: 'Error al actualizar la contraseña' })
      return
    }

    tokens.delete(token)
    res.json({ success: true })
  } catch (e: any) {
    console.error('[reset-password]', e.message || e)
    res.status(500).json({ error: 'Error al procesar la solicitud' })
  }
})

export default router
