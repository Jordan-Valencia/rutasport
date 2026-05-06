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
  color: '#E31C1C',
  gradient: 'from-indigo-700 to-blue-600',
  bg: 'bg-indigo-700',
  icon: '🏅',
  accent: '#E31C1C'
}

@Component({
  selector: 'app-sport-categories',
  imports: [CommonModule, RouterModule],
  templateUrl: './sport-categories.component.html',
  styleUrls: ['./sport-categories.component.css'],
})
export class SportCategoriesComponent {
  private dataService = inject(DataService)
  private platformId = inject(PLATFORM_ID)
  protected cart = inject(CartService)

  protected sports = signal<Sport[]>([])
  protected allProducts = signal<Product[]>([])
  protected activeSport = signal<string>('')
  protected loading = signal(true)
  protected sectionRef = viewChild<ElementRef>('sportCategoriesSection')

  protected sizePickerProduct = signal<Product | null>(null)
  protected currentIndex = signal(0)
  private isAnimating = false
  private readonly VISIBLE = 4

  protected filteredProducts = computed(() => {
    const sport = this.activeSport()
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
    let sportsLoaded = false
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

  async setActiveSport(sport: string): Promise<void> {
    if (this.activeSport() === sport || this.isAnimating) return
    this.isAnimating = true

    // Phase 1: animate current cards out
    await this.animateCardsOut()

    // Phase 2: swap data
    this.activeSport.set(sport)
    this.sizePickerProduct.set(null)
    this.currentIndex.set(0)

    // Phase 3: wait for Angular re-render
    await new Promise(r => setTimeout(r, 40))

    // Phase 4: animate new cards in
    await this.animateCardsIn()

    this.isAnimating = false
  }

  async prev() {
    if (this.hasPrev() && !this.isAnimating) this.navigateProducts('prev')
  }

  async next() {
    if (this.hasNext() && !this.isAnimating) this.navigateProducts('next')
  }

  private async navigateProducts(dir: 'prev' | 'next') {
    if (!isPlatformBrowser(this.platformId)) return
    this.isAnimating = true

    const { gsap } = await import('gsap')
    const section = this.sectionRef()?.nativeElement
    const cards = Array.from(section?.querySelectorAll('.product-card') ?? []) as HTMLElement[]

    const xOut = dir === 'next' ? -50 : 50

    await new Promise<void>(resolve =>
      gsap.to(cards, {
        x: xOut,
        opacity: 0,
        duration: 0.22,
        stagger: { each: 0.04, from: dir === 'next' ? 'start' : 'end' },
        ease: 'power2.in',
        onComplete: resolve,
      })
    )

    if (dir === 'next') this.currentIndex.update(i => i + 1)
    else this.currentIndex.update(i => i - 1)

    await new Promise(r => setTimeout(r, 30))

    const newCards = Array.from(section?.querySelectorAll('.product-card') ?? []) as HTMLElement[]
    await new Promise<void>(resolve =>
      gsap.fromTo(
        newCards,
        { x: -xOut, opacity: 0, scale: 0.97 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.38,
          stagger: { each: 0.07, from: dir === 'next' ? 'start' : 'end' },
          ease: 'power3.out',
          onComplete: resolve,
        }
      )
    )

    this.isAnimating = false
  }

  private async animateCardsOut(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const section = this.sectionRef()?.nativeElement
    const cards = Array.from(section?.querySelectorAll('.product-card') ?? []) as HTMLElement[]
    if (!cards.length) return

    return new Promise<void>(resolve =>
      gsap.to(cards, {
        y: -20,
        opacity: 0,
        scale: 0.97,
        duration: 0.2,
        stagger: 0.04,
        ease: 'power2.in',
        onComplete: resolve,
      })
    )
  }

  private async animateCardsIn(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const section = this.sectionRef()?.nativeElement
    const cards = Array.from(section?.querySelectorAll('.product-card') ?? []) as HTMLElement[]
    if (!cards.length) return

    return new Promise<void>(resolve =>
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.38,
          stagger: 0.07,
          ease: 'power3.out',
          onComplete: resolve,
        }
      )
    )
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
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: product.price,
      image: product.image,
      size,
    })
    this.sizePickerProduct.set(null)
  }

  closePicker() {
    this.sizePickerProduct.set(null)
  }

  visibleProducts(): Product[] {
    const idx = this.currentIndex()
    return this.filteredProducts().slice(idx, idx + this.VISIBLE)
  }

  hasPrev(): boolean {
    return this.currentIndex() > 0
  }

  hasNext(): boolean {
    return this.currentIndex() < this.filteredProducts().length - this.VISIBLE
  }

  progressPercent(): number {
    const total = this.filteredProducts().length
    if (total <= this.VISIBLE) return 100
    return Math.round(((this.currentIndex() + this.VISIBLE) / total) * 100)
  }

  private async animateSection() {
    if (!isPlatformBrowser(this.platformId)) return

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const section = this.sectionRef()?.nativeElement
    if (!section) return

    gsap.from(section.querySelector('h2'), {
      scrollTrigger: { trigger: section, start: 'top 82%' },
      y: 30,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'all',
    })

    gsap.from(section.querySelectorAll('.sport-btn'), {
      scrollTrigger: { trigger: section, start: 'top 78%' },
      y: 20,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'all',
    })

    await new Promise(r => setTimeout(r, 50))
    await this.animateCardsIn()
  }
}
