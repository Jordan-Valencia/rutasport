import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-brands-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brands-tab.component.html',
})
export class BrandsTabComponent implements OnInit {
  private platformId = inject(PLATFORM_ID)
  protected svc = inject(AdminService)

  items = signal<any[]>([])
  loading = signal(false)
  saving = signal(false)
  imageUploading = signal(false)
  apiError = signal('')

  showModal = signal(false)
  modalMode = signal<'add' | 'edit'>('add')
  formData: any = {}
  formErrors: Record<string, string> = {}

  async ngOnInit() { await this.load() }

  async load() {
    this.loading.set(true)
    this.apiError.set('')
    try {
      const res = await this.svc.apiFetch('/api/admin/brands')
      const data = await res.json()
      if (!res.ok) { this.apiError.set(data.error ?? `Error ${res.status}`); return }
      this.items.set(data)
      this.svc.brands.set(data)
    } catch { this.apiError.set('Error de red') } finally { this.loading.set(false) }
  }

  openAdd() {
    this.modalMode.set('add')
    this.formData = { name: '', logo: '', order: 0, isActive: true }
    this.formErrors = {}
    this.showModal.set(true)
    this.animateModal()
  }

  openEdit(item: any) {
    this.modalMode.set('edit')
    this.formData = { ...item }
    this.formErrors = {}
    this.showModal.set(true)
    this.animateModal()
  }

  private async animateModal() {
    if (!isPlatformBrowser(this.platformId)) return
    await new Promise(r => setTimeout(r, 20))
    const { gsap } = await import('gsap')
    gsap.from('.rs-modal-card', { scale: 0.93, autoAlpha: 0, y: 20, duration: 0.28, ease: 'back.out(1.8)' })
  }

  closeModal() { this.showModal.set(false) }

  async uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    this.imageUploading.set(true)
    const fd = new FormData()
    fd.append('file', input.files[0])
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'x-admin-key': this.svc.adminKey() }, body: fd })
      if (res.ok) { const { path } = await res.json(); this.formData = { ...this.formData, logo: path } }
    } finally { this.imageUploading.set(false); input.value = '' }
  }

  async save() {
    const e: Record<string, string> = {}
    if (!this.formData.name?.trim()) e['name'] = 'El nombre es requerido'
    this.formErrors = e
    if (Object.keys(e).length > 0) return
    this.saving.set(true)
    this.apiError.set('')
    const { id, createdAt, ...data } = this.formData
    const mode = this.modalMode()
    try {
      const res = mode === 'add'
        ? await this.svc.apiFetch('/api/admin/brands',       { method: 'POST', body: JSON.stringify(data) })
        : await this.svc.apiFetch(`/api/admin/brands/${id}`, { method: 'PUT',  body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json().catch(() => ({})) as any; this.apiError.set(err.error ?? `Error ${res.status}`); return }
      this.showModal.set(false)
      await this.load()
    } catch { this.apiError.set('Error de red') } finally { this.saving.set(false) }
  }

  async deleteItem(id: number) {
    if (!confirm('¿Eliminar esta marca?')) return
    this.apiError.set('')
    try {
      const res = await this.svc.apiFetch(`/api/admin/brands/${id}`, { method: 'DELETE' })
      if (!res.ok) { const err = await res.json().catch(() => ({})) as any; this.apiError.set(err.error ?? `Error ${res.status}`); return }
    } catch { this.apiError.set('Error de red'); return }
    await this.load()
  }

  trackById(_: number, item: any) { return item.id }
}
