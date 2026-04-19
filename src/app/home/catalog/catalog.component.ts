import { Component, inject, signal, computed, PLATFORM_ID, afterNextRender } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule, ActivatedRoute } from '@angular/router'
import { DataService } from '../../services/data.service'
import { CartService } from '../../services/cart.service'
import { HeaderComponent } from '../header/header.component'
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component'
import { Product } from '../../models/product'

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, CartDrawerComponent],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent {
  private dataService = inject(DataService)
  private route       = inject(ActivatedRoute)
  private platformId  = inject(PLATFORM_ID)
  protected cart      = inject(CartService)

  allProducts = signal<Product[]>([])
  loading     = signal(true)

  selectedCategory = signal('')
  selectedBrand    = signal('')
  selectedSport    = signal('')
  searchQuery      = signal('')
  sortBy           = signal('default')

  sizePickerProduct = signal<Product | null>(null)

  readonly SPORT_COLORS: Record<string, string | undefined> = {
    'Fútbol':     '#22c55e',
    'Running':    '#f97316',
    'Basketball': '#ef4444',
    'Training':   '#3b82f6',
    'Tenis':      '#eab308',
    'Lifestyle':  '#a855f7',
    'Trail':      '#92400e',
  }

  categories = computed(() =>
    [...new Set(this.allProducts().map(p => p.category).filter((v): v is string => !!v))].sort()
  )
  brands = computed(() =>
    [...new Set(this.allProducts().map(p => p.brand).filter((v): v is string => !!v))].sort()
  )
  sports = computed(() =>
    [...new Set(this.allProducts().map(p => p.sport).filter((v): v is string => !!v))].sort()
  )

  filteredProducts = computed(() => {
    let products = this.allProducts()
    const cat   = this.selectedCategory()
    const brand = this.selectedBrand()
    const sport = this.selectedSport()
    const q     = this.searchQuery().toLowerCase().trim()
    const sort  = this.sortBy()

    if (cat)   products = products.filter(p => p.category === cat)
    if (brand) products = products.filter(p => p.brand === brand)
    if (sport) products = products.filter(p => p.sport === sport)
    if (q)     products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q)
    )

    if (sort === 'price-asc')  return [...products].sort((a, b) => this.parsePrice(a.price) - this.parsePrice(b.price))
    if (sort === 'price-desc') return [...products].sort((a, b) => this.parsePrice(b.price) - this.parsePrice(a.price))
    if (sort === 'new')        return [...products].filter(p => p.isNew).concat(products.filter(p => !p.isNew))
    if (sort === 'top')        return [...products].filter(p => p.isBestSeller).concat(products.filter(p => !p.isBestSeller))
    return products
  })

  constructor() {
    this.dataService.getProducts().subscribe(data => {
      this.allProducts.set(data)
      this.loading.set(false)
    })
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) this.selectedCategory.set(params['categoria'])
      if (params['marca'])     this.selectedBrand.set(params['marca'])
      if (params['deporte'])   this.selectedSport.set(params['deporte'])
    })
    afterNextRender(() => this.animateIn())
  }

  parsePrice(p: string): number { return parseInt(p.replace(/[^\d]/g, '')) || 0 }

  getSizes(product: Product): string[] {
    return product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
  }

  onAddClick(product: Product, event: Event) {
    event.stopPropagation()
    const sizes = this.getSizes(product)
    if (sizes.length > 0) {
      this.sizePickerProduct.set(this.sizePickerProduct()?.id === product.id ? null : product)
    } else {
      this.addToCart(product)
    }
  }

  addToCart(product: Product, size?: string) {
    this.cart.add({ productId: product.id!, name: product.name, brand: product.brand, price: product.price, image: product.image, size })
    this.sizePickerProduct.set(null)
  }

  clearFilters() {
    this.selectedCategory.set('')
    this.selectedBrand.set('')
    this.selectedSport.set('')
    this.searchQuery.set('')
    this.sortBy.set('default')
  }

  private async animateIn() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    gsap.from('.catalog-card', { y: 30, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', clearProps: 'all' })
  }

  get hasActiveFilters() {
    return this.selectedCategory() || this.selectedBrand() || this.selectedSport() || this.searchQuery()
  }
}
