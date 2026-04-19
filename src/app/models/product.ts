export interface Product {
  id?:          number
  name:         string
  price:        string
  brand?:       string
  brand_id?:    number
  category?:    string
  category_id?: number
  sport?:       string
  sport_id?:    number
  gender?:      string
  gender_id?:   number
  image:        string
  gallery?:     string      // comma-separated URLs (GROUP_CONCAT from product_images)
  isBestSeller?: boolean | number
  isNew?:        boolean | number
  description?:  string
  sizes?:        string
  createdAt?:    string
}
