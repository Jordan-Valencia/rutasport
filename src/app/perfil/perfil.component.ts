import { Component, signal, inject, OnInit, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { CopPipe, formatCOP } from '../shared/cop.pipe'

type Tab = 'info' | 'seguridad' | 'pedidos'

interface OrderItem {
  id: number; product_id: number; name: string
  brand: string | null; model: string | null; size: string | null
  price: number; quantity: number
}

interface Order {
  id: number; reference: string; status: string
  shipping_status: string; tracking_number: string | null
  shipping_notes: string | null; total_in_cents: number; createdAt: string
  updatedAt?: string; cancelled_at?: string | null; cancel_reason?: string | null
  items: OrderItem[]
  expanded?: boolean
}

const SHIPPING_LABEL: Record<string, string> = {
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
}
const PAYMENT_LABEL: Record<string, string> = {
  PENDING: 'Pendiente', RESERVED: 'Reservado', APPROVED: 'Aprobado',
  DECLINED: 'Rechazado', VOIDED: 'Anulado', ERROR: 'Error', CANCELLED: 'Cancelado',
}

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule, RouterModule, CopPipe],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  readonly auth = inject(AuthService)
  private readonly router = inject(Router)
  private readonly http = inject(HttpClient)

  readonly orders = signal<Order[]>([])
  readonly ordersLoading = signal(false)
  readonly ordersError = signal('')
  readonly cancellingId = signal<number | null>(null)
  readonly cancelMsg = signal<string | null>(null)

  readonly shippingLabel = SHIPPING_LABEL
  readonly paymentLabel  = PAYMENT_LABEL

  readonly activeTab = signal<Tab>('info')

  full_name = ''
  email = ''
  phone = ''
  region = ''
  city = ''
  address = ''
  readonly savingInfo = signal(false)
  readonly infoSuccess = signal(false)
  readonly infoError = signal('')
  readonly infoShaking = signal(false)

  current_password = ''
  new_password = ''
  confirm_password = ''
  readonly savingPassword = signal(false)
  readonly passwordError = signal('')
  readonly passwordShaking = signal(false)
  readonly showCurrent = signal(false)
  readonly showNew = signal(false)

  readonly userInitials = computed(() => {
    const u = this.auth.user()
    if (!u) return '?'
    if (u.full_name) return u.full_name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
    return u.email[0].toUpperCase()
  })

  readonly memberSince = computed(() => {
    const d = this.auth.user()?.createdAt
    if (!d) return ''
    return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
  })

  ngOnInit(): void {
    const u = this.auth.user()
    if (u) {
      this.full_name = u.full_name ?? ''
      this.email     = u.email
      this.phone     = u.phone ?? ''
      this.region    = u.region ?? ''
      this.city      = u.city ?? ''
      this.address   = u.address ?? ''
    }
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab)
    this.infoSuccess.set(false)
    this.infoError.set('')
    this.passwordError.set('')
    if (tab === 'pedidos' && !this.orders().length) this.loadOrders()
  }

  async loadOrders(): Promise<void> {
    this.ordersLoading.set(true)
    this.ordersError.set('')
    try {
      const token = this.auth.token
      const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined
      const res = await firstValueFrom(
        this.http.get<Order[]>('/api/auth/orders', { headers })
      )
      this.orders.set(res ?? [])
    } catch {
      this.ordersError.set('No se pudieron cargar los pedidos')
    } finally {
      this.ordersLoading.set(false)
    }
  }

  toggleOrder(order: Order): void {
    order.expanded = !order.expanded
    this.orders.update(list => [...list])
  }

  canCancel(status: string): boolean {
    return status === 'PENDING' || status === 'RESERVED'
  }

  async cancelOrder(order: Order): Promise<void> {
    if (!confirm('¿Estás seguro de cancelar este pedido?')) return
    this.cancellingId.set(order.id)
    this.cancelMsg.set(null)
    try {
      const token = this.auth.token
      const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined
      await firstValueFrom(
        this.http.post(`/api/auth/orders/${order.id}`, {}, { headers })
      )
      this.orders.update(list => list.map(o =>
        o.id === order.id
          ? { ...o, status: 'CANCELLED', cancelled_at: new Date().toISOString(), cancel_reason: 'Cancelado por el usuario' }
          : o
      ))
      this.cancelMsg.set('Pedido cancelado correctamente')
      setTimeout(() => this.cancelMsg.set(null), 4000)
    } catch {
      this.cancelMsg.set('No se pudo cancelar el pedido')
    } finally {
      this.cancellingId.set(null)
    }
  }

  /** Build timeline steps based on order status */
  timelineSteps(order: Order): { label: string; done: boolean; active: boolean }[] {
    const paid = order.status === 'APPROVED'
    const cancelled = order.status === 'CANCELLED'
    const steps = [
      { label: 'Pedido creado', done: true, active: false },
      { label: 'Pago recibido', done: paid, active: !paid && !cancelled },
    ]
    if (!cancelled) {
      steps.push(
        { label: 'En preparación', done: order.shipping_status === 'SHIPPED' || order.shipping_status === 'DELIVERED', active: paid && order.shipping_status === 'PROCESSING' },
        { label: 'Enviado', done: order.shipping_status === 'DELIVERED', active: order.shipping_status === 'SHIPPED' },
        { label: 'Entregado', done: order.shipping_status === 'DELIVERED', active: false },
      )
    }
    return steps
  }

  formatCOP(cents: number): string {
    return formatCOP(cents / 100)
  }

  async saveInfo(): Promise<void> {
    this.infoError.set('')
    this.infoSuccess.set(false)
    this.savingInfo.set(true)
    try {
      await this.auth.updateProfile({
        full_name: this.full_name || undefined,
        email: this.email,
        phone: this.phone || undefined,
        region: this.region || undefined,
        city: this.city || undefined,
        address: this.address || undefined,
      })
      this.infoSuccess.set(true)
      setTimeout(() => this.infoSuccess.set(false), 4000)
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.error?.error : 'Error al guardar'
      this.triggerInfoShake(msg ?? 'Error al guardar')
    } finally {
      this.savingInfo.set(false)
    }
  }

  async savePassword(): Promise<void> {
    if (!this.current_password || !this.new_password) {
      this.triggerPasswordShake('Completa todos los campos')
      return
    }
    if (this.new_password !== this.confirm_password) {
      this.triggerPasswordShake('Las contraseñas no coinciden')
      return
    }
    if (this.new_password.length < 6) {
      this.triggerPasswordShake('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    this.passwordError.set('')
    this.savingPassword.set(true)
    try {
      await this.auth.changePassword(this.current_password, this.new_password)
      this.router.navigate(['/login'])
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.error?.error : 'Error al cambiar contraseña'
      this.triggerPasswordShake(msg ?? 'Error al cambiar contraseña')
    } finally {
      this.savingPassword.set(false)
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout()
    this.router.navigate(['/'])
  }

  private triggerInfoShake(msg: string): void {
    this.infoError.set(msg)
    this.infoShaking.set(false)
    requestAnimationFrame(() => this.infoShaking.set(true))
    setTimeout(() => this.infoShaking.set(false), 500)
  }

  private triggerPasswordShake(msg: string): void {
    this.passwordError.set(msg)
    this.passwordShaking.set(false)
    requestAnimationFrame(() => this.passwordShaking.set(true))
    setTimeout(() => this.passwordShaking.set(false), 500)
  }
}
