import { EpaycoService } from './epayco.service'

interface Env {
  EPAYCO_PUBLIC_KEY: string
  EPAYCO_PRIVATE_KEY: string
  EPAYCO_CUSTOMER_ID: string
  EPAYCO_TEST: string
}

function getEpaycoService(env: Env): EpaycoService {
  return new EpaycoService({
    publicKey: env.EPAYCO_PUBLIC_KEY,
    privateKey: env.EPAYCO_PRIVATE_KEY,
    customerId: env.EPAYCO_CUSTOMER_ID,
    test: env.EPAYCO_TEST !== 'false',
  })
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const ref = new URL(request.url).searchParams.get('ref')

  if (!ref) {
    return new Response(JSON.stringify({ error: 'ref requerido' }), {
      status: 400,
      headers,
    })
  }

  try {
    const epayco = getEpaycoService(env)
    const tx = await epayco.validateTransaction(ref)

    return new Response(
      JSON.stringify({
        id: tx.refPayco,
        status: tx.status,
        reference: ref,
      }),
      { headers }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? 'Error al validar transacción' }),
      { status: 500, headers }
    )
  }
}
