export interface Product {
  id?:           number
  name:          string
  model?:        string
  price:         string
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
  gallery?:      string   // comma-separated URLs
  isBestSeller?: boolean | number
  isNew?:        boolean | number
  description?:  string
  sizes?:        string
  createdAt?:    string
}
