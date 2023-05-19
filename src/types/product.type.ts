export interface Product {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  description: string
  quantity: number
  sold: number
  view: number
  name: string
  category: {
    _id: string
    name: string
    __v: number
  };
  image: string
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  products: Product[]
  pagination: {
    page: number | 1
    limit: number | 10
    page_size: number | 10
  }
}

export interface ProductListConfig {
  page?: number
  limit?: number
  order?: 'desc' | 'asc'
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  exclude?: string
  rating_filter?: number
  price_max?: number
  price_min?: number
  name?: string
  category?: string
}


