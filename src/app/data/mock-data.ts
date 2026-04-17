import { Product } from '../models/product'
import { Team } from '../models/team'
import { FeatureBanner } from '../models/feature-banner'

export const teams: Team[] = [
  { name: '(Equipo 1)', country: '(País)' },
  { name: '(Equipo 2)', country: '(País)' },
  { name: '(Equipo 3)', country: '(País)' },
  { name: '(Equipo 4)', country: '(País)' },
  { name: '(Equipo 5)', country: '(País)' },
  { name: '(Equipo 6)', country: '(País)' },
]

export const products: Product[] = [
  { name: '(Modelo del Tenis)', price: '(Precio)', category: 'Fútbol', image: '/images/product-running-1.jpg' },
  { name: '(Modelo del Tenis)', price: '(Precio)', category: 'Running', image: '/images/product-training-1.jpg' },
  { name: '(Modelo del Tenis)', price: '(Precio)', category: 'Basketball', image: '/images/product-basketball-1.jpg' },
  { name: '(Modelo del Tenis)', price: '(Precio)', category: 'Training', image: '/images/product-casual-1.jpg' },
]

export const sports: string[] = ['Fútbol', 'Running', 'Basketball', 'Training', 'Tenis', 'Golf']

export const featureBanners: FeatureBanner[] = [
  {
    title: '(NOMBRE PRODUCTO / COLECCIÓN)',
    subtitle: '(COLABORACIÓN)',
    description: '(Descripción breve de la colaboración o producto especial)',
    image: '/images/sneaker-2.jpg',
    buttonText: 'DESCUBRIR',
    bgColor: '#1a237e',
  },
  {
    title: '(TECNOLOGÍA DEL PRODUCTO)',
    subtitle: '(INNOVACIÓN)',
    description: '(Descripción de la tecnología o innovación destacada)',
    image: '/images/sneaker-1.jpg',
    buttonText: 'EXPLORAR',
    bgColor: 'black',
  },
]
