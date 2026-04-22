interface Env { DB: D1Database }

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const url = new URL(request.url)
    const gender = url.searchParams.get('gender')
    const bestSeller = url.searchParams.get('bestSeller')
    const isNew = url.searchParams.get('isNew')

    let sql = `
      SELECT
        p.id,
        p.name,
        p.model,
        p.price,
        b.name AS brand,
        p.brand_id,
        g.name AS gender,
        p.gender_id,
        p.image,
        p.isBestSeller,
        p.isNew,
        p.description,
        p.sizes,
        p.createdAt,
        (
          SELECT GROUP_CONCAT(c.name, ',')
          FROM product_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id
        ) AS categories,
        (
          SELECT GROUP_CONCAT(s.name, ',')
          FROM product_sports ps
          JOIN sports s ON s.id = ps.sport_id
          WHERE ps.product_id = p.id
        ) AS sports,
        (
          SELECT GROUP_CONCAT(pc2.category_id, ',')
          FROM product_categories pc2
          WHERE pc2.product_id = p.id
        ) AS category_ids,
        (
          SELECT GROUP_CONCAT(ps2.sport_id, ',')
          FROM product_sports ps2
          WHERE ps2.product_id = p.id
        ) AS sport_ids,
        (
          SELECT GROUP_CONCAT(url, ',')
          FROM (
            SELECT url
            FROM product_images
            WHERE product_id = p.id
            ORDER BY sort_order ASC
          )
        ) AS gallery
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN genders g ON g.id = p.gender_id
      WHERE 1 = 1
    `

    const binds: any[] = []

    if (gender) {
      sql += ` AND g.name = ?`
      binds.push(gender)
    }

    if (bestSeller === 'true') {
      sql += ` AND p.isBestSeller = 1`
    }

    if (isNew === 'true') {
      sql += ` AND p.isNew = 1`
    }

    sql += ` ORDER BY p.createdAt DESC`

    const result = await env.DB.prepare(sql).bind(...binds).all()

    return new Response(JSON.stringify(result.results), { headers })
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? 'Internal error' }),
      { status: 500, headers }
    )
  }
}