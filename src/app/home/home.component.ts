import { Component, afterNextRender, inject, signal, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HeaderComponent }          from './header/header.component'
import { FooterComponent }          from './footer/footer.component'
import { HeroComponent }            from './hero/hero.component'
import { SportCategoriesComponent } from './sport-categories/sport-categories.component'
import { FeatureBannersComponent }  from './feature-banners/feature-banners.component'
import { NewReleasesComponent }     from './new-releases/new-releases.component'
import { CartDrawerComponent }      from './cart-drawer/cart-drawer.component'
import { BestSellersComponent }    from './best-sellers/best-sellers.component'
import { DataService }              from '../services/data.service'
import { Product }                  from '../models/product'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    SportCategoriesComponent,
    FeatureBannersComponent,
    NewReleasesComponent,
    CartDrawerComponent,
    BestSellersComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private platformId = inject(PLATFORM_ID)
  private data = inject(DataService)

  featuredMujer  = signal<Product | null>(null)
  featuredHombre = signal<Product | null>(null)
  activeSection  = signal<string>('inicio')

  readonly sections = [
    { id: 'inicio',    label: 'INICIO' },
    { id: 'mujer',     label: 'MUJER' },
    { id: 'hombre',    label: 'HOMBRE' },
    { id: 'novedades', label: 'NOVEDADES' },
    { id: 'deporte',   label: 'DEPORTE' },
  ]

  constructor() {
    this.data.getProducts({ gender: 'Mujer',  bestSeller: true }).subscribe(p => this.featuredMujer.set(p[0] ?? null))
    this.data.getProducts({ gender: 'Hombre', bestSeller: true }).subscribe(p => this.featuredHombre.set(p[0] ?? null))
    afterNextRender(() => this.animateSections())
  }

  scrollToSection(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return
    const el = document.getElementById(id)
    if (!el) return
    const headerEl = document.querySelector('.sticky') as HTMLElement
    const offset = headerEl?.offsetHeight ?? 80
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  }

  private async animateSections() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    for (const id of ['mujer', 'hombre']) {
      const el = document.getElementById(id)
      if (!el) continue
      const textEl = el.querySelector('.gender-text')
      const imgEl  = el.querySelector('.gender-img')
      if (!textEl || !imgEl) continue
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 78%' } })
      tl.from(textEl, { x: id === 'mujer' ? -50 : 50, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
      tl.from(imgEl,  { x: id === 'mujer' ?  50 : -50, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) this.activeSection.set(e.target.id) }),
      { threshold: 0.3 }
    )
    this.sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
  }
}
