interface Env {
  WOMPI_PUBLIC_KEY: string
}

const WOMPI_API = 'https://production.wompi.co/v1'

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const id = new URL(request.url).searchParams.get('id')

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const res = await fetch(`${WOMPI_API}/transactions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${env.WOMPI_PUBLIC_KEY}` },
  })

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'No se pudo consultar la transacción' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await res.json() as { data: { id: string; status: string; reference: string } }

  return new Response(
    JSON.stringify({
      id: body.data.id,
      status: body.data.status,
      reference: body.data.reference,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
