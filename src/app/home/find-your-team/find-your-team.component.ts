import { Component, inject, signal, computed, ElementRef, viewChild, afterNextRender, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { DataService } from '../../services/data.service'
import { Team } from '../../models/team'

@Component({
  selector: 'app-find-your-team',
  imports: [CommonModule],
  templateUrl: './find-your-team.component.html',
  styleUrls: ['./find-your-team.component.css'],
})
export class FindYourTeamComponent {
  private dataService = inject(DataService)
  private platformId = inject(PLATFORM_ID)
  protected allTeams = signal<Team[]>([])
  protected activeTeamTab = signal('Selecciones')
  private sectionRef = viewChild<ElementRef>('findYourTeamSection')

  protected filteredTeams = computed(() =>
    this.allTeams().filter(t => t.type === this.activeTeamTab())
  )

  protected loading = signal(true)

  constructor() {
    this.dataService.getTeams().subscribe(data => {
      this.allTeams.set(data)
      this.loading.set(false)
    })
    afterNextRender(() => this.animateSection())
  }

  setActiveTeamTab(tab: string): void {
    this.activeTeamTab.set(tab)
    this.animateTeams()
  }

  private async animateSection() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    const section = this.sectionRef()?.nativeElement
    if (!section) return

    gsap.from(section.querySelector('h2'), {
      scrollTrigger: { trigger: section, start: 'top 82%' },
      y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out'
    })
    gsap.from(section.querySelectorAll('.tab-btn'), {
      scrollTrigger: { trigger: section, start: 'top 78%' },
      y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out'
    })
    this.animateTeams()
  }

  private async animateTeams() {
    if (!isPlatformBrowser(this.platformId)) return
    const { gsap } = await import('gsap')
    const section = this.sectionRef()?.nativeElement
    if (!section) return
    const cards = section.querySelectorAll('.team-card')
    gsap.from(cards, { scale: 0.85, autoAlpha: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.4)', clearProps: 'all' })
  }
}
