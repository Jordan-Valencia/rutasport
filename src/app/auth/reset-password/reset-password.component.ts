import { Component, signal, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  private readonly http = inject(HttpClient)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  token = ''
  password = ''
  confirm_password = ''
  readonly loading = signal(false)
  readonly success = signal(false)
  readonly error = signal('')
  readonly shaking = signal(false)
  readonly showPassword = signal(false)
  readonly showConfirm = signal(false)

  ngOnInit(): void {
    const tokenParam = this.route.snapshot.paramMap.get('token')
    if (tokenParam) this.token = tokenParam
  }

  async submit(): Promise<void> {
    if (!this.password || this.password.length < 6) {
      this.triggerShake('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (this.password !== this.confirm_password) {
      this.triggerShake('Las contraseñas no coinciden')
      return
    }
    if (!this.token) {
      this.triggerShake('Token inválido')
      return
    }

    this.error.set('')
    this.loading.set(true)
    try {
      await firstValueFrom(
        this.http.post('/api/auth/reset-password', { token: this.token, password: this.password })
      )
      this.success.set(true)
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.error?.error : 'Error al restablecer la contraseña'
      this.triggerShake(msg ?? 'Error al restablecer la contraseña')
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
