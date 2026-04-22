import {
  Component, inject, signal, computed,
  ElementRef, viewChild, PLATFORM_ID
} from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DataService, Sport } from '../../services/data.service'
import { Product } from '../../models/product'
import { CartService } from '../../services/cart.service'


interface SportMeta {
  color: string
  gradient: string
  bg: string
  icon: string
  accent: string
}


const SPORT_META: Record<string, SportMeta> = {
  'Fútbol':        { color: '#16a34a', gradient: 'from-green-600 to-emerald-500',  bg: 'bg-green-600',   icon: '⚽', accent: '#16a34a' },
  'Running':       { color: '#ea580c', gradient: 'from-orange-600 to-amber-500',   bg: 'bg-orange-600',  icon: '🏃', accent: '#ea580c' },
  'Baloncesto':    { color: '#dc2626', gradient: 'from-red-600 to-orange-500',     bg: 'bg-red-600',     icon: '🏀', accent: '#dc2626' },
  'Basketball':    { color: '#dc2626', gradient: 'from-red-600 to-orange-500',     bg: 'bg-red-600',     icon: '🏀', accent: '#dc2626' },
  'Tenis':         { color: '#ca8a04', gradient: 'from-yellow-600 to-lime-500',    bg: 'bg-yellow-500',  icon: '🎾', accent: '#ca8a04' },
  'Natación':      { color: '#0284c7', gradient: 'from-sky-600 to-cyan-500',       bg: 'bg-sky-600',     icon: '🏊', accent: '#0284c7' },
  'Ciclismo':      { color: '#7c3aed', gradient: 'from-violet-600 to-purple-500',  bg: 'bg-violet-600',  icon: '🚴', accent: '#7c3aed' },
  'Lifestyle':     { color: '#db2777', gradient: 'from-pink-600 to-rose-500',      bg: 'bg-pink-600',    icon: '✨', accent: '#db2777' },
  'Entrenamiento': { color: '#b91c1c', gradient: 'from-red-700 to-pink-600',       bg: 'bg-red-700',     icon: '💪', accent: '#b91c1c' },
  'Training':      { color: '#b91c1c', gradient: 'from-red-700 to-pink-600',       bg: 'bg-red-700',     icon: '💪', accent: '#b91c1c' },
  'Senderismo':    { color: '#92400e', gradient: 'from-amber-800 to-yellow-700',   bg: 'bg-amber-800',   icon: '🥾', accent: '#92400e' },
  'Hiking':        { color: '#92400e', gradient: 'from-amber-800 to-yellow-700',   bg: 'bg-amber-800',   icon: '🥾', accent: '#92400e' },
  'Voleibol':      { color: '#1d4ed8', gradient: 'from-blue-700 to-indigo-500',    bg: 'bg-blue-700',    icon: '🏐', accent: '#1d4ed8' },
}


const DEFAULT_META: SportMeta = {
  color: '#1a237e', gradient: 'from-indigo-700 to-blue-600', bg: 'bg-indigo-700', icon: '🏅', accent: '#1a237e'
}


@Component({
  selector: 'app-sport-categories',
  imports: [CommonModule, RouterModule],
  templateUrl: './sport-categories.component.html',
  styleUrls: ['./sport-categories.component.css'],
})
export class SportCategoriesComponent {
  private dataService = inject(DataService)
  private platformId  = inject(PLATFORM_ID)
  protected cart      = inject(CartService)

  protected sports      = signal<Sport[]>([])
  protected allProducts = signal<Product[]>([])
  protected activeSport = signal<string>('')
  protected loading     = signal(true)
  protected sectionRef  = viewChild<ElementRef>('sportCategoriesSection')

  protected sizePickerProduct = signal<Product | null>(null)

  protected filteredProducts = computed(() => {
    const sport    = this.activeSport()
    const products = this.allProducts()
    if (!sport) return products
    return products.filter(p =>
      p.sports?.includes(sport) || p.categories?.includes(sport)
    )
  })

  protected activeMeta = computed(() => SPORT_META[this.activeSport()] ?? DEFAULT_META)

  getMeta(sportName: string): SportMeta {
    return SPORT_META[sportName] ?? DEFAULT_META
  }

  constructor() {
    let sportsLoaded   = false
    let productsLoaded = false

    const tryAnimate = () => {
      if (sportsLoaded && productsLoaded) {
        setTimeout(() => this.animateSection(), 50)
      }
    }

    this.dataService.getSports().subscribe(data => {
      this.sports.set(data)
      if (data.length) this.activeSport.set(data[0].name)
      sportsLoaded = true
      tryAnimate()
    })

    this.dataService.getProducts().subscribe(data => {
      this.allProducts.set(data)
      this.loading.set(false)
      productsLoaded = true
      tryAnimate()
    })
  }

  setActiveSport(sport: string): void {
    this.activeSport.set(sport)
    this.sizePickerProduct.set(null)
    this.animateProductsIn()
  }

  getSizes(product: Product): string[] {
    return product.sizes
      ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
      : []
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
    this.cart.add({
      productId: product.id!,
      name:      product.name,
      brand:     product.brand,
      price:     product.price,
      image:     product.image,
      size,
    })
    this.sizePickerProduct.set(null)
  }

  closePicker() { this.sizePickerProduct.set(null) }

  private async animateSection() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap }        = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    const section = this.sectionRef()?.nativeElement
    if (!section) return
    const h2   = section.querySelector('h2')
    const btns = section.querySelectorAll('.sport-btn')

    if (h2) {
      gsap.from(h2, {
        scrollTrigger: { trigger: section, start: 'top 82%' },
        y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out',
        clearProps: 'all'
      })
    }
    if (btns.length) {
      gsap.from(btns, {
        scrollTrigger: { trigger: section, start: 'top 78%' },
        y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
        clearProps: 'all'
      })
    }
    this.animateProductsIn()
  }

  private async animateProductsIn() {
    if (!isPlatformBrowser(this.platformId)) return
    await new Promise(r => setTimeout(r, 50))
    const { gsap } = await import('gsap')
    const section  = this.sectionRef()?.nativeElement
    if (!section) return
    const cards = section.querySelectorAll('.product-card')
    if (cards.length) {
      gsap.from(cards, {
        y: 40, autoAlpha: 0, duration: 0.5, stagger: 0.08,
        ease: 'power3.out', clearProps: 'all'
      })
    }
  }
}