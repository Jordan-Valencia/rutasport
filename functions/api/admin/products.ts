interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

const PRODUCT_SELECT = `
  SELECT
    p.id, p.name, p.model, p.price, p.image,
    p.brand_id, p.gender_id,
    p.isBestSeller, p.isNew, p.description, p.sizes, p.createdAt,
    b.name AS brand,
    g.name AS gender,
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
`

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const result = await env.DB.prepare(`${PRODUCT_SELECT} ORDER BY p.id ASC`).all()
    return json(result.results)
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    if (!b.name?.trim() || !b.price?.trim()) return json({ error: 'name y price son requeridos' }, 400)

    const ins = await env.DB.prepare(
      `INSERT INTO products (name, model, price, brand_id, gender_id,
                             image, isBestSeller, isNew, description, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      b.name.trim(), b.model?.trim() || null, b.price.trim(),
      b.brand_id || null, b.gender_id || null,
      b.image || '',
      b.isBestSeller ? 1 : 0, b.isNew ? 1 : 0,
      b.description || null, b.sizes || null
    ).run()

    const productId = ins.meta.last_row_id

    // Insert category relations
    const categoryIds: number[] = Array.isArray(b.category_ids) ? b.category_ids : []
    for (const cid of categoryIds) {
      if (cid) await env.DB.prepare(
        'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)'
      ).bind(productId, cid).run()
    }

    // Insert sport relations
    const sportIds: number[] = Array.isArray(b.sport_ids) ? b.sport_ids : []
    for (const sid of sportIds) {
      if (sid) await env.DB.prepare(
        'INSERT OR IGNORE INTO product_sports (product_id, sport_id) VALUES (?, ?)'
      ).bind(productId, sid).run()
    }

    // Insert gallery images
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
