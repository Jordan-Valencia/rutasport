// Script: create-missing-products.mjs
// Crea los 17 productos que tienen archivos en /modelos pero no existen en la DB.
// Datos inferidos de productos similares existentes.

const BASE_URL = (process.argv[2] || 'http://localhost:8788').replace(/\/$/, '')
const ADMIN_KEY = '1663017721@'

// category_ids: 1=Running, 4=Training, 5=Lifestyle, 7=Trail
// sport_ids:    2=Running, 4=Training, 6=Lifestyle, 7=Trail
// gender_id:    1=Hombre, 2=Mujer, 3=Niños, 4=Unisex

const MISSING_PRODUCTS = [
  // ──── OAKLEY (brand_id=3) ────
  // FOF100469-882 existente = "Halftrack Low II" $629.900 Hombre
  // FOF100469-20A: misma familia, colorway diferente
  {
    name: 'Halftrack Low II',
    model: 'FOF100469-20A',
    price: 629900,
    brand_id: 3,
    gender_id: 1,
    category_ids: [5],
    sport_ids: [6],
    badge: 'ORIGINAL',
  },
  // FOF100614-001 = "Anorak Low" $649.900 Mujer
  // FOF100614-009: mismo modelo, colorway diferente
  {
    name: 'Anorak Low',
    model: 'FOF100614-009',
    price: 649900,
    brand_id: 3,
    gender_id: 2,
    category_ids: [5],
    sport_ids: [6],
    badge: 'ORIGINAL',
  },
  // FOF100670-323 = "Halftrack III Mid" $629.900 Unisex
  // FOF100670-001: mismo modelo, colorway 001
  {
    name: 'Halftrack III Mid',
    model: 'FOF100670-001',
    price: 629900,
    brand_id: 3,
    gender_id: 4,
    category_ids: [5],
    sport_ids: [6],
    badge: 'ORIGINAL',
  },
  // FOF100245-001: código anterior no relacionado, precio estimado
  {
    name: 'Halftrack II',
    model: 'FOF100245-001',
    price: 599900,
    brand_id: 3,
    gender_id: 4,
    category_ids: [5],
    sport_ids: [6],
    badge: 'ORIGINAL',
  },

  // ──── ADIDAS (brand_id=2) ────
  // IH prefix como IH8225 (Duramo SL 2)
  {
    name: 'Duramo SL 2',
    model: 'IH6103',
    price: 399900,
    brand_id: 2,
    gender_id: 1,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  {
    name: 'Duramo SL 2',
    model: 'IH7758',
    price: 399900,
    brand_id: 2,
    gender_id: 2,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  {
    name: 'Duramo SL 2',
    model: 'IH7759',
    price: 399900,
    brand_id: 2,
    gender_id: 4,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  // ID prefix como ID8764 (Galaxy 7) y ID8742 (Questar 3)
  {
    name: 'Galaxy 7',
    model: 'ID8757',
    price: 339900,
    brand_id: 2,
    gender_id: 4,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  // JP prefix como JP5911 (Runfalcon 5 TR)
  {
    name: 'Runfalcon 5',
    model: 'JP6591',
    price: 399900,
    brand_id: 2,
    gender_id: 4,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  // JQ prefix como JQ2540 (Response Runner)
  {
    name: 'Response Runner',
    model: 'JQ2524',
    price: 299900,
    brand_id: 2,
    gender_id: 1,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  {
    name: 'Runfalcon 5 TR',
    model: 'JQ5066',
    price: 399900,
    brand_id: 2,
    gender_id: 2,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  {
    name: 'Galaxy 7',
    model: 'JQ5750',
    price: 339900,
    brand_id: 2,
    gender_id: 1,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  // JR prefix como JR7151 (Duramo RC2) y JR9142 (Terrex)
  {
    name: 'Duramo RC2',
    model: 'JR6620',
    price: 319900,
    brand_id: 2,
    gender_id: 2,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  // JS prefix como JS4435 (Duramo RC2)
  {
    name: 'Duramo RC2',
    model: 'JS4429',
    price: 299900,
    brand_id: 2,
    gender_id: 1,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  // KJ prefix como KJ1735 (Response Runner 2) y KJ1738 (Response Runner 2)
  {
    name: 'Response Runner 2',
    model: 'KJ1736',
    price: 299900,
    brand_id: 2,
    gender_id: 2,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  {
    name: 'Response Runner 2',
    model: 'KJ1737',
    price: 299900,
    brand_id: 2,
    gender_id: 4,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
  {
    name: 'Response Runner 2',
    model: 'KJ1745',
    price: 299900,
    brand_id: 2,
    gender_id: 1,
    category_ids: [1],
    sport_ids: [2],
    badge: 'ORIGINAL',
  },
]

async function createProduct(product) {
  const res = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: {
      'x-admin-key': ADMIN_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${text}`)
  }

  const data = await res.json()
  return data.id
}

async function main() {
  console.log(`\n🏭 Creando ${MISSING_PRODUCTS.length} productos faltantes...\n`)

  let created = 0
  let errors = 0

  for (const product of MISSING_PRODUCTS) {
    try {
      const id = await createProduct(product)
      console.log(`✓ [ID: ${id}] ${product.model} → ${product.name}`)
      created++
    } catch (err) {
      console.error(`✗ ERROR ${product.model}: ${err.message}`)
      errors++
    }
  }

  console.log(`\n✅ Creados: ${created} | Errores: ${errors}`)
  console.log('\nAhora ejecuta de nuevo: node scripts/upload-modelos.mjs')
}

main().catch(err => {
  console.error('\n❌ Error fatal:', err)
  process.exit(1)
})
