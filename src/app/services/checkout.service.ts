import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { CartService } from './cart.service'
import { AuthService } from './auth.service'
import { EpaycoCheckoutService } from './epayco-checkout.service'

export interface OutOfStockItem {
  productId: number
  size?: string
  name: string
  available: number
}

interface CheckoutResponse {
  orderId: number
  reference: string
  totalCOP: number
  sessionId: string
  test: boolean
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private platformId = inject(PLATFORM_ID)
  private http = inject(HttpClient)
  private router = inject(Router)
  private cart = inject(CartService)
  private auth = inject(AuthService)
  private epaycoCheckout = inject(EpaycoCheckoutService)

  isLoading = signal(false)
  error = signal<string | null>(null)
  outOfStockItems = signal<OutOfStockItem[]>([])

  clearOutOfStock() {
    this.outOfStockItems.set([])
  }

  async checkout() {
    if (!isPlatformBrowser(this.platformId)) return
    if (this.cart.items().length === 0) return

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'])
      return
    }

    this.isLoading.set(true)
    this.error.set(null)
    this.outOfStockItems.set([])

    try {
      const headers = this.auth.token
        ? new HttpHeaders({ Authorization: `Bearer ${this.auth.token}` })
        : undefined
      const res = await firstValueFrom(
        this.http.post<CheckoutResponse>('/api/orders', { items: this.cart.items() }, { headers })
      )

      if (res?.sessionId) {
        this.isLoading.set(false)
        this.epaycoCheckout.openCheckout(res.sessionId)
        return
      }

      this.isLoading.set(false)
    } catch (err: any) {
      if (err?.status === 409 && err?.error?.outOfStock?.length) {
        this.outOfStockItems.set(err.error.outOfStock)
      } else if (err?.error?.error) {
        this.error.set(err.error.error)
      } else {
        this.error.set('Error al procesar el pago. Intenta de nuevo.')
      }
      this.isLoading.set(false)
    }
  }
}
