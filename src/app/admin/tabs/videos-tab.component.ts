import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminService } from '../admin.service'

const PAGE_SIZE = 18

@Component({
  selector: 'app-videos-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videos-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosTabComponent implements OnInit {
  protected svc = inject(AdminService)

  items = signal<any[]>([])
  loading = signal(false)
  loadingMore = signal(false)
  uploading = signal(false)
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
      this.items.update(prev => [...prev, ...this.mapItems(data.items)])
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
    const res = await fetch(`/api/admin/videos?${params}`, { headers: { 'x-admin-key': this.svc.adminKey() } })
    const data = await res.json()
    if (!res.ok) throw new Error((data as any).error ?? `Error ${res.status}`)
    return data as { items: any[]; nextCursor: string | null; hasMore: boolean }
  }

  async upload(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    const file = input.files[0]
    this.uploading.set(true)
    this.uploadedPath.set('')
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'x-admin-key': this.svc.adminKey(),
          'content-type': file.type || 'video/mp4',
          'x-filename': encodeURIComponent(file.name),
        },
        body: file,
      })
      const data = await res.json() as any
      if (!res.ok) { this.apiError.set(data.error ?? 'Error al subir'); return }
      this.uploadedPath.set(data.path)
      await this.load()
    } finally { this.uploading.set(false); input.value = '' }
  }

  async deleteVideo(key: string) {
    if (!confirm('¿Eliminar este video?')) return
    await fetch('/api/admin/videos', {
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

  async downloadVideo(url: string, filename = 'video') {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const ext = blob.type.split('/')[1] ?? 'mp4'
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
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
    return (bytes / 1073741824).toFixed(1) + ' GB'
  }
}
