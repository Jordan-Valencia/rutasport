import { Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  protected readonly mobileMenuOpen = signal(false)

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value)
  }
}
