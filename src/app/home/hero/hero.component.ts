import { Component, inject, signal, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { DataService, Hero } from '../../services/data.service'

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  private data       = inject(DataService)
  private platformId = inject(PLATFORM_ID)

  protected hero    = signal<Hero | null>(null)
  protected loading = signal(true)

  constructor() {
    this.data.getHeroes().subscribe(heroes => {
      if (heroes.length > 0) {
        this.hero.set(heroes[0])
        setTimeout(() => {
          this.loading.set(false)
          setTimeout(() => this.animateEntrance(), 60)
        }, 0)
      } else {
        this.loading.set(false)
      }
    })
  }

  private async animateEntrance() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const img   = document.querySelector('.hero-img')
    const badge = document.querySelector('.hero-badge')
    const title = document.querySelector('.hero-title')
    const desc  = document.querySelector('.hero-desc')
    const btns  = document.querySelectorAll('.hero-btn')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (img)         tl.from(img,   { scale: 1.08, duration: 1.6, ease: 'power2.out' }, 0)
    if (badge)       tl.from(badge, { opacity: 0, y: 40, duration: 0.6 }, 0.2)
    if (title)       tl.from(title, { opacity: 0, y: 50, duration: 0.9 }, 0.4)
    if (desc)        tl.from(desc,  { opacity: 0, y: 30, duration: 0.6 }, 0.7)
    if (btns.length) tl.from(btns,  { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, 0.9)
  }
}
