import { Component, inject, OnInit, OnDestroy, signal, computed, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { CartService } from '../../services/cart.service'

type TxStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR'

interface TxResponse {
  id: string
  status: TxStatus
  reference: string
}

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exitoso.component.html',
})
export class PagoExitosoComponent implements OnInit, OnDestroy {
  private route      = inject(ActivatedRoute)
  private cart       = inject(CartService)
  private http       = inject(HttpClient)
  private platformId = inject(PLATFORM_ID)

  transactionId = signal<string | null>(null)
  status        = signal<TxStatus | 'LOADING' | 'ERROR_FETCH'>('LOADING')

  isLoading  = computed(() => this.status() === 'LOADING')
  isApproved = computed(() => this.status() === 'APPROVED')
  isPending  = computed(() => this.status() === 'PENDING')
  isFailed   = computed(() => ['DECLINED', 'VOIDED', 'ERROR', 'ERROR_FETCH'].includes(this.status()))

  private pollTimer: ReturnType<typeof setTimeout> | null = null
  private pollCount = 0
  private readonly MAX_POLLS = 10
  private readonly POLL_INTERVAL_MS = 3000

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return

    const id = this.route.snapshot.queryParamMap.get('id')
    if (!id) {
      this.status.set('ERROR_FETCH')
      return
    }
    this.transactionId.set(id)
    this.fetchStatus(id)
  }

  ngOnDestroy() {
    if (this.pollTimer) clearTimeout(this.pollTimer)
  }

  private async fetchStatus(id: string) {
    try {
      const tx = await firstValueFrom(
        this.http.get<TxResponse>(`/api/wompi/transaction?id=${encodeURIComponent(id)}`)
      )
      this.status.set(tx.status)

      if (tx.status === 'APPROVED') {
        this.cart.clear()
        return
      }

      // Si sigue PENDING, reintentar hasta MAX_POLLS veces
      if (tx.status === 'PENDING' && this.pollCount < this.MAX_POLLS) {
        this.pollCount++
        this.pollTimer = setTimeout(() => this.fetchStatus(id), this.POLL_INTERVAL_MS)
      }
    } catch {
      this.status.set('ERROR_FETCH')
    }
  }
}
