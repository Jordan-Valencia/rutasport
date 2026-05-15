import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminService } from '../admin.service'
import { VirtualImgDirective } from './virtual-img.directive'

const PAGE_SIZE = 24
const MAX_RENDERED_ITEMS = 120

@Component({
  selector: 'app-images-tab',
  standalone: true,
  imports: [CommonModule, VirtualImgDirective],
  templateUrl: './images-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesTabComponent implements OnInit {
  protected svc = inject(AdminService)

  items = signal<any[]>([])
  loading = signal(false)
  loadingMore = signal(false)
  uploading = signal(false)
  uploadProgress = signal<{ current: number; total: number } | null>(null)
  apiError = signal('')
  uploadedPath = signal('')
  copiedKey = signal('')
  hasMore = signal(false)
  nextCursor = signal<string | null>(null)

  async ngOnInit() { await this.load() }

  async load() {
    this.loading.set(true)
    this.apiError.set('')
    this.items.set([])
    this.nextCursor.set(null)
    this.hasMore.set(false)
    try {
      const data = await this.fetchPage(null)
      this.items.set(this.mapItems(data.items))
      this.nextCursor.set(data.nextCursor)
      this.hasMore.set(data.hasMore)
    } catch { this.apiError.set('Error de red') } finally { this.loading.set(false) }
  }

  async loadMore() {
    const cursor = this.nextCursor()
    if (!cursor || this.loadingMore()) return
    this.loadingMore.set(true)
    try {
      const data = await this.fetchPage(cursor)
      this.items.update(prev => {
        const merged = [...prev, ...this.mapItems(data.items)]
        return merged.length > MAX_RENDERED_ITEMS ? merged.slice(merged.length - MAX_RENDERED_ITEMS) : merged
      })
      this.nextCursor.set(data.nextCursor)
      this.hasMore.set(data.hasMore)
    } catch { this.apiError.set('Error de red') } finally { this.loadingMore.set(false) }
  }

  private mapItems(items: any[]): any[] {
    return items.map(item => ({
      ...item,
      filename: item.key.split('/').pop() ?? item.key,
      formattedSize: this.formatBytes(item.size),
    }))
  }

  private async fetchPage(cursor: string | null) {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE) })
    if (cursor) params.set('cursor', cursor)
    const res = await fetch(`/api/admin/upload?${params}`, { headers: { 'x-admin-key': this.svc.adminKey() } })
    const data = await res.json()
    if (!res.ok) throw new Error((data as any).error ?? `Error ${res.status}`)
    return data as { items: any[]; nextCursor: string | null; hasMore: boolean }
  }

  async upload(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    const files = Array.from(input.files)
    this.uploading.set(true)
    this.uploadedPath.set('')
    this.uploadProgress.set({ current: 0, total: files.length })
    let lastPath = ''
    try {
      for (let i = 0; i < files.length; i++) {
        this.uploadProgress.set({ current: i + 1, total: files.length })
        const fd = new FormData()
        fd.append('file', files[i])
        const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'x-admin-key': this.svc.adminKey() }, body: fd })
        const { path } = await res.json()
        lastPath = path
      }
      this.uploadedPath.set(files.length === 1 ? lastPath : `${files.length} imágenes subidas`)
      await this.load()
    } finally {
      this.uploading.set(false)
      this.uploadProgress.set(null)
      input.value = ''
    }
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

  async downloadImage(url: string, filename = 'image') {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
      const name = filename.includes('.') ? filename : `${filename}.${ext}`
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(url, '_blank')
    }
  }

  formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

}
