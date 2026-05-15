interface Env {
  IMAGES: R2Bucket
}

const MIMES: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  ogg: 'video/ogg',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  m4v: 'video/x-m4v',
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  try {
    const parts = Array.isArray(params.path) ? params.path : [params.path as string]
    const key = 'videos/' + parts.join('/')

    const rangeHeader = request.headers.get('range')

    const obj = rangeHeader
      ? await env.IMAGES.get(key, { range: request.headers })
      : await env.IMAGES.get(key)

    if (!obj) return new Response('Not found', { status: 404 })

    const headers = new Headers()
    obj.writeHttpMetadata(headers)

    if (!headers.get('content-type')) {
      const ext = key.split('.').pop()?.toLowerCase() ?? ''
      headers.set('content-type', MIMES[ext] ?? 'video/mp4')
    }

    headers.set('accept-ranges', 'bytes')
    headers.set('cache-control', 'public, max-age=31536000, immutable')

    if (rangeHeader && obj.range) {
      const r = obj.range as { offset?: number; length?: number }
      const offset = r.offset ?? 0
      const length = r.length ?? obj.size - offset
      headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${obj.size}`)
      headers.set('content-length', String(length))
      return new Response(obj.body, { status: 206, headers })
    }

    headers.set('content-length', String(obj.size))
    return new Response(obj.body, { headers })
  } catch {
    return new Response('Internal server error', { status: 500 })
  }
}
