import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AdminService } from '../admin.service'

@Component({
  selector: 'app-products-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-tab.component.html',
})
export class ProductsTabComponent implements OnInit {
  private platformId = inject(PLATFORM_ID)
  protected svc = inject(AdminService)

  readonly SIZES = ['4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5','13']

  items = signal<any[]>([])
  loading = signal(false)
  saving = signal(false)
  imageUploading = signal(false)
  apiError = signal('')

  urlMainInput = ''
  urlExtraInput = ''

  showModal = signal(false)
  modalMode = signal<'add' | 'edit'>('add')

  formData: any = {}
  formErrors: Record<string, string> = {}

  sizesArray: string[] = []
  categoryIdsArray: number[] = []
  sportIdsArray: number[] = []
  imagesArray: string[] = []

  async ngOnInit() {
    await this.load()
  }

  async load() {
    this.loading.set(true)
    this.apiError.set('')

    try {
      const res = await this.svc.apiFetch('/api/admin/products')
      const data = await res.json()

      if (!res.ok) {
        this.apiError.set(data.error ?? `Error ${res.status}`)
        return
      }

      this.items.set(data)
    } catch {
      this.apiError.set('Error de red al cargar productos')
    } finally {
      this.loading.set(false)
    }
  }

  async importMainImageFromUrl() {
    const url = this.urlMainInput.trim()
    if (!url) return

    this.imageUploading.set(true)
    this.apiError.set('')

    try {
      const res = await fetch('/api/admin/upload-url', {
        method: 'POST',
        headers: {
          'x-admin-key': this.svc.adminKey(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url }),
      })

      if (res.ok) {
        const { path } = await res.json()
        this.formData = { ...this.formData, image: path }
        this.urlMainInput = ''
      } else {
        const err = await res.json().catch(() => ({})) as any
        this.apiError.set(err.error ?? `Error ${res.status}`)
      }
    } catch {
      this.apiError.set('Error de red al importar imagen')
    } finally {
      this.imageUploading.set(false)
    }
  }

  async importExtraImageFromUrl() {
    const url = this.urlExtraInput.trim()
    if (!url) return

    this.imageUploading.set(true)
    this.apiError.set('')

    try {
      const res = await fetch('/api/admin/upload-url', {
        method: 'POST',
        headers: {
          'x-admin-key': this.svc.adminKey(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url }),
      })

      if (res.ok) {
        const { path } = await res.json()
        this.imagesArray = [...this.imagesArray, path]
        this.urlExtraInput = ''
      } else {
        const err = await res.json().catch(() => ({})) as any
        this.apiError.set(err.error ?? `Error ${res.status}`)
      }
    } catch {
      this.apiError.set('Error de red al importar imagen')
    } finally {
      this.imageUploading.set(false)
    }
  }

  openAdd() {
    this.modalMode.set('add')

    this.formData = {
      name: '',
      model: '',
      price: '',
      image: '',
      brand_id: null,
      gender_id: null,
      isBestSeller: false,
      isNew: false,
      description: '',
    }

    this.sizesArray = []
    this.categoryIdsArray = []
    this.sportIdsArray = []
    this.imagesArray = []

    this.formErrors = {}
    this.apiError.set('')
    this.urlMainInput = ''
    this.urlExtraInput = ''

    this.showModal.set(true)
    this.animateModal()
  }

  openEdit(item: any) {
    this.modalMode.set('edit')
    this.formData = { ...item }

    this.sizesArray = item.sizes
      ? item.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []

    this.categoryIdsArray = item.category_ids
      ? item.category_ids
          .split(',')
          .map((id: string) => Number(id))
          .filter((id: number) => !Number.isNaN(id))
      : []

    this.sportIdsArray = item.sport_ids
      ? item.sport_ids
          .split(',')
          .map((id: string) => Number(id))
          .filter((id: number) => !Number.isNaN(id))
      : []

    this.imagesArray = item.gallery
      ? item.gallery.split(',').map((url: string) => url.trim()).filter(Boolean)
      : []

    this.formErrors = {}
    this.apiError.set('')
    this.urlMainInput = ''
    this.urlExtraInput = ''

    this.showModal.set(true)
    this.animateModal()
  }

