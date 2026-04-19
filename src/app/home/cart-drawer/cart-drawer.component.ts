import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CartService } from '../../services/cart.service'

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  protected cart = inject(CartService)
}
