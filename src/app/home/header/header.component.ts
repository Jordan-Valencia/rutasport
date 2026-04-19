import { Component, signal, inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterModule, Router, NavigationEnd } from '@angular/router'
import { CartService } from '../../services/cart.service'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  protected readonly mobileMenuOpen = signal(false)
  protected readonly cart = inject(CartService)
  private readonly router = inject(Router)
  private readonly platformId = inject(PLATFORM_ID)

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v)
  }

  scrollTo(sectionId: string, event: Event): void {
    event.preventDefault()
    this.mobileMenuOpen.set(false)
    if (!isPlatformBrowser(this.platformId)) return

    const doScroll = () => {
      const el = document.getElementById(sectionId)
      if (!el) return
      const headerH = (document.querySelector('header') as HTMLElement)?.offsetHeight ?? 80
      const top = el.getBoundingClientRect().top + window.scrollY - headerH
      window.scrollTo({ top, behavior: 'smooth' })
    }

    if (this.router.url.startsWith('/') && !this.router.url.startsWith('/catalogo') && !this.router.url.startsWith('/admin')) {
      doScroll()
    } else {
      this.router.navigate(['/']).then(() => {
        // wait for Angular to render the home page sections
        setTimeout(doScroll, 120)
      })
    }
  }
}
