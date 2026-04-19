import { Component, inject, signal, ElementRef, viewChild, afterNextRender, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { DataService } from '../../services/data.service'
import { FeatureBanner } from '../../models/feature-banner'

@Component({
  selector: 'app-feature-banners',
  imports: [CommonModule],
  templateUrl: './feature-banners.component.html',
  styleUrls: ['./feature-banners.component.css'],
})
export class FeatureBannersComponent {
  private dataService = inject(DataService)
  private platformId = inject(PLATFORM_ID)
  protected banners = signal<FeatureBanner[]>([])
  private sectionRef = viewChild<ElementRef>('featureBannersSection')

  protected loading = signal(true)

  constructor() {
    this.dataService.getBanners().subscribe(data => {
      this.banners.set(data)
      this.loading.set(false)
    })
    afterNextRender(() => this.animateBanners())
  }

  private async animateBanners() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    const section = this.sectionRef()?.nativeElement
    if (!section) return

    const banners = section.querySelectorAll('.banner-item')
    banners.forEach((banner: Element, i: number) => {
      gsap.from(banner, {
        scrollTrigger: { trigger: banner, start: 'top 85%' },
        x: i % 2 === 0 ? -80 : 80,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out'
      })
      const content = banner.querySelector('.banner-content')
      if (content) {
        gsap.from(content.children, {
          scrollTrigger: { trigger: banner, start: 'top 80%' },
          y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.3
        })
      }
    })
  }
}
