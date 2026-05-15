import { Component, inject, signal, computed, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { DataService } from '../../services/data.service'
import { CartService } from '../../services/cart.service'
import { HeaderComponent } from '../header/header.component'
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component'
import { FooterComponent } from '../footer/footer.component'
import { Product } from '../../models/product'
import { CopPipe } from '../../shared/cop.pipe'

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, CartDrawerComponent, FooterComponent, CopPipe],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent {
  private dataService = inject(DataService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private platformId = inject(PLATFORM_ID)
  protected cart = inject(CartService)

  allProducts = signal<Product[]>([])
  loading = signal(true)

  selectedCategory = signal('')
  selectedBrand = signal('')
  selectedSport = signal('')
  selectedGender = signal('')
  filterBestSeller = signal(false)
  filterIsNew = signal(false)
  searchQuery = signal('')
  sortBy = signal('default')

  sizePickerProduct = signal<Product | null>(null)
  filterPanelOpen = signal(false)
  sportOpen = signal(true)
  categoryOpen = signal(true)
  brandOpen = signal(true)
  genderOpen = signal(true)
  specialOpen = signal(true)

  readonly SPORT_COLORS: Record<string, string | undefined> = {
    'Fútbol': '#22c55e',
    'Running': '#f97316',
    'Basketball': '#ef4444',
    'Training': '#3b82f6',
    'Tenis': '#eab308',
    'Lifestyle': '#a855f7',
    'Trail': '#92400e',
  }

  categories = signal<string[]>([])
  brands = signal<string[]>([])
  sports = signal<string[]>([])
  genders = signal<string[]>([])

  activeFilterCount = computed(() => {
    let n = 0
    if (this.selectedSport()) n++
    if (this.selectedCategory()) n++
    if (this.selectedBrand()) n++
    if (this.selectedGender()) n++
    if (this.filterBestSeller()) n++
    if (this.filterIsNew()) n++
    return n
  })

  filteredProducts = computed(() => {
    let products = this.allProducts().filter(p => !this.isOutOfStock(p))
    const cat = this.selectedCategory()
    const brand = this.selectedBrand()
    const sport = this.selectedSport()
    const gender = this.selectedGender()
    const q = this.searchQuery().toLowerCase().trim()
    const sort = this.sortBy()

    if (cat) {
      products = products.filter(p =>
        p.categories?.split(',').map(s => s.trim()).includes(cat)
      )
    }

    if (brand) {
      products = products.filter(p => p.brand === brand)
    }

    if (sport) {
      products = products.filter(p =>
        p.sports?.split(',').map(s => s.trim()).includes(sport)
      )
    }

    if (gender) {
      products = products.filter(p => p.gender === gender)
    }

    if (this.filterBestSeller()) {
      products = products.filter(p => p.isBestSeller)
    }

    if (this.filterIsNew()) {
      products = products.filter(p => p.isNew)
    }

    if (q) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.model ?? '').toLowerCase().includes(q) ||
        (p.brand ?? '').toLowerCase().includes(q) ||
        (p.categories ?? '').toLowerCase().includes(q)
      )
    }

    if (sort === 'price-asc') {
      return [...products].sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-desc') {
      return [...products].sort((a, b) => b.price - a.price)
    }

    if (sort === 'new') {
      return [...products]
        .filter(p => p.isNew)
        .concat(products.filter(p => !p.isNew))
    }

    if (sort === 'top') {
      return [...products]
        .filter(p => p.isBestSeller)
        .concat(products.filter(p => !p.isBestSeller))
    }

    return products
  })

  constructor() {
    this.dataService.getProducts().subscribe(data => {
      this.allProducts.set(data)
      this.loading.set(false)
      setTimeout(() => this.animateCardsIn(), 16)
    })

    this.dataService.getBrands().subscribe(data =>
      this.brands.set(data.map(b => b.name).filter(Boolean).sort())
    )

    this.dataService.getCategories().subscribe(data =>
      this.categories.set(data.map(c => c.name).filter(Boolean).sort())
    )

    this.dataService.getSports().subscribe(data =>
      this.sports.set(data.map(s => s.name).filter(Boolean).sort())
    )

    this.dataService.getGenders().subscribe(data =>
      this.genders.set(data.map(g => g.name).filter(Boolean).sort())
    )

    this.route.queryParams.subscribe(params => {
      if (params['categoria']) this.selectedCategory.set(params['categoria'])
      if (params['marca']) this.selectedBrand.set(params['marca'])
      if (params['deporte']) this.selectedSport.set(params['deporte'])
      if (params['genero']) this.selectedGender.set(params['genero'])
      if (params['novedades']) this.filterIsNew.set(true)
      if (params['bestSeller']) this.filterBestSeller.set(true)
    })
  }

  firstSport(product: Product): string {
    return product.sports?.split(',')[0]?.trim() ?? ''
  }

