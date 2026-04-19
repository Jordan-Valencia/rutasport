import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AdminService } from './admin.service'
import { ProductsTabComponent }   from './tabs/products-tab.component'
import { BannersTabComponent }    from './tabs/banners-tab.component'
import { HeroesTabComponent }     from './tabs/heroes-tab.component'
import { SportsTabComponent }     from './tabs/sports-tab.component'
import { BrandsTabComponent }     from './tabs/brands-tab.component'
import { CategoriesTabComponent } from './tabs/categories-tab.component'
import { ImagesTabComponent }     from './tabs/images-tab.component'

type AdminTab = 'products' | 'banners' | 'heroes' | 'sports' | 'brands' | 'categories' | 'images'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ProductsTabComponent, BannersTabComponent, HeroesTabComponent,
    SportsTabComponent, BrandsTabComponent, CategoriesTabComponent,
    ImagesTabComponent,
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  private platformId = inject(PLATFORM_ID)
  protected svc = inject(AdminService)

  passwordInput = ''
  passwordError = signal(false)
  activeTab = signal<AdminTab>('products')

  readonly tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'products',   label: 'Productos',   icon: '📦' },
    { id: 'banners',    label: 'Banners',      icon: '🖼️' },
    { id: 'heroes',     label: 'Portada Home', icon: '🎯' },
    { id: 'sports',     label: 'Deportes',     icon: '⚽' },
    { id: 'brands',     label: 'Marcas',       icon: '🏷️' },
    { id: 'categories', label: 'Categorías',   icon: '🗂️' },
    { id: 'images',     label: 'Imágenes',     icon: '📷' },
  ]

  async ngOnInit() {
    await this.svc.tryAuthFromStorage()
    if (this.svc.isAuthenticated()) this.animateEntry()
  }

  async login() {
    this.passwordError.set(false)
    const ok = await this.svc.login(this.passwordInput)
    if (ok) {
      this.animateEntry()
    } else {
      this.passwordError.set(true)
    }
  }

  setTab(tab: AdminTab) {
    this.activeTab.set(tab)
    this.animateContent()
  }

  private async animateEntry() {
    if (!isPlatformBrowser(this.platformId)) return
    await new Promise(r => setTimeout(r, 40))
    const { gsap } = await import('gsap')
    const tl = gsap.timeline()
    tl.from('.rs-sidebar',      { x: -50, duration: 0.45, ease: 'power3.out' })
      .from('.rs-nav-item',     { x: -20, opacity: 0, stagger: 0.07, duration: 0.35, ease: 'power3.out' }, '-=0.25')
      .from('.rs-topbar',       { y: -20, opacity: 0, duration: 0.4,  ease: 'power3.out' }, '-=0.3')
      .from('.rs-content-card', { y: 20,  opacity: 0, duration: 0.4,  ease: 'power3.out' }, '-=0.2')
  }

  private async animateContent() {
    if (!isPlatformBrowser(this.platformId)) return
    await new Promise(r => setTimeout(r, 20))
    const { gsap } = await import('gsap')
    gsap.from('.rs-content-card', { y: 18, autoAlpha: 0, duration: 0.32, ease: 'power3.out' })
  }
}
