// Script: upload-modelos.mjs
// Sube todos los archivos de la carpeta /modelos a los productos correspondientes
// en la base de datos via la API de administración.
//
// Uso:
//   node scripts/upload-modelos.mjs [URL_BASE]
//   URL_BASE por defecto: http://localhost:8788
//
// Requiere Node 18+ (fetch nativo, FormData nativo, Blob nativo)

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_URL = (process.argv[2] || 'http://localhost:8788').replace(/\/$/, '')
const ADMIN_KEY = '1663017721@'
const MODELOS_DIR = path.join(__dirname, '..', 'modelos')

// Archivos de IA generados que se ignoran
const SKIP_FILES = new Set([
  'Crea_una_fotografía_de_producto_202605161351.jpeg',
  'Crea_una_imagen_ultra_realista_202605161351.jpeg',
  'Genera_una_fotografía_ultra_realista_202605161351.jpeg',
  'image.png_202605161351.jpeg',
])

const IMAGE_EXTS = new Set(['.jpeg', '.jpg', '.png', '.webp'])
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm'])

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.jpeg' || ext === '.jpg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.mp4') return 'video/mp4'
  if (ext === '.mov') return 'video/quicktime'
  if (ext === '.webm') return 'video/webm'
  return 'application/octet-stream'
}

function isImage(filename) {
  return IMAGE_EXTS.has(path.extname(filename).toLowerCase())
}

function isVideo(filename) {
  return VIDEO_EXTS.has(path.extname(filename).toLowerCase())
}

// Sube un archivo y retorna el path resultante (ej: "/images/...")
async function uploadFile(filePath, filename) {
  const buffer = fs.readFileSync(filePath)
  const mime = getMimeType(filename)
  const blob = new Blob([buffer], { type: mime })
  const formData = new FormData()
  formData.append('file', blob, filename)

  const res = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: 'POST',
    headers: { 'x-admin-key': ADMIN_KEY },
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload falló para "${filename}": ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.path
}

