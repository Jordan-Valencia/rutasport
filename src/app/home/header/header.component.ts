import { Component, signal, inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { CartService } from '../../services/cart.service'

const BANNER_PHRASES = [
  'FÚTBOL · RUNNING · GYM · BASKETBALL',
  'ROPA DEPORTIVA DE ALTO RENDIMIENTO',
  'TU DEPORTE, TU ESTILO',
  'EQUIPAMIENTO PARA CADA DISCIPLINA',
  'MUJER · HOMBRE · NIÑOS',
]

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  protected readonly mobileMenuOpen = signal(false)
  protected readonly cart = inject(CartService)
  private readonly router = inject(Router)
  private readonly platformId = inject(PLATFORM_ID)

  protected readonly bannerPhrase = signal(BANNER_PHRASES[0])
  protected readonly bannerVisible = signal(false)
  private phraseIndex = 0
  private intervalId: ReturnType<typeof setInterval> | null = null

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return

    setTimeout(() => this.bannerVisible.set(true), 50)

    this.intervalId = setInterval(() => {
      this.bannerVisible.set(false)
      setTimeout(() => {
        this.phraseIndex = (this.phraseIndex + 1) % BANNER_PHRASES.length
        this.bannerPhrase.set(BANNER_PHRASES[this.phraseIndex])
        this.bannerVisible.set(true)
      }, 400)
    }, 3500)
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v)
  }

  scrollTo(sectionId: string, event: Event): void {
    event.preventDefault()
    this.mobileMenuOpen.set(false)
    if (!isPlatformBrowser(this.platformId)) return

    const doScroll = () => {
      const el = document.getElementById(sectionId)
      if (!el) return
      const headerH = (document.querySelector('header') as HTMLElement)?.offsetHeight ?? 80
      const top = el.getBoundingClientRect().top + window.scrollY - headerH
      window.scrollTo({ top, behavior: 'smooth' })
    }

    if (this.router.url.startsWith('/') && !this.router.url.startsWith('/catalogo') && !this.router.url.startsWith('/admin')) {
      doScroll()
    } else {
      this.router.navigate(['/']).then(() => {
        // wait for Angular to render the home page sections
        setTimeout(doScroll, 120)
      })
    }
  }
}
