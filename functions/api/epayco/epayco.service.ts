interface EpaycoConfig {
  publicKey: string
  privateKey: string
  customerId: string
  test: boolean
  lang?: 'ES' | 'EN'
}

interface CreateSessionParams {
  invoice: string
  description: string
  amount: number
  currency?: string
  responseUrl: string
  confirmationUrl: string
  ip?: string
  billing?: {
    email?: string
    name?: string
  }
}

interface CreateSessionResponse {
  sessionId: string
}

interface TransactionValidationResponse {
  status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR'
  refPayco: string
  transactionId: string
  amount: string
  reference: string
}

interface WebhookPayload {
  refPayco: string
  transactionId: string
  amount: string
  currency: string
  signature: string
  response: string
  extra1: string
  raw: Record<string, string>
}

class EpaycoError extends Error {
  constructor(message: string, public code?: number) {
    super(message)
    this.name = 'EpaycoError'
  }
}

const EPAYCO_BASE_URL = 'https://secure.epayco.co'
const APIFY_URL = 'https://apify.epayco.co'

const STATUS_MAP: Record<string, string> = {
  Aceptada: 'APPROVED',
  Rechazada: 'DECLINED',
  Pendiente: 'PENDING',
}

function mapStatus(epaycoStatus: string): string {
  return STATUS_MAP[epaycoStatus] ?? 'ERROR'
}

async function sha256hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export class EpaycoService {
  private config: EpaycoConfig

  constructor(config: EpaycoConfig) {
    if (!config.publicKey) throw new EpaycoError('publicKey es requerida', 100)
    if (!config.privateKey) throw new EpaycoError('privateKey es requerida', 100)
    if (!config.customerId) throw new EpaycoError('customerId es requerido', 100)

    this.config = { ...config, lang: config.lang ?? 'ES' }
  }

  get isTest(): boolean {
    return this.config.test
  }

  private async authenticate(): Promise<string> {
    const credentials = btoa(`${this.config.publicKey}:${this.config.privateKey}`)

    const resp = await fetch(`${APIFY_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({ public_key: this.config.publicKey }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new EpaycoError(`Error de autenticación Apify: ${resp.status} ${text}`, resp.status)
    }

    const json = await resp.json() as { token: string; success?: boolean }
    if (!json.token) {
      throw new EpaycoError('Apify no devolvió un token')
    }

    return json.token
  }

  async createSession(params: CreateSessionParams): Promise<CreateSessionResponse> {
    const token = await this.authenticate()

    const body: Record<string, unknown> = {
      checkout_version: '2',
      name: 'RutaSport',
      currency: (params.currency ?? 'COP').toUpperCase(),
      amount: String(params.amount),
      description: params.description,
      invoice: params.invoice,
      lang: (this.config.lang ?? 'ES').toUpperCase(),
      country: 'CO',
      ip: params.ip ?? '0.0.0.0',
      response: params.responseUrl,
      confirmation: params.confirmationUrl,
      test: String(this.config.test).toLowerCase(),
      extra1: params.invoice,
      ...(params.billing?.email ? {
        billing: params.billing,
        nameBilling: params.billing.name ?? '',
        emailBilling: params.billing.email,
      } : {}),
    }

    const resp = await fetch(`${APIFY_URL}/payment/session/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new EpaycoError(`Error al crear sesión ePayco: ${resp.status} ${text}`, resp.status)
    }

    const json = await resp.json() as {
      success: boolean
      data?: { sessionId: string; token?: string }
    }

    if (!json.success || !json.data?.sessionId) {
      throw new EpaycoError('ePayco no devolvió un sessionId válido')
    }

    return { sessionId: json.data.sessionId }
  }

  async validateTransaction(refPayco: string): Promise<TransactionValidationResponse> {
    if (!refPayco) throw new EpaycoError('refPayco es requerido')

    const resp = await fetch(
      `${EPAYCO_BASE_URL}/validation/v1/reference/${encodeURIComponent(refPayco)}`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!resp.ok) {
      throw new EpaycoError(`Error al validar transacción: ${resp.status}`, resp.status)
    }

    const json = await resp.json() as {
      success: boolean
      data?: {
        x_response: string
        x_amount: string
        x_ref_payco: string
        x_transaction_id: string
      }
    }

    if (!json.success || !json.data) {
      return {
        status: 'ERROR',
        refPayco,
        transactionId: '',
        amount: '0',
        reference: refPayco,
      }
    }

    return {
      status: mapStatus(json.data.x_response) as TransactionValidationResponse['status'],
      refPayco: json.data.x_ref_payco,
      transactionId: json.data.x_transaction_id,
      amount: json.data.x_amount,
      reference: refPayco,
    }
  }

  async verifyWebhookSignature(payload: WebhookPayload): Promise<boolean> {
    const expected = await sha256hex(
      `${this.config.customerId}^${this.config.publicKey}^${payload.refPayco}^${payload.transactionId}^${payload.amount}^${payload.currency}`
    )
    return expected === payload.signature
  }

  mapWebhookStatus(epaycoStatus: string): string {
    return mapStatus(epaycoStatus)
  }

  parseWebhookBody(request: Request): Promise<Record<string, string>> {
    const ct = request.headers.get('content-type') ?? ''
    if (ct.includes('application/json')) return request.json()
    return request.text().then(t => {
      const params = new URLSearchParams(t)
      const obj: Record<string, string> = {}
      for (const [k, v] of params) obj[k] = v
      return obj
    })
  }
}
