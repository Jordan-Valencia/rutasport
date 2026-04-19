interface Env { DB: D1Database }

const cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

const BASE_QUERY = `
  SELECT p.id, p.name, p.price,
         b.name  AS brand,   p.brand_id,
         c.name  AS category, p.category_id,
         s.name  AS sport,   p.sport_id,
         g.name  AS gender,  p.gender_id,
         p.image, p.isBestSeller, p.isNew, p.description, p.sizes, p.createdAt,
         GROUP_CONCAT(pi.url ORDER BY pi.sort_order) AS gallery
  FROM products p
  LEFT JOIN brands     b  ON b.id  = p.brand_id
  LEFT JOIN categories c  ON c.id  = p.category_id
  LEFT JOIN sports     s  ON s.id  = p.sport_id
  LEFT JOIN genders    g  ON g.id  = p.gender_id
  LEFT JOIN product_images pi ON pi.product_id = p.id
`

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const url      = new URL(request.url)
    const sport    = url.searchParams.get('sport')
    const category = url.searchParams.get('category')
    const brand    = url.searchParams.get('brand')
    const gender   = url.searchParams.get('gender')
    const isNew    = url.searchParams.get('isNew')
    const best     = url.searchParams.get('bestSeller')

    let where  = 'WHERE 1=1'
    const params: unknown[] = []

    if (sport)           { where += ' AND s.name = ?';    params.push(sport) }
    if (category)        { where += ' AND c.name = ?';    params.push(category) }
    if (brand)           { where += ' AND b.name = ?';    params.push(brand) }
    if (gender)          { where += ' AND g.name = ?';    params.push(gender) }
    if (isNew === 'true')  where += ' AND p.isNew = 1'
    if (best  === 'true')  where += ' AND p.isBestSeller = 1'

    const query = `${BASE_QUERY} ${where} GROUP BY p.id ORDER BY p.id ASC`

    const result = await env.DB.prepare(query).bind(...params).all()
    return new Response(JSON.stringify(result.results), { headers: cors })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'Internal error' }), { status: 500, headers: cors })
  }
}
