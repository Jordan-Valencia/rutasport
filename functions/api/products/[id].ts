interface Env { DB: D1Database }

const cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

const QUERY = `
  SELECT p.id, p.name, p.model, p.price,
         b.name AS brand, p.brand_id,
         g.name AS gender, p.gender_id,
         p.image, p.isBestSeller, p.isNew, p.description, p.sizes, p.createdAt,
         (SELECT GROUP_CONCAT(c.name, ',')
          FROM product_categories pc JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id) AS categories,
         (SELECT GROUP_CONCAT(s.name, ',')
          FROM product_sports ps JOIN sports s ON s.id = ps.sport_id
          WHERE ps.product_id = p.id) AS sports,
         (SELECT GROUP_CONCAT(pc2.category_id, ',')
          FROM product_categories pc2 WHERE pc2.product_id = p.id) AS category_ids,
         (SELECT GROUP_CONCAT(ps2.sport_id, ',')
          FROM product_sports ps2 WHERE ps2.product_id = p.id) AS sport_ids,
         (SELECT GROUP_CONCAT(url, ',')
          FROM (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC)
         ) AS gallery
  FROM products p
  LEFT JOIN brands  b ON b.id = p.brand_id
  LEFT JOIN genders g ON g.id = p.gender_id
  WHERE p.id = ?
  GROUP BY p.id
`

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const id = params.id as string
    if (!id || isNaN(+id)) {
      return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400, headers: cors })
    }
    const result = await env.DB.prepare(QUERY).bind(+id).first()
    if (!result) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: cors })
    }
    return new Response(JSON.stringify(result), { headers: cors })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'Internal error' }), { status: 500, headers: cors })
  }
}
