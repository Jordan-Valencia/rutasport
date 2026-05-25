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
  total_in_cents: number; epayco_refpayco: string | null; createdAt: string
  updatedAt?: string; cancelled_at?: string | null; cancel_reason?: string | null
  user_id: number | null; user_email: string | null; user_name: string | null
  user_phone: string | null; user_region: string | null; user_city: string | null
  user_address: string | null
  items: OrderItem[]
  expanded?: boolean
}

interface OrdersResponse {
  items: Order[]
  total: number
  page: number
  limit: number
}

const SHIPPING_OPTS = ['PROCESSING', 'SHIPPED', 'DELIVERED']
const SHIPPING_LABEL: Record<string, string> = {
  PROCESSING: 'Procesando', SHIPPED: 'Enviado', DELIVERED: 'Entregado',
}
const PAYMENT_LABEL: Record<string, string> = {
  PENDING: 'Pendiente', RESERVED: 'Reservado', APPROVED: 'Aprobado', DECLINED: 'Rechazado',
  VOIDED: 'Anulado', ERROR: 'Error', CANCELLED: 'Cancelado',
}
const PAYMENT_OPTS = ['RESERVED', 'APPROVED', 'DECLINED', 'PENDING', 'CANCELLED']

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
  sortField = signal('createdAt')
  sortOrder = signal<'asc'|'desc'>('desc')
  dateFrom = signal('')
  dateTo = signal('')

  // Pagination
  currentPage = signal(1)
  totalOrders = signal(0)
  pageSize = signal(50)

  editingId = signal<number | null>(null)
  editShipping = ''
  editTracking = ''
  editNotes = ''
  editPaymentStatus = ''
  saving = signal(false)
  cancelId = signal<number | null>(null)

  readonly shippingOpts  = SHIPPING_OPTS
  readonly shippingLabel = SHIPPING_LABEL
  readonly paymentLabel  = PAYMENT_LABEL
  readonly paymentOpts   = PAYMENT_OPTS

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalOrders() / this.pageSize())))

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
  readonly pendingCount  = computed(() => this.items().filter(o => o.status === 'PENDING' || o.status === 'RESERVED').length)
  readonly cancelledCount = computed(() => this.items().filter(o => o.status === 'CANCELLED').length)
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
      const params = new URLSearchParams({
        page: String(this.currentPage()),
        limit: String(this.pageSize()),
        sort: this.sortField(),
        order: this.sortOrder(),
      })
      if (this.searchQuery().trim()) params.set('search', this.searchQuery().trim())
      if (this.dateFrom()) params.set('dateFrom', this.dateFrom())
      if (this.dateTo()) params.set('dateTo', this.dateTo())

      const res  = await this.svc.apiFetch(`/api/admin/orders?${params}`)
      const data: OrdersResponse = await res.json()
      if (!res.ok) { this.apiError.set((data as any).error ?? `Error ${res.status}`); return }
      this.items.set(data.items)
      this.totalOrders.set(data.total)
    } catch { this.apiError.set('Error de red') }
    finally  { this.loading.set(false) }
  }

  doSearch() {
    this.currentPage.set(1)
    this.load()
  }

  onSearchEnter() {
    this.doSearch()
  }

  setPage(page: number) {
    this.currentPage.set(Math.max(1, Math.min(page, this.totalPages())))
    this.load()
  }

  setSort(field: string) {
    if (this.sortField() === field) {
      this.sortOrder.update(o => o === 'desc' ? 'asc' : 'desc')
    } else {
      this.sortField.set(field)
      this.sortOrder.set('desc')
    }
    this.load()
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
    this.editPaymentStatus = order.status
  }

  cancelEdit() { this.editingId.set(null) }

  async saveEdit(order: Order) {
    this.saving.set(true)
    try {
      const body: Record<string, unknown> = {
        shipping_status: this.editShipping,
        tracking_number: this.editTracking || null,
        shipping_notes:  this.editNotes    || null,
      }
      if (this.editPaymentStatus !== order.status) {
        body['status'] = this.editPaymentStatus
      }
      const res = await this.svc.apiFetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        this.items.update(list => list.map(o =>
          o.id === order.id
            ? { ...o, shipping_status: this.editShipping, tracking_number: this.editTracking || null, shipping_notes: this.editNotes || null, status: this.editPaymentStatus }
            : o
        ))
        this.editingId.set(null)
      }
    } finally { this.saving.set(false) }
  }

  async cancelOrder(order: Order) {
    if (!confirm(`¿Cancelar la orden ${order.reference}?`)) return
    this.cancelId.set(order.id)
    try {
      await this.svc.apiFetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED', cancel_reason: 'Cancelado por administrador' }),
      })
      this.items.update(list => list.map(o =>
        o.id === order.id ? { ...o, status: 'CANCELLED', cancelled_at: new Date().toISOString(), cancel_reason: 'Cancelado por administrador' } : o
      ))
    } finally { this.cancelId.set(null) }
  }

  exportCSV() {
    const rows = this.filtered()
    if (!rows.length) return
    const header = ['Referencia','Fecha','Estado','Envío','Cliente','Email','Teléfono','Ciudad','Total','Guía','Productos']
    const csv = [
      header.join(','),
      ...rows.map(o => [
        o.reference,
        o.createdAt,
        this.paymentLabel[o.status] || o.status,
        this.shippingLabel[o.shipping_status] || o.shipping_status,
        `"${o.user_name || ''}"`,
        o.user_email || '',
        o.user_phone || '',
        `${o.user_city || ''} ${o.user_region || ''}`.trim(),
        formatCOP(o.total_in_cents / 100),
        o.tracking_number || '',
        `"${o.items.map(i => i.name).join('; ')}"`,
      ].join(',')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `ordenes_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  getPageRange(): number[] {
    const total = this.totalPages()
    const curr = this.currentPage()
    const range: number[] = []
    const start = Math.max(1, curr - 2)
    const end = Math.min(total, curr + 2)
    for (let i = start; i <= end; i++) range.push(i)
    return range
  }

  formatCOP(cents: number): string {
    return formatCOP(cents / 100)
  }
}
