import { Env, jsonOk, jsonErr, CORS_OPTIONS, getAuthenticatedUser, verifyPassword, hashPassword } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestPut: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const user = await getAuthenticatedUser(request, env.DB)
    if (!user) return jsonErr('No autenticado', 401)

    const body = await request.json() as {
      current_password?: string
      new_password?: string
    }

    if (!body.current_password || !body.new_password) {
      return jsonErr('Se requieren la contraseña actual y la nueva')
    }
    if (body.new_password.length < 6) {
      return jsonErr('La nueva contraseña debe tener al menos 6 caracteres')
    }

    const row = await env.DB
      .prepare('SELECT password_hash FROM users WHERE id = ?')
      .bind(user.id)
      .first<{ password_hash: string }>()

    if (!row) return jsonErr('Usuario no encontrado', 404)

    const valid = await verifyPassword(body.current_password, row.password_hash)
    if (!valid) return jsonErr('La contraseña actual es incorrecta', 401)

    const newHash = await hashPassword(body.new_password)

    await env.DB
      .prepare('UPDATE users SET password_hash = ? WHERE id = ?')
      .bind(newHash, user.id)
      .run()

    // Invalidate all sessions (force re-login everywhere)
    await env.DB
      .prepare('DELETE FROM user_sessions WHERE user_id = ?')
      .bind(user.id)
      .run()

    return jsonOk({ message: 'Contraseña actualizada. Por favor inicia sesión nuevamente.' })
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
