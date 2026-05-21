export const onRequestOptions: PagesFunction = async () => new Response(null, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
})

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async ({ env, request }) => {
  try {
    const { getAuthenticatedUser } = await import('./_helpers')
    const user = await getAuthenticatedUser(request, env.DB)

    if (!user) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Error interno', stack: e?.stack ?? '' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
}
