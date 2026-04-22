import { Component, inject, signal, ElementRef, viewChild, PLATFORM_ID, effect } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DataService } from '../../services/data.service'
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
  protected products = signal<Product[]>([])
  protected loading = signal(true)
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
