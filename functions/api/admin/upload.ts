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

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `images/${Date.now()}-${safeName}`
    const contentType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`

    await env.IMAGES.put(key, file, { httpMetadata: { contentType } })

    return json({ path: `/${key}`, key })
  } catch (e: any) {
    return json({ error: e.message ?? 'Internal error' }, 500)
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (request.headers.get('x-admin-key') !== ADMIN_KEY) return unauthorized()
  try {
    const items: { key: string; path: string; size: number; uploaded: Date }[] = []
    let cursor: string | undefined

    do {
      const list = await env.IMAGES.list({ prefix: 'images/', cursor })
      for (const o of list.objects) {
        items.push({ key: o.key, path: `/${o.key}`, size: o.size, uploaded: o.uploaded })
      }
      cursor = list.truncated ? list.cursor : undefined
    } while (cursor)

    return json(items)
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
