interface Env { DB: D1Database }

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

const ADMIN_QUERY = `
  SELECT p.*, b.name AS brand, c.name AS category, s.name AS sport, g.name AS gender,
         GROUP_CONCAT(pi.url ORDER BY pi.sort_order) AS gallery
  FROM products p
  LEFT JOIN brands      b  ON b.id  = p.brand_id
  LEFT JOIN categories  c  ON c.id  = p.category_id
  LEFT JOIN sports      s  ON s.id  = p.sport_id
  LEFT JOIN genders     g  ON g.id  = p.gender_id
  LEFT JOIN product_images pi ON pi.product_id = p.id
  GROUP BY p.id ORDER BY p.id ASC
`

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const result = await env.DB.prepare(ADMIN_QUERY).all()
    return json(result.results)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    if (!b.name || !b.price) return json({ error: 'name y price son requeridos' }, 400)

    const ins = await env.DB.prepare(
      `INSERT INTO products (name, price, brand_id, category_id, sport_id, gender_id,
                             image, isBestSeller, isNew, description, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      b.name, b.price,
      b.brand_id    || null, b.category_id || null,
      b.sport_id    || null, b.gender_id   || null,
      b.image || '',
      b.isBestSeller ? 1 : 0, b.isNew ? 1 : 0,
      b.description || null, b.sizes || null
    ).run()

    const productId = ins.meta.last_row_id

    // gallery images
    const gallery: string[] = Array.isArray(b.gallery) ? b.gallery : []
    for (let i = 0; i < gallery.length; i++) {
      if (gallery[i]) {
        await env.DB.prepare(
          'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)'
        ).bind(productId, gallery[i], i).run()
      }
    }

    return json({ id: productId }, 201)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
