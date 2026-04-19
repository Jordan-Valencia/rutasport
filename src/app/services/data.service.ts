import { Injectable, inject, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { isPlatformBrowser } from '@angular/common'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Product } from '../models/product'
import { Team } from '../models/team'
import { FeatureBanner } from '../models/feature-banner'

export interface Hero {
  id?: number
  campaignName: string
  category: string
  description?: string
  imageUrl: string
  videoUrl?: string
  ctaText?: string
  isActive?: boolean | number
  order?: number
}

export interface Sport {
  id?: number
  name: string
  icon?: string
  order?: number
  isActive?: boolean | number
}

const MOCK_PRODUCTS: Product[] = [
  // Hombre
  { id: 1,  name: 'FOF100575-213', price: '$699.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Hombre', image: '', sizes: '8.5,11' },
  { id: 2,  name: 'FOF100631-001', price: '$599.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Hombre', image: '', sizes: '11' },
  { id: 3,  name: 'KJ1735',        price: '$299.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Hombre', image: '', sizes: '9,9.5,10,11', isBestSeller: true },
  { id: 4,  name: 'JQ6958',        price: '$399.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Hombre', image: '', sizes: '8,9,9.5,10', isNew: true },
  { id: 5,  name: 'FOF100546-01K', price: '$759.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Hombre', image: '', sizes: '10', isNew: true },
  { id: 6,  name: 'FOF100634-323', price: '$699.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Hombre', image: '', sizes: '9.5,11', isNew: true },
  // Mujer
  { id: 10, name: 'FOF100614-001', price: '$649.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Mujer',  image: '', sizes: '7' },
  { id: 11, name: 'FOF100334-053', price: '$535.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Mujer',  image: '', sizes: '7.5' },
  { id: 12, name: 'JQ2540',        price: '$299.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Mujer',  image: '', sizes: '5,5.5,6.5,7', isBestSeller: true },
  { id: 13, name: 'IH8225',        price: '$399.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Mujer',  image: '', sizes: '6,7,7.5', isNew: true },
  { id: 14, name: 'ID8742',        price: '$499.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Mujer',  image: '', sizes: '5.5,7,7.5' },
  { id: 15, name: 'JQ2610',        price: '$299.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Mujer',  image: '', sizes: '6.5,7,7.5' },
  // Unisex / Running / Fútbol
  { id: 20, name: 'FOF100334-001', price: '$599.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Unisex', image: '', sizes: '7.5,10' },
  { id: 21, name: 'FOF100670-323', price: '$629.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Unisex', image: '', sizes: '7,10' },
  { id: 22, name: 'JR7151',        price: '$319.900', category: 'Running',   sport: 'Running',   brand: 'Adidas', gender: 'Hombre', image: '', sizes: '8,10,11' },
  { id: 23, name: 'JR9142',        price: '$399.900', category: 'Running',   sport: 'Running',   brand: 'Adidas', gender: 'Unisex', image: '', sizes: '6,7,7.5,8' },
  { id: 24, name: 'JP5911',        price: '$399.900', category: 'Fútbol',    sport: 'Fútbol',    brand: 'Adidas', gender: 'Unisex', image: '', sizes: '6,6.5,7' },
  { id: 25, name: 'JS4435',        price: '$299.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Unisex', image: '', sizes: '6,6.5,7,8' },
  { id: 26, name: 'HQ2329',        price: '$299.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Adidas', gender: 'Unisex', image: '', sizes: '6.5,7,7.5,8' },
  { id: 27, name: 'FOF100334-323', price: '$535.900', category: 'Lifestyle', sport: 'Lifestyle', brand: 'Oakley', gender: 'Unisex', image: '', sizes: '7,7.5,10' },
]

const MOCK_BANNERS: FeatureBanner[] = [
  { title: 'Nueva Colección Oakley', subtitle: 'EXCLUSIVO', description: 'Los modelos más recientes ya disponibles', image: '', buttonText: 'EXPLORAR', bgColor: '#0f172a' },
  { title: 'Adidas Running', subtitle: 'INNOVACIÓN', description: 'Tecnología de punta para tu rendimiento', image: '', buttonText: 'DESCUBRIR', bgColor: '#1a1a2e' },
]

const MOCK_SPORTS: Sport[] = [
  { id: 1, name: 'Fútbol',     icon: '⚽', order: 1 },
  { id: 2, name: 'Running',    icon: '🏃', order: 2 },
  { id: 3, name: 'Basketball', icon: '🏀', order: 3 },
  { id: 4, name: 'Training',   icon: '💪', order: 4 },
  { id: 5, name: 'Tenis',      icon: '🎾', order: 5 },
  { id: 6, name: 'Lifestyle',  icon: '👟', order: 6 },
]

const MOCK_HEROES: Hero[] = [
  { id: 1, campaignName: 'NUEVA TEMPORADA', category: 'LIFESTYLE', description: 'Supera tus límites. Cada paso cuenta.', imageUrl: '', ctaText: 'COMPRAR AHORA', isActive: true, order: 1 },
  { id: 2, campaignName: 'OAKLEY COLLECTION', category: 'RUNNING', description: 'Rendimiento sin compromisos. Tecnología de élite.', imageUrl: '', ctaText: 'VER COLECCIÓN', isActive: true, order: 2 },
  { id: 3, campaignName: 'ADIDAS X SPORT', category: 'FÚTBOL', description: 'Para los que van más lejos en cada partido.', imageUrl: '', ctaText: 'EXPLORAR', isActive: true, order: 3 },
]

export interface ProductFilters {
  sport?:      string
  category?:   string
  brand?:      string
  gender?:     string
  bestSeller?: boolean
  isNew?:      boolean
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient)
  private platformId = inject(PLATFORM_ID)

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  getProducts(params?: ProductFilters): Observable<Product[]> {
    if (!this.isBrowser) return of(MOCK_PRODUCTS)
    const qs: string[] = []
    if (params?.sport)      qs.push(`sport=${encodeURIComponent(params.sport)}`)
    if (params?.category)   qs.push(`category=${encodeURIComponent(params.category)}`)
    if (params?.brand)      qs.push(`brand=${encodeURIComponent(params.brand)}`)
    if (params?.gender)     qs.push(`gender=${encodeURIComponent(params.gender)}`)
    if (params?.bestSeller) qs.push('bestSeller=true')
    if (params?.isNew)      qs.push('isNew=true')
    const url = '/api/products' + (qs.length ? '?' + qs.join('&') : '')
    return this.http.get<Product[]>(url).pipe(catchError(() => of(MOCK_PRODUCTS)))
  }

  getTeams(type?: string): Observable<Team[]> {
    if (!this.isBrowser) return of([])
    const url = type ? `/api/teams?type=${encodeURIComponent(type)}` : '/api/teams'
    return this.http.get<Team[]>(url).pipe(catchError(() => of([])))
  }

  getBanners(): Observable<FeatureBanner[]> {
    if (!this.isBrowser) return of(MOCK_BANNERS)
    return this.http.get<FeatureBanner[]>('/api/banners').pipe(catchError(() => of(MOCK_BANNERS)))
  }

  getSports(): Observable<Sport[]> {
    if (!this.isBrowser) return of(MOCK_SPORTS)
    return this.http.get<Sport[]>('/api/sports').pipe(catchError(() => of(MOCK_SPORTS)))
  }

  getHeroes(): Observable<Hero[]> {
    if (!this.isBrowser) return of(MOCK_HEROES)
    return this.http.get<Hero[]>('/api/heroes').pipe(catchError(() => of(MOCK_HEROES)))
  }
}
