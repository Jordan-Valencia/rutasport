import { Component, OnInit, signal, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminService } from '../admin.service'
import { formatCOP } from '../../shared/cop.pipe'

interface DailyRow  { day: string; views: number; sessions: number }
interface PageRow    { path: string; views: number }
interface Totals     { total: number; today: number; week: number; unique_sessions: number }
interface OrderStats { total: number; approved: number; pending: number; declined: number; cancelled: number; revenue_cop: number }

interface Analytics {
  daily: DailyRow[]
  topPages: PageRow[]
  totals: Totals
  orderStats: OrderStats
}

@Component({
  selector: 'app-analytics-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-tab.component.html',
})
export class AnalyticsTabComponent implements OnInit {
  protected svc = inject(AdminService)

  data = signal<Analytics | null>(null)
  loading = signal(false)
  apiError = signal('')

  readonly maxViews = computed(() => {
    const d = this.data()?.daily ?? []
    return d.length ? Math.max(...d.map(r => r.views), 1) : 1
  })

  readonly maxPageViews = computed(() => {
    const p = this.data()?.topPages ?? []
    return p.length ? Math.max(...p.map(r => r.views), 1) : 1
  })

  async ngOnInit() { await this.load() }

  async load() {
    this.loading.set(true)
    this.apiError.set('')
    try {
      const res  = await this.svc.apiFetch('/api/admin/analytics')
      const json = await res.json()
      if (!res.ok) { this.apiError.set(json.error ?? `Error ${res.status}`); return }
      this.data.set(json)
    } catch { this.apiError.set('Error de red') }
    finally  { this.loading.set(false) }
  }

  barPct(views: number): number {
    return Math.round((views / this.maxViews()) * 100)
  }

  pagePct(views: number): number {
    return Math.round((views / this.maxPageViews()) * 100)
  }

  formatDay(day: string): string {
    const d = new Date(day + 'T00:00:00')
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
  }

  formatRevenue(cop: number): string {
    return formatCOP(cop)
  }
}
