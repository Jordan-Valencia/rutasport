import { Component, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CartService, CartItem } from '../../services/cart.service'
import { CheckoutService } from '../../services/checkout.service'
import { CopPipe } from '../../shared/cop.pipe'

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, CopPipe],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  protected cart = inject(CartService)
  protected checkout = inject(CheckoutService)
  protected isClosing = signal(false)

  private outOfStockSet = computed(() =>
    new Set(this.checkout.outOfStockItems().map(i => `${i.productId}-${i.size ?? ''}`))
  )

  protected isOutOfStock(item: CartItem): boolean {
    return this.outOfStockSet().has(`${item.productId}-${item.size ?? ''}`)
  }

  protected removeOutOfStockItems() {
    const oosSet = this.outOfStockSet()
    this.cart.items.update(items =>
      items.filter(i => !oosSet.has(`${i.productId}-${i.size ?? ''}`))
    )
    this.checkout.clearOutOfStock()
  }

  closeWithAnimation() {
    this.isClosing.set(true)
    setTimeout(() => {
      this.cart.close()
      this.isClosing.set(false)
    }, 320)
  }
}
