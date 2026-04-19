interface Env { DB: D1Database }

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    if (!b.name || !b.price) return json({ error: 'name y price son requeridos' }, 400)

    const result = await env.DB.prepare(
      `UPDATE products SET name=?, price=?, brand_id=?, category_id=?, sport_id=?, gender_id=?,
                           image=?, isBestSeller=?, isNew=?, description=?, sizes=?
       WHERE id=?`
    ).bind(
      b.name, b.price,
      b.brand_id    || null, b.category_id || null,
      b.sport_id    || null, b.gender_id   || null,
      b.image || '',
      b.isBestSeller ? 1 : 0, b.isNew ? 1 : 0,
      b.description || null, b.sizes || null,
      params.id
    ).run()

    if (result.meta.changes === 0) return json({ error: 'Producto no encontrado' }, 404)

    // replace gallery
    await env.DB.prepare('DELETE FROM product_images WHERE product_id = ?').bind(params.id).run()
    const gallery: string[] = Array.isArray(b.gallery) ? b.gallery : []
    for (let i = 0; i < gallery.length; i++) {
      if (gallery[i]) {
        await env.DB.prepare(
          'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)'
        ).bind(params.id, gallery[i], i).run()
      }
    }

    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    // ON DELETE CASCADE handles product_images
    const result = await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(params.id).run()
    if (result.meta.changes === 0) return json({ error: 'Producto no encontrado' }, 404)
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
