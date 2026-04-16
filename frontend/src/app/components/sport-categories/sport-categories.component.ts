import { Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { products, sports } from '../../data/mock-data'

@Component({
  selector: 'app-sport-categories',
  imports: [CommonModule],
  templateUrl: './sport-categories.component.html',
  styleUrls: ['./sport-categories.component.css'],
})
export class SportCategoriesComponent {
  protected readonly sports = sports
  protected readonly products = products
  protected readonly activeSport = signal('Fútbol')

  setActiveSport(sport: string): void {
    this.activeSport.set(sport)
  }
}
