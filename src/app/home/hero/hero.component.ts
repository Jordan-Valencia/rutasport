import { Component, inject, signal, OnDestroy, PLATFORM_ID, afterNextRender } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { DataService, Hero } from '../../services/data.service'

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnDestroy {
  private data       = inject(DataService)
  private platformId = inject(PLATFORM_ID)

  heroes      = signal<Hero[]>([])
  activeIndex = signal(0)
  private timer: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.data.getHeroes().subscribe(heroes => {
      this.heroes.set(heroes)
      if (heroes.length > 1) this.startAutoPlay()
    })

    afterNextRender(() => this.animateEntrance())
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer)
  }

  private startAutoPlay() {
    this.timer = setInterval(() => this.next(), 5000)
  }

  private resetTimer() {
    if (this.timer) clearInterval(this.timer)
    if (this.heroes().length > 1) this.startAutoPlay()
  }

  next() {
    const n = this.heroes().length
    if (n < 2) return
    this.activeIndex.update(i => (i + 1) % n)
    this.animateSlide()
    this.resetTimer()
  }

  prev() {
    const n = this.heroes().length
    if (n < 2) return
    this.activeIndex.update(i => (i - 1 + n) % n)
    this.animateSlide()
    this.resetTimer()
  }

  goTo(index: number) {
    this.activeIndex.set(index)
    this.animateSlide()
    this.resetTimer()
  }

  private async animateSlide() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    gsap.from('.hero-slide-content', { opacity: 0, x: 30, duration: 0.5, ease: 'power2.out' })
    gsap.from('.hero-img', { scale: 1.05, duration: 1.4, ease: 'power2.out' })
  }

  private async animateEntrance() {
    if (!isPlatformBrowser(this.platformId)) return
    await new Promise(r => setTimeout(r, 80))
    const { gsap } = await import('gsap')
    const img   = document.querySelector('.hero-img')
    const badge = document.querySelector('.hero-badge')
    const title = document.querySelector('.hero-title')
    const desc  = document.querySelector('.hero-desc')
    const btns  = document.querySelectorAll('.hero-btn')
    const dots  = document.querySelectorAll('.hero-nav-dot')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (img)            tl.from(img,   { scale: 1.08, duration: 1.6, ease: 'power2.out' }, 0)
    if (badge)          tl.from(badge, { opacity: 0, y: 40, duration: 0.6 }, 0.3)
    if (title)          tl.from(title, { opacity: 0, y: 50, duration: 0.9 }, 0.5)
    if (desc)           tl.from(desc,  { opacity: 0, y: 30, duration: 0.6 }, 0.8)
    if (btns.length)    tl.from(btns,  { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, 1.0)
    if (dots.length)    tl.from(dots,  { opacity: 0, duration: 0.4 }, 1.2)
  }
}
