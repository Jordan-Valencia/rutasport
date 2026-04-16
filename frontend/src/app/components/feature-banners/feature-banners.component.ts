import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { featureBanners } from '../../data/mock-data'

@Component({
  selector: 'app-feature-banners',
  imports: [CommonModule],
  templateUrl: './feature-banners.component.html',
  styleUrls: ['./feature-banners.component.css'],
})
export class FeatureBannersComponent {
  protected readonly banners = featureBanners
}
