import { Env, jsonOk, jsonErr, JSON_HEADERS, CORS_OPTIONS, hashPassword, generateToken } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as {
      email?: string
      password?: string
      full_name?: string
      phone?: string
      region?: string
      city?: string
      address?: string
    }

    const email     = body.email?.trim().toLowerCase()
    const password  = body.password?.trim()
    const full_name = body.full_name?.trim() || null
    const phone     = body.phone?.trim() || null
    const region    = body.region?.trim() || null
    const city      = body.city?.trim() || null
    const address   = body.address?.trim() || null

    if (!email || !password) return jsonErr('Email y contraseña son requeridos')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonErr('Email inválido')
    if (password.length < 6) return jsonErr('La contraseña debe tener al menos 6 caracteres')

    const existing = await env.DB
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first()

    if (existing) return jsonErr('Este email ya está registrado', 409)

    const password_hash = await hashPassword(password)

    const user = await env.DB
      .prepare(`
        INSERT INTO users (email, password_hash, full_name, phone, region, city, address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id, email, full_name, phone, region, city, address, createdAt
      `)
      .bind(email, password_hash, full_name, phone, region, city, address)
      .first<{ id: number; email: string; full_name: string | null; phone: string | null; region: string | null; city: string | null; address: string | null; createdAt: string }>()

    if (!user) throw new Error('Error al crear usuario')

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

    await env.DB
      .prepare('INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)')
      .bind(user.id, token, expiresAt)
      .run()

    return jsonOk({ token, user }, 201)
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
