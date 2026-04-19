interface Env {
  DB: D1Database;
}

const corsHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    let query = 'SELECT * FROM teams';
    const params: unknown[] = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY id ASC';

    const result = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify(result.results), { headers: corsHeaders });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};
