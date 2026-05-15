export interface Product {
  id?:           number
  name:          string
  model?:        string
  price:         number
  brand?:        string
  brand_id?:     number
  // Many-to-many — comma-separated names returned by API
  categories?:   string   // e.g. "Running,Trail"
  sports?:       string   // e.g. "Fútbol,Running"
  // Comma-separated IDs returned by admin API
  category_ids?: string
  sport_ids?:    string
  gender?:       string
  gender_id?:    number
  image:         string
  video?:        string   // video URL
  gallery?:      string   // comma-separated URLs
  isBestSeller?: boolean | number
  isNew?:        boolean | number
  badge?:        string
  description?:  string
  sizes?:        string
  inventory_raw?: string  // "7.5:1,8:2" — stock disponible por talla
  total_stock?:  number   // suma total de stock (usada en admin)
  createdAt?:    string
}