// Actualiza un producto con su galería y video nuevos
// Mantiene todos los datos existentes, solo añade lo nuevo
async function updateProduct(product, newGalleryPaths, newVideoPath) {
  const existingGallery = product.gallery
    ? product.gallery.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const mergedGallery = [...existingGallery, ...newGalleryPaths]
  const mergedVideo = newVideoPath || product.video || ''

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
    video: mergedVideo,
    isBestSeller: product.isBestSeller ? 1 : 0,
    isNew: product.isNew ? 1 : 0,
    badge: product.badge || 'ORIGINAL',
    description: product.description || null,
    sizes: product.sizes || null,
    category_ids: categoryIds,
    sport_ids: sportIds,
    gallery: mergedGallery,
  }

  const res = await fetch(`${BASE_URL}/api/admin/products/${product.id}`, {
    method: 'PUT',
    headers: {
      'x-admin-key': ADMIN_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Update falló para producto ${product.id}: ${res.status} ${text}`)
  }
}

async function main() {
  console.log(`\n🚀 Upload de modelos iniciado`)
  console.log(`   URL base: ${BASE_URL}`)
  console.log(`   Carpeta:  ${MODELOS_DIR}\n`)

  // 1. Obtener productos actuales
  console.log('📦 Obteniendo productos de la base de datos...')
  const productsRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { 'x-admin-key': ADMIN_KEY },
  })
  if (!productsRes.ok) {
    console.error('❌ No se pudo obtener la lista de productos. ¿El servidor está corriendo?')
    process.exit(1)
  }
  const products = await productsRes.json()
  console.log(`   ${products.length} productos encontrados.\n`)

  // 2. Construir mapa model → producto
  // Ordenar por longitud de código descendente para que el match más específico gane primero
  const productsByModel = products
    .filter(p => p.model)
    .sort((a, b) => b.model.length - a.model.length)

  // 3. Escanear carpeta modelos/
  const allFiles = fs.readdirSync(MODELOS_DIR)
    .filter(f => {
      if (SKIP_FILES.has(f)) return false
      const ext = path.extname(f).toLowerCase()
      return IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext)
    })

  console.log(`📂 ${allFiles.length} archivos a procesar (excluidos ${SKIP_FILES.size} archivos de IA)\n`)

  // 4. Agrupar archivos por producto
  // Para cada archivo, encontrar el producto cuyo model code es prefijo del nombre de archivo
  const filesByProductId = {}  // productId → { images: [], videos: [] }
  const unmatchedFiles = []

  for (const filename of allFiles) {
    let matched = false
    for (const product of productsByModel) {
      const modelCode = product.model.trim()
      if (filename.startsWith(modelCode)) {
        const pid = product.id
        if (!filesByProductId[pid]) filesByProductId[pid] = { product, images: [], videos: [] }
        if (isVideo(filename)) {
          filesByProductId[pid].videos.push(filename)
        } else {
          filesByProductId[pid].images.push(filename)
        }
        matched = true
        break
      }
    }
    if (!matched) {
      unmatchedFiles.push(filename)
    }
  }

  const matchedProductIds = Object.keys(filesByProductId)
  console.log(`✅ Match exitoso: ${allFiles.length - unmatchedFiles.length} archivos → ${matchedProductIds.length} productos`)
  if (unmatchedFiles.length > 0) {
    console.log(`⚠️  Sin match: ${unmatchedFiles.length} archivos`)
  }
  console.log()

  // 5. Subir y actualizar cada producto
  let totalUploaded = 0
  let totalErrors = 0

  for (const pid of matchedProductIds) {
    const { product, images, videos } = filesByProductId[pid]
    const modelCode = product.model

    console.log(`\n📁 ${modelCode} (ID: ${pid})`)
    console.log(`   Imágenes: ${images.length} | Videos: ${videos.length}`)

    const newGalleryPaths = []
    let newVideoPath = null

    // Subir imágenes extra
    for (const filename of images) {
      const filePath = path.join(MODELOS_DIR, filename)
      try {
        const uploadedPath = await uploadFile(filePath, filename)
        newGalleryPaths.push(uploadedPath)
        console.log(`   ✓ imagen: ${filename} → ${uploadedPath}`)
        totalUploaded++
      } catch (err) {
        console.error(`   ✗ ERROR imagen: ${filename} — ${err.message}`)
        totalErrors++
      }
    }

    // Subir video (solo el primero si hay varios)
    for (const filename of videos) {
      const filePath = path.join(MODELOS_DIR, filename)
      try {
        const uploadedPath = await uploadFile(filePath, filename)
        if (!newVideoPath) newVideoPath = uploadedPath
        console.log(`   ✓ video:  ${filename} → ${uploadedPath}`)
        totalUploaded++
      } catch (err) {
        console.error(`   ✗ ERROR video: ${filename} — ${err.message}`)
        totalErrors++
      }
      break // solo un video por producto
    }

    // Actualizar producto
    if (newGalleryPaths.length > 0 || newVideoPath) {
      try {
        await updateProduct(product, newGalleryPaths, newVideoPath)
        console.log(`   ✓ Producto actualizado en DB`)
      } catch (err) {
        console.error(`   ✗ ERROR actualizando producto ${pid}: ${err.message}`)
        totalErrors++
      }
    }
  }

  // 6. Resumen final
  console.log('\n' + '═'.repeat(60))
  console.log('📊 RESUMEN FINAL')
  console.log('═'.repeat(60))
  console.log(`   Archivos procesados:  ${allFiles.length}`)
  console.log(`   Uploads exitosos:     ${totalUploaded}`)
  console.log(`   Errores:              ${totalErrors}`)
  console.log(`   Productos afectados:  ${matchedProductIds.length}`)

  if (unmatchedFiles.length > 0) {
    console.log('\n' + '─'.repeat(60))
    console.log(`⚠️  ARCHIVOS SIN PRODUCTO EN LA BASE DE DATOS (${unmatchedFiles.length}):`)
    console.log('   (Estos requieren gestión manual)')
    console.log('─'.repeat(60))
    for (const f of unmatchedFiles) {
      console.log(`   • ${f}`)
    }
    console.log()
  } else {
    console.log('\n✅ Todos los archivos fueron asignados exitosamente.')
  }
}

main().catch(err => {
  console.error('\n❌ Error fatal:', err)
  process.exit(1)
})
