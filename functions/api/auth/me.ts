import { Env, jsonOk, jsonErr, CORS_OPTIONS, getAuthenticatedUser } from './_helpers'

export const onRequestOptions: PagesFunction = async () => CORS_OPTIONS

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const user = await getAuthenticatedUser(request, env.DB)
  if (!user) return jsonErr('No autenticado', 401)
  return jsonOk({ user })
}
