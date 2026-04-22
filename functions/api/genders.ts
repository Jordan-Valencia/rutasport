interface Env { DB: D1Database }

const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM genders ORDER BY "order" ASC'
    ).all()
    return new Response(JSON.stringify(result.results), { headers: corsHeaders })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: corsHeaders,
    })
  }
}
