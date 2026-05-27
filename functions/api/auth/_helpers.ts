export interface Env {
  DB: D1Database
  GMAIL_USER?: string
  GMAIL_APP_PASSWORD?: string
  RESEND_API_KEY?: string
}

export interface UserRow {
  id: number
  email: string
  full_name: string | null
  phone: string | null
  region: string | null
  city: string | null
  address: string | null
  createdAt: string
}

export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

export const CORS_OPTIONS = new Response(null, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
})

const SESSION_COOKIE = 'rs_session'
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export function setSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}`
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
}

/** Extracts the session token from the Cookie header */
export function getTokenFromCookie(request: Request): string | null {
  const cookie = request.headers.get('Cookie') ?? ''
  for (const part of cookie.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith(SESSION_COOKIE + '=')) {
      return trimmed.slice(SESSION_COOKIE.length + 1) || null
    }
  }
  return null
}

export function jsonOk(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS })
}

export function jsonErr(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), { status, headers: JSON_HEADERS })
}

// ── Password hashing via PBKDF2 (Web Crypto – compatible with CF Workers) ────

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial, 256
  )
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${saltHex}:${hashHex}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial, 256
  )
  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === hashHex
}

// ── Session token ─────────────────────────────────────────────────────────────

export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Returns the user row if the Authorization: Bearer <token> session is valid */
export async function getAuthenticatedUser(
  request: Request,
  DB: D1Database
): Promise<UserRow | null> {
  const auth = request.headers.get('Authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null

  const row = await DB
    .prepare(`
      SELECT u.id, u.email, u.full_name, u.phone, u.region, u.city, u.address, u.createdAt
      FROM user_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ?
        AND datetime(s.expires_at) > datetime('now')
    `)
    .bind(token)
    .first<UserRow>()

  return row ?? null
}
