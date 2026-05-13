import { Component, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)

  email = ''
  password = ''
  readonly loading = signal(false)
  readonly error = signal('')
  readonly shaking = signal(false)
  readonly showPassword = signal(false)

  async submit(): Promise<void> {
    if (!this.email || !this.password) {
      this.triggerShake('Completa todos los campos')
      return
    }
    this.error.set('')
    this.loading.set(true)
    try {
      await this.auth.login(this.email, this.password)
      this.router.navigate(['/'])
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.error?.error : 'Error al iniciar sesión'
      this.triggerShake(msg ?? 'Error al iniciar sesión')
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
