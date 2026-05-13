import { Component, OnInit, signal, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AdminService } from '../admin.service'

interface AdminUser {
  id: number; email: string; full_name: string | null
  phone: string | null; address: string | null
  createdAt: string; order_count: number
}

@Component({
  selector: 'app-users-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-tab.component.html',
})
export class UsersTabComponent implements OnInit {
  protected svc = inject(AdminService)

  items = signal<AdminUser[]>([])
  loading = signal(false)
  apiError = signal('')
  searchQuery = signal('')
  saving = signal(false)
  saveError = signal('')
  saveSuccess = signal(false)

  editingUser = signal<AdminUser | null>(null)
  editName    = ''
  editEmail   = ''
  editPhone   = ''
  editAddress = ''

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim()
    if (!q) return this.items()
    return this.items().filter(u =>
      u.email.toLowerCase().includes(q) ||
      (u.full_name ?? '').toLowerCase().includes(q) ||
      (u.phone ?? '').toLowerCase().includes(q)
    )
  })

  async ngOnInit() { await this.load() }

  async load() {
    this.loading.set(true)
    this.apiError.set('')
    try {
      const res  = await this.svc.apiFetch('/api/admin/users')
      const data = await res.json()
      if (!res.ok) { this.apiError.set(data.error ?? `Error ${res.status}`); return }
      this.items.set(data)
    } catch { this.apiError.set('Error de red') }
    finally  { this.loading.set(false) }
  }

  openEdit(user: AdminUser) {
    this.editingUser.set(user)
    this.editName    = user.full_name ?? ''
    this.editEmail   = user.email
    this.editPhone   = user.phone    ?? ''
    this.editAddress = user.address  ?? ''
    this.saveError.set('')
    this.saveSuccess.set(false)
  }

  closeEdit() { this.editingUser.set(null) }

  async saveEdit() {
    const user = this.editingUser()
    if (!user) return
    this.saving.set(true)
    this.saveError.set('')
    try {
      const res = await this.svc.apiFetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: this.editName    || null,
          email:     this.editEmail,
          phone:     this.editPhone   || null,
          address:   this.editAddress || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { this.saveError.set(data.error ?? 'Error al guardar'); return }
      this.items.update(list => list.map(u =>
        u.id === user.id
          ? { ...u, full_name: this.editName || null, email: this.editEmail, phone: this.editPhone || null, address: this.editAddress || null }
          : u
      ))
      this.saveSuccess.set(true)
      setTimeout(() => this.closeEdit(), 1200)
    } catch { this.saveError.set('Error de red') }
    finally { this.saving.set(false) }
  }
}
