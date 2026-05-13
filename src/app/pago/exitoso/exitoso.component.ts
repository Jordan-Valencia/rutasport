import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { CartService } from '../../services/cart.service'

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

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id')
    if (id) this.transactionId.set(id)
    this.cart.clear()
  }
}
