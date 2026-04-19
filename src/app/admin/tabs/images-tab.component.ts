import { Component, OnInit, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-images-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './images-tab.component.html',
})
export class ImagesTabComponent implements OnInit {
  protected svc = inject(AdminService)

  items = signal<any[]>([])
  loading = signal(false)
  uploading = signal(false)
  apiError = signal('')
  uploadedPath = signal('')
  copiedKey = signal('')

  async ngOnInit() { await this.load() }

  async load() {
    this.loading.set(true)
    this.apiError.set('')
    try {
      const res = await fetch('/api/admin/upload', { headers: { 'x-admin-key': this.svc.adminKey() } })
      const data = await res.json()
      if (!res.ok) { this.apiError.set((data as any).error ?? `Error ${res.status}`); return }
      this.items.set(data)
    } catch { this.apiError.set('Error de red') } finally { this.loading.set(false) }
  }

  async upload(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    this.uploading.set(true)
    this.uploadedPath.set('')
    const fd = new FormData()
    fd.append('file', input.files[0])
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'x-admin-key': this.svc.adminKey() }, body: fd })
      const { path } = await res.json()
      this.uploadedPath.set(path)
      await this.load()
    } finally { this.uploading.set(false); input.value = '' }
  }

  async deleteImage(key: string) {
    if (!confirm('¿Eliminar esta imagen?')) return
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'x-admin-key': this.svc.adminKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })
    await this.load()
  }

  async copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    this.copiedKey.set(key)
    setTimeout(() => this.copiedKey.set(''), 1500)
  }

  formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  trackByKey(_: number, item: any) { return item.key }
}