getSizes(product: Product): string[] {
    return product.sizes
      ? product.sizes.split(',').map(s => 'US' + s.trim()).filter(Boolean)
      : []
  }

  getInventoryMap(product: Product): Record<string, number> {
    const raw = product.inventory_raw
    if (!raw) return {}
    return Object.fromEntries(
      raw.split(',').map(e => {
        const [s, c] = e.split(':')
        return [s.trim(), parseInt(c) || 0]
      })
    )
  }

  isOutOfStock(product: Product): boolean {
    return !product.sizes || product.sizes.trim() === ''
  }

  stockForSize(product: Product, displaySize: string): number {
    const raw = displaySize.replace(/^US/i, '')
    return this.getInventoryMap(product)[raw] ?? 1
  }

  openProduct(product: Product, event: Event) {
    event.stopPropagation()

    if (this.sizePickerProduct()?.id === product.id) {
      this.sizePickerProduct.set(null)
      return
    }

    this.router.navigate(['/producto', product.id])
  }

  onAddClick(product: Product, event: Event) {
    event.stopPropagation()

    const sizes = this.getSizes(product)

    if (sizes.length > 0) {
      this.sizePickerProduct.set(
        this.sizePickerProduct()?.id === product.id ? null : product
      )
    } else {
      this.addToCart(product)
    }
  }

  addToCart(product: Product, size?: string) {
    const maxStock = size ? this.stockForSize(product, size) : undefined
    this.cart.add({
      productId: product.id!,
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: product.price,
      image: product.image,
      size,
      maxStock,
    })

    this.sizePickerProduct.set(null)
  }

  clearFilters() {
    this.selectedCategory.set('')
    this.selectedBrand.set('')
    this.selectedSport.set('')
    this.selectedGender.set('')
    this.filterBestSeller.set(false)
    this.filterIsNew.set(false)
    this.searchQuery.set('')
    this.sortBy.set('default')
  }

  async openFilterPanel() {
    if (!isPlatformBrowser(this.platformId)) return

    this.filterPanelOpen.set(true)
    await new Promise(r => setTimeout(r, 16))

    const { gsap } = await import('gsap')

    gsap.fromTo(
      '.rs-filter-panel',
      { x: '-100%' },
      { x: '0%', duration: 0.42, ease: 'power3.out' }
    )

    gsap.fromTo(
      '.rs-filter-backdrop',
      { opacity: 0 },
      { opacity: 1, duration: 0.28 }
    )
  }

  async closeFilterPanel() {
    if (!isPlatformBrowser(this.platformId)) return

    const { gsap } = await import('gsap')

    gsap.to('.rs-filter-backdrop', { opacity: 0, duration: 0.25 })
    gsap.to('.rs-filter-panel', {
      x: '-100%',
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => this.filterPanelOpen.set(false)
    })
  }

  private async animateCardsIn() {
    if (!isPlatformBrowser(this.platformId)) return

    const { gsap } = await import('gsap')

    gsap.from('.catalog-card', {
      y: 28,
      opacity: 0,
      duration: 0.4,
      stagger: 0.04,
      ease: 'power2.out',
      clearProps: 'all'
    })
  }

  get hasActiveFilters() {
    return this.selectedCategory() ||
      this.selectedBrand() ||
      this.selectedSport() ||
      this.selectedGender() ||
      this.filterBestSeller() ||
      this.filterIsNew() ||
      this.searchQuery()
  }
}