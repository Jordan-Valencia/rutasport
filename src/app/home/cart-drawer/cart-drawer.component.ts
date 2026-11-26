import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CartService } from '../../services/cart.service'
import { WhatsappService } from '../../services/whatsapp.service'
import { CopPipe } from '../../shared/cop.pipe'

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, CopPipe],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  protected cart = inject(CartService)
  protected whatsapp = inject(WhatsappService)
  protected isClosing = signal(false)

  closeWithAnimation() {
    this.isClosing.set(true)
    setTimeout(() => {
      this.cart.close()
      this.isClosing.set(false)
    }, 320)
  }
}
