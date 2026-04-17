import { Component } from '@angular/core'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { HeroComponent } from './components/hero/hero.component'
import { FindYourTeamComponent } from './components/find-your-team/find-your-team.component'
import { SportCategoriesComponent } from './components/sport-categories/sport-categories.component'
import { FeatureBannersComponent } from './components/feature-banners/feature-banners.component'
import { BestSellersComponent } from './components/best-sellers/best-sellers.component'
import { NewReleasesComponent } from './components/new-releases/new-releases.component'
import { CtaMembershipComponent } from './components/cta-membership/cta-membership.component'

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    FindYourTeamComponent,
    SportCategoriesComponent,
    FeatureBannersComponent,
    BestSellersComponent,
    NewReleasesComponent,
    CtaMembershipComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
