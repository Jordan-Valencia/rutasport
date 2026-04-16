import { Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { teams } from '../../data/mock-data'

@Component({
  selector: 'app-find-your-team',
  imports: [CommonModule],
  templateUrl: './find-your-team.component.html',
  styleUrls: ['./find-your-team.component.css'],
})
export class FindYourTeamComponent {
  protected readonly teams = teams
  protected readonly activeTeamTab = signal('Selecciones')

  setActiveTeamTab(tab: string): void {
    this.activeTeamTab.set(tab)
  }
}
