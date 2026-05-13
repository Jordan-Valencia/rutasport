import { Component, OnInit, signal, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AdminService } from '../admin.service'
import { CopPipe, formatCOP } from '../../shared/cop.pipe'

interface OrderItem {
  id: number; name: string; brand: string | null; model: string | null
  size: string | null; price: number; quantity: number
}

interface Order {
  id: number; reference: string; status: string; shipping_status: string
  tracking_number: string | null; shipping_notes: string | null
  total_in_cents: number; wompi_transaction_id: string | null; createdAt: string
  user_id: number | null; user_email: string | null; user_name: string | null
  user_phone: string | null; user_address: string | null
  items: OrderItem[]
  expanded?: boolean
}

const SHIPPING_OPTS = ['PROCESSING', 'SHIPPED', 'DELIVERED']
const SHIPPING_LABEL: Record<string, string> = {
  PROCESSING: 'Procesando', SHIPPED: 'Enviado', DELIVERED: 'Entregado',
}
const PAYMENT_LABEL: Record<string, string> = {
  PENDING: 'Pendiente', APPROVED: 'Aprobado', DECLINED: 'Rechazado',
  VOIDED: 'Anulado', ERROR: 'Error',
}

@Component({
  selector: 'app-orders-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, CopPipe],
  templateUrl: './orders-tab.component.html',
})
export class OrdersTabComponent implements OnInit {
  protected svc = inject(AdminService)

  items = signal<Order[]>([])
  loading = signal(false)
  apiError = signal('')
  searchQuery = signal('')
  filterStatus = signal('ALL')

  editingId = signal<number | null>(null)
  editShipping = ''
  editTracking = ''
  editNotes = ''
  saving = signal(false)

  readonly shippingOpts  = SHIPPING_OPTS
  readonly shippingLabel = SHIPPING_LABEL
  readonly paymentLabel  = PAYMENT_LABEL

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim()
    const s = this.filterStatus()
    return this.items().filter(o => {
      const matchStatus = s === 'ALL' || o.status === s
      const matchSearch = !q ||
        o.reference.toLowerCase().includes(q) ||
        (o.user_email ?? '').toLowerCase().includes(q) ||
        (o.user_name  ?? '').toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  })

  readonly approvedCount = computed(() => this.items().filter(o => o.status === 'APPROVED').length)
  readonly pendingCount  = computed(() => this.items().filter(o => o.status === 'PENDING').length)
  readonly totalRevenue  = computed(() =>
    this.items()
      .filter(o => o.status === 'APPROVED')
      .reduce((acc, o) => acc + o.total_in_cents, 0)
  )

  async ngOnInit() { await this.load() }

  async load() {
    this.loading.set(true)
    this.apiError.set('')
    try {
      const res  = await this.svc.apiFetch('/api/admin/orders')
      const data = await res.json()
      if (!res.ok) { this.apiError.set(data.error ?? `Error ${res.status}`); return }
      this.items.set(data)
    } catch { this.apiError.set('Error de red') }
    finally  { this.loading.set(false) }
  }

  toggleRow(order: Order) {
    order.expanded = !order.expanded
    this.items.update(l => [...l])
  }

  startEdit(order: Order) {
    this.editingId.set(order.id)
    this.editShipping = order.shipping_status
    this.editTracking = order.tracking_number ?? ''
    this.editNotes    = order.shipping_notes  ?? ''
  }

  cancelEdit() { this.editingId.set(null) }

  async saveEdit(order: Order) {
    this.saving.set(true)
    try {
      const res = await this.svc.apiFetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_status: this.editShipping,
          tracking_number: this.editTracking || null,
          shipping_notes:  this.editNotes    || null,
        }),
      })
      if (res.ok) {
        this.items.update(list => list.map(o =>
          o.id === order.id
            ? { ...o, shipping_status: this.editShipping, tracking_number: this.editTracking || null, shipping_notes: this.editNotes || null }
            : o
        ))
        this.editingId.set(null)
      }
    } finally { this.saving.set(false) }
  }

  formatCOP(cents: number): string {
    return formatCOP(cents / 100)
  }
}
