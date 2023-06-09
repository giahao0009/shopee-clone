// Đây à file để chứa các type tiện ích
// Tạo ResponseApi <Data> tức là ta truyền vào Data và thằng Data đó phải có định dạng như bên dưới
// Kiểu giống truyền biến trong func
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

// Cú pháp '-?' sẽ loại bỏ undefined của key optional
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
