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
  private isBrowser  = isPlatformBrowser(this.platformId)

  protected hero = signal<Hero | null>(null)

  constructor() {
    this.data.getHeroes().subscribe(heroes => {
      if (heroes.length > 0) {
        this.hero.set(heroes[0])
        if (heroes[0].videoUrl) {
          setTimeout(() => this.injectVideo(), 60)
        } else {
          setTimeout(() => this.animateEntrance(), 120)
        }
      }
    })
  }

  private injectVideo(retries = 10) {
    if (!this.isBrowser) return
    const h = this.hero()
    if (!h?.videoUrl) return

    const container = document.querySelector<HTMLElement>('.hero-media-container')
    if (!container) {
      if (retries > 0) setTimeout(() => this.injectVideo(retries - 1), 100)
      return
    }
    if (container.querySelector('video')) return

    const video = document.createElement('video')
    video.className = 'hero-media absolute inset-0 w-full h-full object-cover object-[center_25%] lg:object-center'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true
    video.style.pointerEvents = 'none'

    video.addEventListener('loadedmetadata', () => {
      video.play().then(() => this.animateEntrance()).catch(() => this.animateEntrance())
    }, { once: true })

    video.src = h.videoUrl
    container.append(video)
  }

  private async animateEntrance() {
    if (!this.isBrowser) return
    const { gsap } = await import('gsap')
    const content = document.querySelector('.hero-slide-content')
    const media  = document.querySelector('.hero-media-container')
    const badge  = document.querySelector('.hero-badge')
    const title  = document.querySelector('.hero-title')
    const desc   = document.querySelector('.hero-desc')
    const btns   = document.querySelectorAll('.hero-btn')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(content, { opacity: 1, duration: 0.4 }, 0)
    if (media)       tl.from(media, { scale: 1.08, duration: 1.6, ease: 'power2.out' }, 0)
    if (badge)       tl.from(badge, { opacity: 0, y: 40, duration: 0.6 }, 0.2)
    if (title)       tl.from(title, { opacity: 0, y: 50, duration: 0.9 }, 0.4)
    if (desc)        tl.from(desc,  { opacity: 0, y: 30, duration: 0.6 }, 0.7)
    if (btns.length) tl.from(btns,  { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, 0.9)
  }
}
