type Role = 'User' | 'Admin'

export interface User {
  _id: string
  roles: Role[]
  email: string
  name?: string
  date_of_birth?: string // Kiểu định dạng ISO 8601 date string
  avatar?: string
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
  __v: number
}
