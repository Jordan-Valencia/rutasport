import { Component, OnInit, signal, inject, computed, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { DataService } from '../../services/data.service'
import { CartService } from '../../services/cart.service'
import { Product } from '../../models/product'
import { HeaderComponent } from '../header/header.component'
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component'
import { CopPipe } from '../../shared/cop.pipe'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CartDrawerComponent, CopPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private dataService = inject(DataService)
  protected cart = inject(CartService)

  product = signal<Product | null>(null)
  loading = signal(true)
  activeIndex = signal(0)
  selectedSize = signal('')
  justAdded = signal(false)

  readonly ZOOM_FACTOR = 2.5

  // ── Hover zoom (cursor-following) ─────────────────────────────
  hoveredIndex = signal(-1)
  hoverOriginX = signal(50)
  hoverOriginY = signal(50)
  readonly HOVER_ZOOM = 2.0

  onGalleryMouseMove(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    this.hoverOriginX.set(((event.clientX - rect.left) / rect.width) * 100)
    this.hoverOriginY.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  galleryImgTransition(index: number): string {
    const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    // Al hover: solo transiciona el scale (origin sigue cursor al instante)
    // Al salir: ambos animan juntos → sin salto visual
    return this.hoveredIndex() === index
      ? `transform 0.45s ${easing}`
      : `transform 0.45s ${easing}, transform-origin 0.45s ${easing}`
  }

  readonly SPORT_COLORS: Record<string, string | undefined> = {
    'Fútbol': '#22c55e',
    'Running': '#f97316',
    'Basketball': '#ef4444',
    'Training': '#3b82f6',
    'Tenis': '#eab308',
    'Lifestyle': '#a855f7',
    'Trail': '#92400e',
  }

  images = computed(() => {
    const p = this.product()
    if (!p) return []
    const gallery = p.gallery
      ? p.gallery.split(',').map(s => s.trim()).filter(Boolean)
      : []
    return p.image ? [p.image, ...gallery] : gallery
  })

  sizes = computed(() =>
    this.product()?.sizes
      ? this.product()!.sizes!.split(',').map(s => 'US' + s.trim()).filter(Boolean)
      : []
  )

  inventoryMap = computed((): Record<string, number> => {
    const raw = this.product()?.inventory_raw
    if (!raw) return {}
    return Object.fromEntries(
      raw.split(',').map(e => {
        const [s, c] = e.split(':')
        return [s.trim(), parseInt(c) || 0]
      })
    )
  })

  stockForSelectedSize = computed(() => {
    const sel = this.selectedSize()
    if (!sel) return 0
    const raw = sel.replace(/^US/i, '')
    return this.inventoryMap()[raw] ?? 1
  })

  stockForSize(displaySize: string): number {
    const raw = displaySize.replace(/^US/i, '')
    return this.inventoryMap()[raw] ?? 1
  }

  sportColor = computed(() => {
    const firstSport = this.product()?.sports?.split(',')[0]?.trim() ?? ''
    return this.SPORT_COLORS[firstSport] ?? '#E31C1C'
  })

  // ── Lightbox ──────────────────────────────────────────────────
  lightboxOpen = signal(false)
  lightboxZoomed = signal(false)
  lightboxZoomOriginX = signal(50)
  lightboxZoomOriginY = signal(50)
  lightboxPanX = signal(0)
  lightboxPanY = signal(0)
  dragging = signal(false)
  private _dragStartX = 0
  private _dragStartY = 0
  private _panStartX = 0
  private _panStartY = 0
  private _hasDragged = false
  private _touchStartX = 0

  lightboxImgTransform = computed(() => {
    if (!this.lightboxZoomed()) return 'scale(1)'
    const px = this.lightboxPanX() / this.ZOOM_FACTOR
    const py = this.lightboxPanY() / this.ZOOM_FACTOR
    return `scale(${this.ZOOM_FACTOR}) translate(${px}px, ${py}px)`
  })

  lightboxImgOrigin = computed(() =>
    `${this.lightboxZoomOriginX()}% ${this.lightboxZoomOriginY()}%`
  )

  // ── Gallery ───────────────────────────────────────────────────
  openLightboxAt(index: number) {
    this.activeIndex.set(index)
    this.lightboxOpen.set(true)
    this._resetZoom()
  }

  setImage(index: number) {
    this.activeIndex.set(index)
  }

  // ── Lightbox handlers ─────────────────────────────────────────
  closeLightbox() {
    this.lightboxOpen.set(false)
    this._resetZoom()
  }

  onLightboxContainerClick(event: MouseEvent) {
    if (event.target === event.currentTarget && !this.lightboxZoomed()) {
      this.closeLightbox()
    }
  }

  prevImage(event?: Event) {
    event?.stopPropagation()
    if (this.images().length <= 1) return
    this.activeIndex.set((this.activeIndex() - 1 + this.images().length) % this.images().length)
    this._resetZoom()
  }

  nextImage(event?: Event) {
    event?.stopPropagation()
    if (this.images().length <= 1) return
    this.activeIndex.set((this.activeIndex() + 1) % this.images().length)
    this._resetZoom()
  }

  onLightboxImageClick(event: MouseEvent) {
    event.stopPropagation()
    if (this._hasDragged) return
    if (!this.lightboxZoomed()) {
      const el = event.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      this.lightboxZoomOriginX.set(((event.clientX - rect.left) / rect.width) * 100)
      this.lightboxZoomOriginY.set(((event.clientY - rect.top) / rect.height) * 100)
      this.lightboxPanX.set(0)
      this.lightboxPanY.set(0)
      this.lightboxZoomed.set(true)
    } else {
      this._resetZoom()
    }
  }

  onLightboxMouseDown(event: MouseEvent) {
    if (!this.lightboxZoomed()) return
    this._hasDragged = false
    this._dragStartX = event.clientX
    this._dragStartY = event.clientY
    this._panStartX = this.lightboxPanX()
    this._panStartY = this.lightboxPanY()
    this.dragging.set(true)
    event.preventDefault()
  }

  onLightboxMouseMove(event: MouseEvent) {
    if (!this.lightboxZoomed() || !this.dragging()) return
    const dx = event.clientX - this._dragStartX
    const dy = event.clientY - this._dragStartY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) this._hasDragged = true
    this.lightboxPanX.set(this._panStartX + dx)
    this.lightboxPanY.set(this._panStartY + dy)
  }

  onLightboxMouseUp() {
    this.dragging.set(false)
    setTimeout(() => { this._hasDragged = false }, 50)
  }

  onTouchStart(event: TouchEvent) {
    this._touchStartX = event.touches[0].clientX
  }

  onTouchEnd(event: TouchEvent) {
    const dx = event.changedTouches[0].clientX - this._touchStartX
    if (Math.abs(dx) > 50) {
      if (dx < 0) this.nextImage()
      else this.prevImage()
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.lightboxOpen()) return
    if (e.key === 'Escape') this.closeLightbox()
    if (e.key === 'ArrowLeft') this.prevImage()
    if (e.key === 'ArrowRight') this.nextImage()
  }

  private _resetZoom() {
    this.lightboxZoomed.set(false)
    this.lightboxPanX.set(0)
    this.lightboxPanY.set(0)
    this.dragging.set(false)
  }

  addToCart() {
    const p = this.product()
    if (!p) return
    if (this.sizes().length > 0 && !this.selectedSize()) return
    const size = this.selectedSize() || undefined
    this.cart.add({
      productId: p.id!,
      name: p.name,
      brand: p.brand,
      model: p.model,
      price: p.price,
      image: p.image,
      size,
      maxStock: size ? this.stockForSelectedSize() : undefined,
    })
    this.justAdded.set(true)
    setTimeout(() => this.justAdded.set(false), 2000)
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    if (!id) {
      this.router.navigate(['/catalogo'])
      return
    }
    this.dataService.getProductById(+id).subscribe(p => {
      if (!p) {
        this.router.navigate(['/catalogo'])
        return
      }
      this.product.set(p)
      this.loading.set(false)
    })
  }
}
