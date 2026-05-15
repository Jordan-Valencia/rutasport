interface Env {
  IMAGES: R2Bucket
}

const ADMIN_KEY = '1663017721@'
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const unauthorized = () => json({ error: 'Unauthorized' }, 401)

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.startsWith('video/')) return json({ error: 'Solo se permiten archivos de video' }, 400)

    const rawFilename = request.headers.get('x-filename') ?? 'video'
    const filename = decodeURIComponent(rawFilename)
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `videos/${Date.now()}-${safeName}`

    const buffer = await request.arrayBuffer()
    if (!buffer.byteLength) return json({ error: 'No file provided' }, 400)
    await env.IMAGES.put(key, buffer, { httpMetadata: { contentType } })

    return json({ path: `/${key}`, key })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const url = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') ?? '24'), 1), 100)
    const cursor = url.searchParams.get('cursor') ?? undefined

    const list = await env.IMAGES.list({ prefix: 'videos/', limit, cursor })
    const items = list.objects.map(o => ({ key: o.key, path: `/${o.key}`, size: o.size, uploaded: o.uploaded }))

    return json({ items, nextCursor: list.truncated ? list.cursor : null, hasMore: list.truncated })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const body = await request.json() as { key?: string }
    if (!body.key) return json({ error: 'Missing required field: key' }, 400)
    await env.IMAGES.delete(body.key)
    return json({ success: true })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}
