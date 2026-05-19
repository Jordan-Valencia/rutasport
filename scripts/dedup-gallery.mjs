// Script: dedup-gallery.mjs
// Elimina imágenes duplicadas en la galería de productos.
// Un duplicado se detecta cuando dos paths tienen el mismo nombre de archivo original
// (después del prefijo timestamp-).

const BASE_URL = (process.argv[2] || 'http://localhost:8788').replace(/\/$/, '')
const ADMIN_KEY = '1663017721@'

// Extrae el nombre de archivo original de un path como:
// /images/1778970835876-FOF100334-001-1.jpeg → FOF100334-001-1.jpeg
function originalName(path) {
  const filename = path.split('/').pop()
  const dashIdx = filename.indexOf('-')
  return dashIdx >= 0 ? filename.slice(dashIdx + 1) : filename
}

async function dedup() {
  const res = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { 'x-admin-key': ADMIN_KEY },
  })
  const products = await res.json()

  let totalFixed = 0

  for (const product of products) {
    if (!product.gallery) continue

    const paths = product.gallery.split(',').map(s => s.trim()).filter(Boolean)
    if (paths.length === 0) continue

    // Dedup: mantener solo la primera aparición de cada nombre original
    const seen = new Set()
    const deduped = []
    for (const path of paths) {
      const orig = originalName(path)
      if (!seen.has(orig)) {
        seen.add(orig)
        deduped.push(path)
      }
    }

    if (deduped.length === paths.length) continue // sin duplicados

    console.log(`\n🔧 ${product.model} (ID: ${product.id})`)
    console.log(`   Antes: ${paths.length} imágenes → Después: ${deduped.length} imágenes`)
    const removed = paths.filter(p => !deduped.includes(p))
    for (const r of removed) console.log(`   ✗ removido: ${r}`)

    // Reconstruir el body completo para PUT
    const categoryIds = product.category_ids
      ? product.category_ids.split(',').map(Number).filter(Boolean)
      : []
    const sportIds = product.sport_ids
      ? product.sport_ids.split(',').map(Number).filter(Boolean)
      : []

    const body = {
      name: product.name,
      model: product.model || '',
      price: product.price,
      brand_id: product.brand_id || null,
      gender_id: product.gender_id || null,
      image: product.image || '',
      video: product.video || '',
      isBestSeller: product.isBestSeller ? 1 : 0,
      isNew: product.isNew ? 1 : 0,
      badge: product.badge || 'ORIGINAL',
      description: product.description || null,
      sizes: product.sizes || null,
      category_ids: categoryIds,
      sport_ids: sportIds,
      gallery: deduped,
    }

    const putRes = await fetch(`${BASE_URL}/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (putRes.ok) {
      console.log(`   ✓ Galería actualizada`)
      totalFixed++
    } else {
      console.error(`   ✗ ERROR: ${putRes.status} ${await putRes.text()}`)
    }
  }

  console.log(`\n✅ Productos corregidos: ${totalFixed}`)
}

dedup().catch(err => {
  console.error('❌', err)
  process.exit(1)
})
