import { AuthResponse, LogoutResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    const url = '/register'
    return http.post<AuthResponse>(url, body)
  },
  loginAccount: (body: { email: string; password: string }) => {
    const url = '/login'
    return http.post<AuthResponse>(url, body)
  },
  logoutAccount: () => {
    const url = '/logout'
    return http.post<LogoutResponse>(url)
  }
}

export default authApi
