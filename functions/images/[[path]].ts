interface Env {
  IMAGES: R2Bucket
}

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  avif: 'image/avif',
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const pathParts = Array.isArray(params.path) ? params.path : [params.path as string]
    const key = 'images/' + pathParts.join('/')

    const obj = await env.IMAGES.get(key)
    if (!obj) return new Response('Not found', { status: 404 })

    const headers = new Headers()
    obj.writeHttpMetadata(headers)

    // Fallback: deduce content-type from extension if writeHttpMetadata didn't set it
    if (!headers.get('content-type')) {
      const ext = key.split('.').pop()?.toLowerCase() ?? ''
      headers.set('content-type', MIME_TYPES[ext] ?? 'application/octet-stream')
    }

    headers.set('cache-control', 'public, max-age=31536000, immutable')

    return new Response(obj.body, { headers })
  } catch (e: any) {
    return new Response('Internal server error', { status: 500 })
  }
}
