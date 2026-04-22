import { Component, inject, signal, ElementRef, viewChild, PLATFORM_ID, effect } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { DataService } from '../../services/data.service'
import { CartService } from '../../services/cart.service'
import { Product } from '../../models/product'

@Component({
  selector: 'app-best-sellers',
  imports: [CommonModule, RouterModule],
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css'],
})
export class BestSellersComponent {
  private dataService = inject(DataService)
  private platformId = inject(PLATFORM_ID)
  private router = inject(Router)
  protected cart = inject(CartService)
  protected products = signal<Product[]>([])
  protected loading = signal(true)
  protected sizePickerProduct = signal<Product | null>(null)
  private sectionRef = viewChild<ElementRef>('bestSellersSection')

  constructor() {
    this.dataService.getProducts({ bestSeller: true }).subscribe(data => {
      this.products.set(data)
      this.loading.set(false)
    })
    let hasAnimated = false
    effect(() => {
      const section = this.sectionRef()?.nativeElement
      const loaded = !this.loading()
      if (loaded && section && !hasAnimated) {
        hasAnimated = true
        this.animateCards()
      }
    })
  }

  getSizes(product: Product): string[] {
    return product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
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
      this.sizePickerProduct.set(this.sizePickerProduct()?.id === product.id ? null : product)
    } else {
      this.cart.add({ productId: product.id!, name: product.name, brand: product.brand, price: product.price, image: product.image })
      this.sizePickerProduct.set(null)
    }
  }

  addToCart(product: Product, size: string) {
    this.cart.add({ productId: product.id!, name: product.name, brand: product.brand, price: product.price, image: product.image, size })
    this.sizePickerProduct.set(null)
  }

  private async animateCards() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    const section = this.sectionRef()?.nativeElement
    if (!section) return

    gsap.from(section.querySelector('.section-heading'), {
      scrollTrigger: { trigger: section, start: 'top 82%' },
      y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out'
    })
    gsap.from(section.querySelectorAll('.product-card'), {
      scrollTrigger: { trigger: section, start: 'top 76%' },
      y: 55, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    })
  }
}
