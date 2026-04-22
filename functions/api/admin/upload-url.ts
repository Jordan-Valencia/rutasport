interface Env {
  IMAGES: R2Bucket
}

const ADMIN_KEY = '_Yvu|jxY6_90'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', gif: 'image/gif', avif: 'image/avif',
  bmp: 'image/bmp', svg: 'image/svg+xml',
}

function resolveContentType(rawCT: string | null, pathname: string): string | null {
  const base = rawCT?.split(';')[0].trim().toLowerCase() ?? ''

  // Tipo explícito de imagen
  if (base.startsWith('image/')) return base === 'image/jpg' ? 'image/jpeg' : base

  // Tipos binarios genéricos — inferir por extensión de la URL
  if (!base || base === 'application/octet-stream' || base === 'binary/octet-stream') {
    const ext = pathname.split('.').pop()?.toLowerCase() ?? ''
    return EXT_TO_MIME[ext] ?? null
  }

  return null
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const body = await request.json() as { url?: string }
    const rawUrl = body.url?.trim()
    if (!rawUrl) return json({ error: 'Se requiere el campo url' }, 400)

    let parsedUrl: URL
    try { parsedUrl = new URL(rawUrl) } catch {
      return json({ error: 'URL inválida' }, 400)
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return json({ error: 'Solo se permiten URLs http/https' }, 400)
    }

    const imageRes = await fetch(rawUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 RutaSport-Admin/1.0', 'Accept': 'image/*,*/*' },
      redirect: 'follow',
    })
    if (!imageRes.ok) {
      return json({ error: `No se pudo descargar la imagen (HTTP ${imageRes.status})` }, 400)
    }

    const rawCT = imageRes.headers.get('content-type')
    const contentType = resolveContentType(rawCT, parsedUrl.pathname)
    if (!contentType) {
      return json({ error: `No se pudo determinar el tipo de imagen. Content-Type recibido: "${rawCT ?? 'ninguno'}"` }, 400)
    }

    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
      'image/gif': 'gif', 'image/avif': 'avif', 'image/bmp': 'bmp', 'image/svg+xml': 'svg',
    }
    const ext = extMap[contentType] ?? 'jpg'
    const rawName = parsedUrl.pathname.split('/').pop() || `image.${ext}`
    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^.]+$/, '') || 'image'
    const key = `images/${Date.now()}-${safeName}.${ext}`

    const buffer = await imageRes.arrayBuffer()
    await env.IMAGES.put(key, buffer, { httpMetadata: { contentType } })

    return json({ path: `/${key}`, key })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
