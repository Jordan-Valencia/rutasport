import { Component, signal, inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule, Router } from '@angular/router'
import { CartService } from '../../services/cart.service'
import { AuthService } from '../../services/auth.service'

const SECTIONS = ['mujer', 'hombre', 'novedades', 'deporte']

const BANNER_PHRASES = [
  'FÚTBOL · RUNNING · GYM · BASKETBALL',
  'ROPA DEPORTIVA DE ALTO RENDIMIENTO',
  'TU DEPORTE, TU ESTILO',
  'EQUIPAMIENTO PARA CADA DISCIPLINA',
  'MUJER · HOMBRE · NIÑOS',
]

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  protected readonly mobileMenuOpen = signal(false)
  protected readonly cart = inject(CartService)
  protected readonly auth = inject(AuthService)
  private readonly router = inject(Router)
  private readonly platformId = inject(PLATFORM_ID)

  protected readonly bannerPhrase = signal(BANNER_PHRASES[0])
  protected readonly bannerVisible = signal(false)
  protected readonly scrollProgress = signal(0)
  protected readonly activeSection = signal<string>('')
  protected readonly searchQuery = signal('')
  protected readonly searchOpen = signal(false)

  private phraseIndex = 0
  private intervalId: ReturnType<typeof setInterval> | null = null
  private scrollFn: (() => void) | null = null
  private sectionObserver: IntersectionObserver | null = null

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

    this.scrollFn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      this.scrollProgress.set(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    window.addEventListener('scroll', this.scrollFn, { passive: true })

    this.sectionObserver = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) this.activeSection.set(e.target.id) }),
      { threshold: 0.35 }
    )
    setTimeout(() => {
      SECTIONS.forEach(id => {
        const el = document.getElementById(id)
        if (el) this.sectionObserver!.observe(el)
      })
    }, 300)
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId)
    if (this.scrollFn) window.removeEventListener('scroll', this.scrollFn)
    if (this.sectionObserver) this.sectionObserver.disconnect()
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v)
  }

  toggleSearch(): void {
    this.searchOpen.update(v => !v)
  }

  doSearch(): void {
    const q = this.searchQuery().trim()
    if (q) {
      this.router.navigate(['/catalogo'], { queryParams: { q } })
      this.searchOpen.set(false)
      this.searchQuery.set('')
    }
  }

  closeSearch(): void {
    this.searchQuery.set('')
    this.searchOpen.set(false)
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
