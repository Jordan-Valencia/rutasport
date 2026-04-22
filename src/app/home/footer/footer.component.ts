import { Component, signal } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  guiaTallasAbierta = signal(false)

  abrirGuiaTallas() {
    this.guiaTallasAbierta.set(true)
  }

  cerrarGuiaTallas() {
    this.guiaTallasAbierta.set(false)
  }
}
