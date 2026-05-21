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

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const ref = new URL(request.url).searchParams.get('ref')

  if (!ref) {
    return new Response(JSON.stringify({ error: 'ref requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
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
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? 'Error al validar transacción' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
