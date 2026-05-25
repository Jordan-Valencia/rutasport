import { Component, inject, signal, PLATFORM_ID, afterNextRender } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { DataService, Hero } from '../../services/data.service'

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  private data = inject(DataService)
  private platformId = inject(PLATFORM_ID)
  private isBrowser = isPlatformBrowser(this.platformId)

  protected hero = signal<Hero | null>(null)

  constructor() {
    afterNextRender(() => this.injectVideo())

    this.data.getHeroes().subscribe(heroes => {
      if (heroes.length > 0) {
        this.hero.set(heroes[0])
        setTimeout(() => this.injectVideo())
      }
    })
  }

  private injectVideo(retries = 8) {
    const h = this.hero()
    if (!h?.videoUrl) return
    const container = document.querySelector<HTMLDivElement>('.hero-media-container')
    if (!container) {
      if (retries > 0) setTimeout(() => this.injectVideo(retries - 1), 150)
      return
    }
    if (container.querySelector('video')) return

    const video = document.createElement('video')
    video.className = 'absolute inset-0 w-full h-full object-cover'
    video.src = h.videoUrl
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true
    video.style.pointerEvents = 'none'
    video.style.opacity = '0'
    video.style.transition = 'opacity 0.4s ease'
    video.addEventListener('loadedmetadata', () => {
      video.style.opacity = '1'
      this.animateEntrance()
    })
    container.append(video)
  }

  onImgReady() {
    if (!this.hero()?.videoUrl) {
      setTimeout(() => this.animateEntrance(), 60)
    }
  }

  private async animateEntrance() {
    if (!this.isBrowser) return
    const { gsap } = await import('gsap')

    const wrapper = document.querySelector('.hero-entrance-wrap')
    const media = document.querySelector('.hero-media-container')
    const badge = document.querySelector('.hero-badge')
    const title = document.querySelector('.hero-title')
    const subtitle = document.querySelector('.hero-subtitle')
    const desc  = document.querySelector('.hero-desc')
    const btns  = document.querySelectorAll('.hero-btn')

    gsap.set(wrapper, { opacity: 1, filter: 'blur(0px)' })
    gsap.set(media, { scale: 1.08 })
    if (badge)    gsap.set(badge, { y: 40 })
    if (title)    gsap.set(title, { y: 50 })
    if (subtitle) gsap.set(subtitle, { y: 40 })
    if (desc)     gsap.set(desc, { y: 30 })
    gsap.set(btns, { y: 20 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (media)       tl.to(media, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
    if (badge)       tl.to(badge, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.6 }, 0.2)
    if (title)       tl.to(title, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9 }, 0.4)
    if (subtitle)    tl.to(subtitle, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8 }, 0.5)
    if (desc)        tl.to(desc,  { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.6 }, 0.7)
    if (btns.length) tl.to(btns,  { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, stagger: 0.15 }, 0.9)
  }
}
