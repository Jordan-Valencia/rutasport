interface Env { DB: D1Database }

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await request.json() as {
      path?: string
      referrer?: string
      session_id?: string
    }
    await env.DB
      .prepare('INSERT INTO pageviews (path, referrer, session_id) VALUES (?, ?, ?)')
      .bind(body.path ?? '/', body.referrer ?? null, body.session_id ?? null)
      .run()
    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 204 })
  }
}
