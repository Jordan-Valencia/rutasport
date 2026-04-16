import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { products } from '../../data/mock-data'

@Component({
  selector: 'app-new-releases',
  imports: [CommonModule, RouterModule],
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.css'],
})
export class NewReleasesComponent {
  protected readonly products = [...products, ...products]
}
