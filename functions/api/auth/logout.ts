import { Env, jsonOk, jsonErr, CORS_OPTIONS } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const auth = request.headers.get('Authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null

    if (token) {
      await env.DB
        .prepare('DELETE FROM user_sessions WHERE token = ?')
        .bind(token)
        .run()
    }

    return jsonOk({ message: 'Sesión cerrada' })
  } catch (e: any) {
    return jsonErr(e.message ?? 'Error interno', 500)
  }
}
