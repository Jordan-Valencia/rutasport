import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { isPlatformBrowser } from '@angular/common'
import { firstValueFrom } from 'rxjs'
import { CartService } from './cart.service'

export interface User {
  id: number
  email: string
  full_name: string | null
  phone: string | null
  region: string | null
  city: string | null
  address: string | null
  createdAt: string
}

const TOKEN_KEY = 'rs_auth_token'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly platformId = inject(PLATFORM_ID)
  private readonly cart = inject(CartService)

  readonly user = signal<User | null>(null)
  readonly isAuthenticated = computed(() => this.user() !== null)
  readonly loading = signal(false)

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) this.fetchMe()
    }
  }

  get token(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null
    return localStorage.getItem(TOKEN_KEY)
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.token}` })
  }

  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(TOKEN_KEY, token)
  }

  private clearToken(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(TOKEN_KEY)
  }

  async register(email: string, password: string, full_name?: string, phone?: string, region?: string, city?: string, address?: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<{ token: string; user: User }>('/api/auth/register', { email, password, full_name, phone, region, city, address })
    )
    this.saveToken(res.token)
    this.user.set(res.user)
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<{ token: string; user: User }>('/api/auth/login', { email, password })
    )
    this.saveToken(res.token)
    this.user.set(res.user)
  }

  async logout(): Promise<void> {
    if (this.token) {
      try {
        await firstValueFrom(
          this.http.post('/api/auth/logout', {}, { headers: this.authHeaders() })
        )
      } catch {}
    }
    this.clearToken()
    this.user.set(null)
    this.cart.clear()
  }

  async fetchMe(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ user: User }>('/api/auth/me', { headers: this.authHeaders() })
      )
      this.user.set(res.user)
    } catch {
      this.clearToken()
      this.user.set(null)
    }
  }

  async updateProfile(data: { full_name?: string; email?: string; phone?: string; region?: string; city?: string; address?: string }): Promise<User> {
    const res = await firstValueFrom(
      this.http.put<{ user: User }>('/api/auth/profile', data, { headers: this.authHeaders() })
    )
    this.user.set(res.user)
    return res.user
  }

  async changePassword(current_password: string, new_password: string): Promise<void> {
    await firstValueFrom(
      this.http.put('/api/auth/password', { current_password, new_password }, { headers: this.authHeaders() })
    )
    this.clearToken()
    this.user.set(null)
  }
}
