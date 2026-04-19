import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

@Injectable({ providedIn: 'root' })
export class AdminService {
  private platformId = inject(PLATFORM_ID)
  private readonly STORAGE_KEY = 'ca_admin_session'

  readonly isAuthenticated = signal(false)
  readonly authLoading = signal(false)
  readonly adminKey = signal('')

  readonly categories = signal<any[]>([])
  readonly brands     = signal<any[]>([])
  readonly sports     = signal<any[]>([])
  readonly genders    = signal<any[]>([])

  async apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, {
      ...options,
      headers: {
        'x-admin-key': this.adminKey(),
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })
  }

  async tryAuthFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) await this.login(stored, true)
  }

  async login(key: string, silent = false): Promise<boolean> {
    this.authLoading.set(true)
    try {
      const res = await fetch('/api/admin/sports', { headers: { 'x-admin-key': key } })
      if (res.ok) {
        this.adminKey.set(key)
        if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.STORAGE_KEY, key)
        this.isAuthenticated.set(true)
        await Promise.all([this.loadCategories(), this.loadBrands(), this.loadSports(), this.loadGenders()])
        return true
      } else if (!silent && isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(this.STORAGE_KEY)
      }
    } catch {
      // silent on network error
    } finally {
      this.authLoading.set(false)
    }
    return false
  }

  logout() {
    this.isAuthenticated.set(false)
    this.adminKey.set('')
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.STORAGE_KEY)
  }

  async loadCategories() {
    try {
      const res = await this.apiFetch('/api/admin/categories')
      if (res.ok) this.categories.set(await res.json())
    } catch { /* ignore */ }
  }

  async loadBrands() {
    try {
      const res = await this.apiFetch('/api/admin/brands')
      if (res.ok) this.brands.set(await res.json())
    } catch { /* ignore */ }
  }

  async loadSports() {
    try {
      const res = await this.apiFetch('/api/admin/sports')
      if (res.ok) this.sports.set(await res.json())
    } catch { /* ignore */ }
  }

  async loadGenders() {
    try {
      const res = await this.apiFetch('/api/admin/genders')
      if (res.ok) this.genders.set(await res.json())
    } catch { /* ignore */ }
  }
}
