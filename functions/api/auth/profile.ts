import { Env, jsonOk, jsonErr, CORS_OPTIONS, getAuthenticatedUser } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const user = await getAuthenticatedUser(request, env.DB)
  if (!user) return jsonErr('No autenticado', 401)
  return jsonOk({ user })
}

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const user = await getAuthenticatedUser(request, env.DB)
    if (!user) return jsonErr('No autenticado', 401)

    const body = await request.json() as {
      full_name?: string
      phone?: string
      region?: string
      city?: string
      address?: string
      email?: string
    }

    const full_name = body.full_name?.trim() ?? null
    const phone     = body.phone?.trim() ?? null
    const region    = body.region?.trim() ?? null
    const city      = body.city?.trim() ?? null
    const address   = body.address?.trim() ?? null
    const newEmail  = body.email?.trim().toLowerCase()

    if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return jsonErr('Email inválido')
    }

    if (newEmail && newEmail !== user.email) {
      const taken = await env.DB
        .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .bind(newEmail, user.id)
        .first()
      if (taken) return jsonErr('Este email ya está en uso', 409)
    }

    const updated = await env.DB
      .prepare(`
        UPDATE users
        SET full_name = ?, phone = ?, region = ?, city = ?, address = ?, email = COALESCE(?, email)
        WHERE id = ?
        RETURNING id, email, full_name, phone, region, city, address, createdAt
      `)
      .bind(full_name, phone, region, city, address, newEmail ?? null, user.id)
      .first()

    return jsonOk({ user: updated })
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
