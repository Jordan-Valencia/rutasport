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
    const formData = await request.formData()
    const entry = formData.get('file')
    if (!entry || typeof entry === 'string') return json({ error: 'No file provided' }, 400)
    const file: File = entry

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4'
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')

    const isVideo = file.type.startsWith('video/')
    const folder = isVideo ? 'videos' : 'images'
    const key = `${folder}/${Date.now()}-${safeName}`

    await env.IMAGES.put(key, file, { httpMetadata: { contentType: file.type } })

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

    const list = await env.IMAGES.list({ prefix: 'images/', limit, cursor })
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
