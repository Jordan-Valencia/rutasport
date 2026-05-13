import { Component, signal, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'

const COLOMBIA: Record<string, string[]> = {
  'Amazonas':                  ['Leticia', 'Puerto Nariño'],
  'Antioquia':                 ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro', 'Copacabana', 'La Estrella', 'Sabaneta'],
  'Arauca':                    ['Arauca', 'Saravena', 'Tame', 'Arauquita'],
  'Atlántico':                 ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Baranoa', 'Galapa'],
  'Bogotá D.C.':               ['Bogotá'],
  'Bolívar':                   ['Cartagena', 'Magangué', 'Turbaco', 'El Carmen de Bolívar', 'Mompós'],
  'Boyacá':                    ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Monguí', 'Villa de Leyva'],
  'Caldas':                    ['Manizales', 'Villamaría', 'Chinchiná', 'Riosucio', 'Aguadas', 'Salamina'],
  'Caquetá':                   ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'],
  'Casanare':                  ['Yopal', 'Aguazul', 'Villanueva', 'Paz de Ariporo', 'Tauramena'],
  'Cauca':                     ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'El Bordo', 'Patía'],
  'Cesar':                     ['Valledupar', 'Aguachica', 'Codazzi', 'La Jagua de Ibirico', 'Bosconia'],
  'Chocó':                     ['Quibdó', 'Istmina', 'Tadó', 'Riosucio'],
  'Córdoba':                   ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Montelíbano', 'Tierralta'],
  'Cundinamarca':              ['Soacha', 'Fusagasugá', 'Facatativá', 'Zipaquirá', 'Chía', 'Mosquera', 'Madrid', 'Funza', 'Girardot', 'La Mesa'],
  'Guainía':                   ['Inírida'],
  'Guaviare':                  ['San José del Guaviare', 'El Retorno', 'Calamar'],
  'Huila':                     ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre'],
  'La Guajira':                ['Riohacha', 'Maicao', 'Uribia', 'Manaure', 'San Juan del Cesar'],
  'Magdalena':                 ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Plato'],
  'Meta':                      ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'San Martín'],
  'Nariño':                    ['Pasto', 'Tumaco', 'Ipiales', 'La Unión', 'Túquerres'],
  'Norte de Santander':        ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios', 'El Zulia'],
  'Putumayo':                  ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez'],
  'Quindío':                   ['Armenia', 'Calarcá', 'Montenegro', 'La Tebaida', 'Quimbaya'],
  'Risaralda':                 ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Marsella'],
  'San Andrés y Providencia':  ['San Andrés', 'Providencia'],
  'Santander':                 ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'Socorro', 'San Gil'],
  'Sucre':                     ['Sincelejo', 'Corozal', 'San Marcos', 'Sampués', 'Tolú'],
  'Tolima':                    ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Líbano', 'Mariquita'],
  'Valle del Cauca':           ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga', 'Jamundí', 'Yumbo', 'Candelaria'],
  'Vaupés':                    ['Mitú'],
  'Vichada':                   ['Puerto Carreño'],
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)

  full_name = ''
  email = ''
  phone = ''
  region = ''
  city = ''
  address = ''
  password = ''
  confirm_password = ''
  acceptedTerms = false

  readonly departments = Object.keys(COLOMBIA).sort()

  get cities(): string[] {
    return this.region ? (COLOMBIA[this.region] ?? []) : []
  }

  onRegionChange(): void {
    this.city = ''
  }

  readonly loading = signal(false)
  readonly error = signal('')
  readonly shaking = signal(false)
  readonly showPassword = signal(false)
  readonly showConfirm = signal(false)

  async submit(): Promise<void> {
    if (!this.email || !this.password) {
      this.triggerShake('Email y contraseña son requeridos')
      return
    }
    if (this.password !== this.confirm_password) {
      this.triggerShake('Las contraseñas no coinciden')
      return
    }
    if (this.password.length < 6) {
      this.triggerShake('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!this.acceptedTerms) {
      this.triggerShake('Debes aceptar los Términos y Condiciones para continuar')
      return
    }
    this.error.set('')
    this.loading.set(true)
    try {
      await this.auth.register(
        this.email,
        this.password,
        this.full_name || undefined,
        this.phone || undefined,
        this.region || undefined,
        this.city || undefined,
        this.address || undefined,
      )
      this.router.navigate(['/'])
    } catch (e) {
      const msg = e instanceof HttpErrorResponse ? e.error?.error : 'Error al registrarse'
      this.triggerShake(msg ?? 'Error al registrarse')
    } finally {
      this.loading.set(false)
    }
  }

  private triggerShake(msg: string): void {
    this.error.set(msg)
    this.shaking.set(false)
    requestAnimationFrame(() => this.shaking.set(true))
    setTimeout(() => this.shaking.set(false), 450)
  }
}
