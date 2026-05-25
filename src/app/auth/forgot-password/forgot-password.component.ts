import { Component, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  private readonly http = inject(HttpClient)

  email = ''
  readonly loading = signal(false)
  readonly sent = signal(false)
  readonly error = signal('')
  readonly shaking = signal(false)

  async submit(): Promise<void> {
    if (!this.email) {
      this.triggerShake('Ingresa tu correo electrónico')
      return
    }
    this.error.set('')
    this.loading.set(true)
    try {
      await firstValueFrom(
        this.http.post('/api/auth/forgot-password', { email: this.email })
      )
      this.sent.set(true)
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.error?.error : 'Error al enviar la solicitud'
      this.triggerShake(msg ?? 'Error al enviar la solicitud')
    } finally {
      this.loading.set(false)
    }
  }

  private triggerShake(msg: string): void {
    this.error.set(msg)
    this.shaking.set(false)
    requestAnimationFrame(() => this.shaking.set(true))
    setTimeout(() => this.shaking.set(false), 500)
  }
}
