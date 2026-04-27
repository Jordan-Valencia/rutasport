interface Env { DB: D1Database }

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const b = await request.json() as any
    if (!b.name?.trim() || !b.price?.trim()) return json({ error: 'name y price son requeridos' }, 400)

    const result = await env.DB.prepare(
      `UPDATE products SET name=?, model=?, price=?, brand_id=?, gender_id=?,
                           image=?, isBestSeller=?, isNew=?, description=?, sizes=?
       WHERE id=?`
    ).bind(
      b.name.trim(), b.model?.trim() || null, b.price.trim(),
      b.brand_id || null, b.gender_id || null,
      b.image || '',
      b.isBestSeller ? 1 : 0, b.isNew ? 1 : 0,
      b.description || null, b.sizes || null,
      params.id
    ).run()

    if (result.meta.changes === 0) return json({ error: 'Producto no encontrado' }, 404)

    // Replace category relations
    await env.DB.prepare('DELETE FROM product_categories WHERE product_id = ?').bind(params.id).run()
    const categoryIds: number[] = Array.isArray(b.category_ids) ? b.category_ids : []
    for (const cid of categoryIds) {
      if (cid) await env.DB.prepare(
        'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)'
      ).bind(params.id, cid).run()
    }

    // Replace sport relations
    await env.DB.prepare('DELETE FROM product_sports WHERE product_id = ?').bind(params.id).run()
    const sportIds: number[] = Array.isArray(b.sport_ids) ? b.sport_ids : []
    for (const sid of sportIds) {
      if (sid) await env.DB.prepare(
        'INSERT OR IGNORE INTO product_sports (product_id, sport_id) VALUES (?, ?)'
      ).bind(params.id, sid).run()
    }

    // Replace gallery images
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
    await env.DB.prepare('DELETE FROM product_categories WHERE product_id = ?').bind(params.id).run()
    await env.DB.prepare('DELETE FROM product_sports WHERE product_id = ?').bind(params.id).run()
    const result = await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(params.id).run()
    if (result.meta.changes === 0) return json({ error: 'Producto no encontrado' }, 404)
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
