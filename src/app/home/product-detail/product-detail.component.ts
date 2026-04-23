import { Component, OnInit, signal, inject, computed, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { DataService } from '../../services/data.service'
import { CartService } from '../../services/cart.service'
import { Product } from '../../models/product'
import { HeaderComponent } from '../header/header.component'
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CartDrawerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private dataService = inject(DataService)
  private platformId = inject(PLATFORM_ID)

  protected cart = inject(CartService)

  product = signal<Product | null>(null)
  loading = signal(true)
  activeIndex = signal(0)
  selectedSize = signal('')
  justAdded = signal(false)
  sportBarVisible = signal(false)

  readonly SPORT_COLORS: Record<string, string | undefined> = {
    'Fútbol': '#22c55e',
    'Running': '#f97316',
    'Basketball': '#ef4444',
    'Training': '#3b82f6',
    'Tenis': '#eab308',
    'Lifestyle': '#a855f7',
    'Trail': '#92400e',
  }

  images = computed(() => {
    const p = this.product()
    if (!p) return []

    const gallery = p.gallery
      ? p.gallery.split(',').map(s => s.trim()).filter(Boolean)
      : []

    return p.image ? [p.image, ...gallery] : gallery
  })

  sizes = computed(() =>
    this.product()?.sizes
      ? this.product()!.sizes!.split(',').map(s => s.trim()).filter(Boolean)
      : []
  )

  sportColor = computed(() => {
    const firstSport = this.product()?.sports?.split(',')[0]?.trim() ?? ''
    return this.SPORT_COLORS[firstSport] ?? '#1a237e'
  })

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    if (!id) {
      this.router.navigate(['/catalogo'])
      return
    }

    this.dataService.getProductById(+id).subscribe(p => {
      if (!p) {
        this.router.navigate(['/catalogo'])
        return
      }

      this.product.set(p)
      this.loading.set(false)

      setTimeout(() => {
        this.sportBarVisible.set(true)
        this.runEntranceAnimation()
      }, 60)
    })
  }

  cycleImage() {
    if (this.images().length <= 1) return
    this.activeIndex.set((this.activeIndex() + 1) % this.images().length)
  }

  setImage(index: number) {
    this.activeIndex.set(index)
  }

  addToCart() {
    const p = this.product()
    if (!p) return
    if (this.sizes().length > 0 && !this.selectedSize()) return

    this.cart.add({
      productId: p.id!,
      name: p.name,
      brand: p.brand,
      model: p.model,
      price: p.price,
      image: p.image,
      size: this.selectedSize() || undefined,
    })

    this.justAdded.set(true)
    setTimeout(() => this.justAdded.set(false), 2000)
  }

  private async runEntranceAnimation() {
    if (!isPlatformBrowser(this.platformId)) return

    const { gsap } = await import('gsap')

    gsap.fromTo(
      '.pd-gallery-panel',
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.65, ease: 'power3.out', clearProps: 'all' }
    )

    gsap.fromTo(
      '.pd-reveal',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out', delay: 0.15, clearProps: 'all' }
    )
  }
}