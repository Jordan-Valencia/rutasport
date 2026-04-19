import { Component, afterNextRender, inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HeaderComponent }          from './header/header.component'
import { FooterComponent }          from './footer/footer.component'
import { HeroComponent }            from './hero/hero.component'
import { SportCategoriesComponent } from './sport-categories/sport-categories.component'
import { FeatureBannersComponent }  from './feature-banners/feature-banners.component'
import { NewReleasesComponent }     from './new-releases/new-releases.component'
import { CartDrawerComponent }      from './cart-drawer/cart-drawer.component'

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
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private platformId = inject(PLATFORM_ID)

  constructor() {
    afterNextRender(() => this.animateSections())
  }

  private async animateSections() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    // MUJER section
    const mujer = document.getElementById('mujer')
    if (mujer) {
      const h2  = mujer.querySelector('h2')
      const txt = mujer.querySelector('p')
      const btn = mujer.querySelector('a')
      const tl  = gsap.timeline({ scrollTrigger: { trigger: mujer, start: 'top 75%' } })
      if (h2)  tl.from(h2,  { x: -60, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
      if (txt) tl.from(txt, { x: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      if (btn) tl.from(btn, { x: -30, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    }

    // HOMBRE section
    const hombre = document.getElementById('hombre')
    if (hombre) {
      const h2  = hombre.querySelector('h2')
      const txt = hombre.querySelector('p')
      const btn = hombre.querySelector('a')
      const tl  = gsap.timeline({ scrollTrigger: { trigger: hombre, start: 'top 75%' } })
      if (h2)  tl.from(h2,  { x: 60, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
      if (txt) tl.from(txt, { x: 40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      if (btn) tl.from(btn, { x: 30, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    }

    // NIÑOS section
    const ninos = document.getElementById('ninos')
    if (ninos) {
      const h2  = ninos.querySelector('h2')
      const txt = ninos.querySelector('p')
      const btn = ninos.querySelector('a')
      const tl  = gsap.timeline({ scrollTrigger: { trigger: ninos, start: 'top 75%' } })
      if (h2)  tl.from(h2,  { y: 50, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
      if (txt) tl.from(txt, { y: 30, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      if (btn) tl.from(btn, { scale: 0.9, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.3')
    }

    // Parallax on decorative radial divs inside sections
    document.querySelectorAll('#mujer .absolute, #hombre .absolute').forEach(el => {
      gsap.to(el, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section'), scrub: true },
      })
    })
  }
}
