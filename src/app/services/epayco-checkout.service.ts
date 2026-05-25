import { Injectable, PLATFORM_ID, inject } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

@Injectable({ providedIn: 'root' })
export class EpaycoCheckoutService {
  private platformId = inject(PLATFORM_ID)

  openCheckout(sessionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return
    const url = `https://new-checkout.epayco.co/checkout/${sessionId}`
    window.location.href = url
  }
}