  private async animateModal() {
    if (!isPlatformBrowser(this.platformId)) return

    await new Promise(r => setTimeout(r, 20))
    const { gsap } = await import('gsap')

    gsap.from('.rs-modal-card', {
      scale: 0.93,
      opacity: 0,
      y: 20,
      duration: 0.28,
      ease: 'back.out(1.8)'
    })
  }

  closeModal() {
    this.showModal.set(false)
  }

  toggleSize(s: string) {
    if (this.sizesArray.includes(s)) {
      this.sizesArray = this.sizesArray.filter(x => x !== s)
    } else {
      this.sizesArray = [...this.sizesArray, s].sort((a, b) => parseFloat(a) - parseFloat(b))
    }
  }

  toggleCategory(id: number) {
    if (this.categoryIdsArray.includes(id)) {
      this.categoryIdsArray = this.categoryIdsArray.filter(x => x !== id)
    } else {
      this.categoryIdsArray = [...this.categoryIdsArray, id]
    }
  }

  toggleSport(id: number) {
    if (this.sportIdsArray.includes(id)) {
      this.sportIdsArray = this.sportIdsArray.filter(x => x !== id)
    } else {
      this.sportIdsArray = [...this.sportIdsArray, id]
    }
  }

  async uploadMainImage(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    this.imageUploading.set(true)
    this.apiError.set('')

    const fd = new FormData()
    fd.append('file', input.files[0])

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-key': this.svc.adminKey() },
        body: fd
      })

      if (res.ok) {
        const { path } = await res.json()
        this.formData = { ...this.formData, image: path }
      } else {
        const err = await res.json().catch(() => ({})) as any
        this.apiError.set(err.error ?? `Error ${res.status}`)
      }
    } catch {
      this.apiError.set('Error de red al subir imagen')
    } finally {
      this.imageUploading.set(false)
      input.value = ''
    }
  }

  async uploadExtraImage(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    this.imageUploading.set(true)
    this.apiError.set('')

    const fd = new FormData()
    fd.append('file', input.files[0])

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-key': this.svc.adminKey() },
        body: fd
      })

      if (res.ok) {
        const { path } = await res.json()
        this.imagesArray = [...this.imagesArray, path]
      } else {
        const err = await res.json().catch(() => ({})) as any
        this.apiError.set(err.error ?? `Error ${res.status}`)
      }
    } catch {
      this.apiError.set('Error de red al subir imagen')
    } finally {
      this.imageUploading.set(false)
      input.value = ''
    }
  }

  removeExtraImage(index: number) {
    this.imagesArray = this.imagesArray.filter((_, i) => i !== index)
  }

  private validate(): boolean {
    const e: Record<string, string> = {}
    const d = this.formData

    if (!d.name?.trim()) e['name'] = 'El nombre es requerido'
    if (!d.price?.trim()) e['price'] = 'El precio es requerido'

    this.formErrors = e
    return Object.keys(e).length === 0
  }

  async save() {
    if (!this.validate()) return

    this.saving.set(true)
    this.apiError.set('')

    const mode = this.modalMode()

    const {
      id,
      createdAt,
      brand,
      gender,
      categories,
      sports,
      category_ids,
      sport_ids,
      gallery,
      ...data
    } = this.formData

    data.sizes = this.sizesArray.join(',')
    data.category_ids = this.categoryIdsArray
    data.sport_ids = this.sportIdsArray
    data.gallery = this.imagesArray

    data.brand_id = data.brand_id ? Number(data.brand_id) : null
    data.gender_id = data.gender_id ? Number(data.gender_id) : null

    try {
      const res = mode === 'add'
        ? await this.svc.apiFetch('/api/admin/products', {
            method: 'POST',
            body: JSON.stringify(data),
          })
        : await this.svc.apiFetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any
        this.apiError.set(err.error ?? `Error ${res.status}`)
        return
      }

      this.showModal.set(false)
      await this.load()
    } catch {
      this.apiError.set('Error de red al guardar')
    } finally {
      this.saving.set(false)
    }
  }

  async deleteItem(id: number) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return

    this.apiError.set('')

    try {
      const res = await this.svc.apiFetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any
        this.apiError.set(err.error ?? `Error ${res.status}`)
        return
      }
    } catch {
      this.apiError.set('Error de red al eliminar')
      return
    }

    await this.load()
  }

  trackById(_: number, item: any) {
    return item.id
  }
}