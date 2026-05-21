import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

interface EpaycoCheckoutInstance {
  onCreated(cb: () => void): void
  onErrors(cb: (err: unknown) => void): void
  onClosed(cb: () => void): void
  open(): void
}

interface EpaycoWindow {
  checkout: {
    configure(opts: {
      sessionId: string
      type: 'onpage' | 'standard'
      test?: boolean
    }): EpaycoCheckoutInstance
  }
}

@Injectable({ providedIn: 'root' })
export class EpaycoCheckoutService {
  private platformId = inject(PLATFORM_ID)

  private scriptLoaded = false
  private loadPromise: Promise<void> | null = null
  isModalOpen = signal(false)

  private get ePayco(): EpaycoWindow | null {
    if (!isPlatformBrowser(this.platformId)) return null
    return (window as unknown as { ePayco?: EpaycoWindow }).ePayco ?? null
  }

  private loadScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return Promise.reject(new Error('Not in browser'))
    if (this.scriptLoaded) return Promise.resolve()
    if (this.loadPromise) return this.loadPromise

    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.epayco.co/checkout-v2.js'
      script.async = true
      script.onload = () => {
        this.scriptLoaded = true
        resolve()
      }
      script.onerror = () => {
        this.loadPromise = null
        reject(new Error('Error al cargar checkout-v2.js'))
      }
      document.head.appendChild(script)
    })

    return this.loadPromise
  }

  async openCheckout(sessionId: string, testMode: boolean): Promise<void> {
    await this.loadScript()

    const epayco = this.ePayco
    if (!epayco) throw new Error('ePayco no está disponible')

    this.isModalOpen.set(true)

    const checkout = epayco.checkout.configure({
      sessionId,
      type: 'onpage',
      test: testMode,
    })

    checkout.onErrors((err) => {
      console.error('ePayco error:', err)
      this.isModalOpen.set(false)
    })

    checkout.onClosed(() => {
      this.isModalOpen.set(false)
    })

    checkout.open()
  }
}
