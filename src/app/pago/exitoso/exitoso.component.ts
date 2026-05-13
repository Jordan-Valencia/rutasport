import { Component, inject, OnInit, signal, computed } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { CartService } from '../../services/cart.service'

type TxStatus = 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING' | 'UNKNOWN'

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exitoso.component.html',
})
export class PagoExitosoComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private cart = inject(CartService)

  transactionId = signal<string | null>(null)
  status = signal<TxStatus>('UNKNOWN')

  isApproved = computed(() => this.status() === 'APPROVED')
  isPending  = computed(() => this.status() === 'PENDING')
  isFailed   = computed(() => ['DECLINED', 'VOIDED', 'ERROR', 'UNKNOWN'].includes(this.status()))

  ngOnInit() {
    const id     = this.route.snapshot.queryParamMap.get('id')
    const status = (this.route.snapshot.queryParamMap.get('status') ?? 'UNKNOWN') as TxStatus

    if (id) this.transactionId.set(id)
    this.status.set(status)

    // Solo limpiar el carrito si el pago fue aprobado
    if (status === 'APPROVED') {
      this.cart.clear()
    }
  }
}
