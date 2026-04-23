import { Component, inject, signal, ElementRef, viewChild, afterNextRender, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { DataService } from '../../services/data.service'
import { CartService } from '../../services/cart.service'
import { Product } from '../../models/product'

@Component({
  selector: 'app-new-releases',
  imports: [CommonModule, RouterModule],
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

  private sectionRef = viewChild<ElementRef>('newReleasesSection')

  constructor() {
    this.dataService.getProducts({ isNew: true }).subscribe(data => {
      this.products.set(data.filter(p => p.isNew))
      this.loading.set(false)
    })

    afterNextRender(() => this.animateCards())
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

  private async animateCards() {
    if (!isPlatformBrowser(this.platformId)) return

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    const section = this.sectionRef()?.nativeElement
    if (!section) return

    const heading = section.querySelector('.section-heading')
    const cards = section.querySelectorAll('.product-card')

    if (heading) {
      gsap.from(heading, {
        scrollTrigger: { trigger: section, start: 'top 82%' },
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out'
      })
    }

    if (cards.length) {
      gsap.from(cards, {
        scrollTrigger: { trigger: section, start: 'top 78%' },
        x: 60,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      })
    }
  }
}