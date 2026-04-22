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
    { id: 'heroes',     label: 'Portada',      icon: '🎯' },
    { id: 'sports',     label: 'Deportes',     icon: '⚽' },
    { id: 'brands',     label: 'Marcas',       icon: '🏷️' },
    { id: 'categories', label: 'Categorías',   icon: '🗂️' },
    { id: 'images',     label: 'Imágenes',     icon: '📷' },
  ]

  async ngOnInit() {
    await this.svc.tryAuthFromStorage()
    if (this.svc.isAuthenticated()) this.runEntryAnimation()
  }

  async login() {
    this.passwordError.set(false)
    const ok = await this.svc.login(this.passwordInput)
    if (ok) this.runEntryAnimation()
    else this.passwordError.set(true)
  }

  setTab(tab: AdminTab) {
    this.activeTab.set(tab)
    this.runContentAnimation()
  }

  private async runEntryAnimation() {
    if (!isPlatformBrowser(this.platformId)) return
    await new Promise(r => setTimeout(r, 80))
    const { gsap } = await import('gsap')
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.rs-sidebar',
        { x: -56, opacity: 0 },
        { x: 0,   opacity: 1, duration: 0.55, clearProps: 'transform,opacity' })
      .fromTo('.rs-nav-item',
        { x: -16, opacity: 0 },
        { x: 0,   opacity: 1, stagger: 0.055, duration: 0.32, clearProps: 'transform,opacity', ease: 'power2.out' },
        '-=0.38')
      .fromTo('.rs-topbar',
        { y: -20, opacity: 0 },
        { y: 0,   opacity: 1, duration: 0.42, clearProps: 'transform,opacity' },
        '-=0.32')
      .fromTo('.rs-main-content',
        { y: 22, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.38, clearProps: 'transform,opacity' },
        '-=0.28')
  }

  private async runContentAnimation() {
    if (!isPlatformBrowser(this.platformId)) return
    await new Promise(r => setTimeout(r, 20))
    const { gsap } = await import('gsap')
    gsap.fromTo('.rs-main-content',
      { y: 16, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.28, ease: 'power2.out', clearProps: 'transform,opacity' })
  }
}
