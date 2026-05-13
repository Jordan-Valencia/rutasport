import { Component, inject, signal, ElementRef, viewChild, afterNextRender, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { DataService } from '../../services/data.service'
import { CartService } from '../../services/cart.service'
import { Product } from '../../models/product'
import { CopPipe } from '../../shared/cop.pipe'

@Component({
  selector: 'app-new-releases',
  imports: [CommonModule, RouterModule, CopPipe],
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.css'],
})
export class NewReleasesComponent {
  private dataService = inject(DataService)
  private platformId = inject(PLATFORM_ID)
  private router = inject(Router)

  protected cart = inject(CartService)
  protected products = signal<Product[]>([])
  protected loading = signal(true)
  protected sizePickerProduct = signal<Product | null>(null)
  protected currentIndex = signal(0)

  private sectionRef = viewChild<ElementRef>('newReleasesSection')
  private isAnimating = false
  private readonly VISIBLE = 4

  constructor() {
    this.dataService.getProducts({ isNew: true }).subscribe(data => {
      this.products.set(data.filter(p => p.isNew && p.sizes && p.sizes.trim() !== ''))
      this.loading.set(false)
    })

    afterNextRender(() => this.animateEntrance())
  }

  visibleProducts(): Product[] {
    return this.products().slice(this.currentIndex(), this.currentIndex() + this.VISIBLE)
  }

  hasPrev(): boolean {
    return this.currentIndex() > 0
  }

  hasNext(): boolean {
    return this.currentIndex() < this.products().length - this.VISIBLE
  }

  progressPercent(): number {
    const total = this.products().length
    if (total <= this.VISIBLE) return 100
    return Math.round(((this.currentIndex() + this.VISIBLE) / total) * 100)
  }

  prev() {
    if (this.hasPrev() && !this.isAnimating) this.navigate('prev')
  }

  next() {
    if (this.hasNext() && !this.isAnimating) this.navigate('next')
  }

  private async navigate(dir: 'prev' | 'next') {
    if (!isPlatformBrowser(this.platformId)) return
    this.isAnimating = true

    const { gsap } = await import('gsap')
    const section = this.sectionRef()?.nativeElement
    const cards = Array.from(section?.querySelectorAll('.product-card') ?? []) as HTMLElement[]

    const xOut = dir === 'next' ? -50 : 50

    // Phase 1: exit — slide & fade out
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

    // Phase 2: update data
    if (dir === 'next') this.currentIndex.update(i => i + 1)
    else this.currentIndex.update(i => i - 1)

    // Phase 3: wait for Angular render
    await new Promise(r => setTimeout(r, 30))

    // Phase 4: enter — reveal from opposite side
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

  openProduct(product: Product, event: Event) {
    event.stopPropagation()
    if (this.sizePickerProduct()?.id === product.id) {
      this.sizePickerProduct.set(null)
      return
    }
    this.router.navigate(['/producto', product.id])
  }

  getSizes(product: Product): string[] {
    return product.sizes
      ? product.sizes.split(',').map(s => 'US' + s.trim()).filter(Boolean)
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
      this.cart.add({
        productId: product.id!,
        name: product.name,
        brand: product.brand,
        model: product.model,
        price: product.price,
        image: product.image,
      })
      this.sizePickerProduct.set(null)
    }
  }

  addToCart(product: Product, size: string) {
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

  private async animateEntrance() {
    if (!isPlatformBrowser(this.platformId)) return

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const section = this.sectionRef()?.nativeElement
    if (!section) return

    gsap.from(section.querySelector('.section-heading'), {
      scrollTrigger: { trigger: section, start: 'top 82%' },
      y: 30,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
    })

    gsap.from(section.querySelectorAll('.product-card'), {
      scrollTrigger: { trigger: section, start: 'top 78%' },
      y: 40,
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }
}
