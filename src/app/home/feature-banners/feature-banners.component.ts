import { Component, inject, signal, ElementRef, viewChild, afterNextRender, PLATFORM_ID, computed } from '@angular/core'
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
  protected currentIndex = signal(0)
  protected slidesPerView = signal(1)

  protected trackStyle = computed(() => ({
    transform: `translateX(-${this.currentIndex() * (100 / this.slidesPerView())}%)`,
  }))

  protected slideStyle = computed(() => ({
    flex: `0 0 ${100 / this.slidesPerView()}%`,
    width: `${100 / this.slidesPerView()}%`,
  }))

  constructor() {
    this.dataService.getBanners().subscribe(data => {
      this.banners.set(data)
      this.loading.set(false)
    })
    afterNextRender(() => {
      this.initSlidesPerView()
      this.animateEntry()
    })
  }

  protected prev() {
    const len = this.banners().length
    this.currentIndex.update(i => (i - 1 + len) % len)
  }

  protected next() {
    const len = this.banners().length
    this.currentIndex.update(i => (i + 1) % len)
  }

  protected goTo(index: number) {
    this.currentIndex.set(index)
  }

  private initSlidesPerView() {
    if (!isPlatformBrowser(this.platformId)) return
    const update = () => this.slidesPerView.set(window.innerWidth >= 1024 ? 2 : 1)
    update()
    window.addEventListener('resize', update)
  }

  private async animateEntry() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    const section = this.sectionRef()?.nativeElement
    if (!section) return

    gsap.from(section, {
      scrollTrigger: { trigger: section, start: 'top 85%' },
      y: 60,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
    })
  }
}
