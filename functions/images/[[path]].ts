interface Env {
  IMAGES: R2Bucket
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const pathParts = params.path as string[]
    const key = 'images/' + pathParts.join('/')

    const obj = await env.IMAGES.get(key)
    if (!obj) return new Response('Not found', { status: 404 })

    const headers = new Headers()
    obj.writeHttpMetadata(headers)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new Response(obj.body, { headers })
  } catch (e: any) {
    return new Response('Internal server error', { status: 500 })
  }
}
