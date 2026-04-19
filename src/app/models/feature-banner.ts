export interface FeatureBanner {
  id?: number
  title: string
  subtitle: string
  description: string
  image: string
  buttonText: string
  bgColor: string
  order?: number
  isActive?: boolean | number
}
