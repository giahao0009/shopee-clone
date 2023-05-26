import axios, { Axios, AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify';
import { HttpStatusCode } from 'src/constants/httpStatusCode.enum';
import path from 'src/constants/path';
import { AuthResponse } from 'src/types/auth.type';
import { clearLS, getAccessTokenFromLS, saveAccessTokenToLS, setProfileToLS } from './auth';

// Cách dùng 1
// class Http {
//   instance: AxiosInstance
//   private accessToken: string
//   constructor() {
//     this.instance = axios.create({
//       baseURL: 'https://api-ecom.duthanhduoc.com/',
//       timeout: 10000,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })

//     this.instance.interceptors.request.use((config) => {
//       if (this.accessToken && config.headers) {
//         config.headers.authorization = this.accessToken
//         return config
//       }
//       return config
//     },
//       (error) => {
//         return Promise.reject(error)
//       }
//     )

//     this.instance.interceptors.response.use(
//       (response) => {
//         const url = response.config?.url
//         if (url === '/login' || url === '/register') {
//           this.accessToken = (response.data as AuthResponse).data.access_token
//           saveAccessTokenToLS(this.accessToken)
//         } else if (url === '/logout') {
//           this.accessToken = ''
//           clearAccessTokenFromLS()
//         }
//         return response
//       },
//       function (error: AxiosError) {
//         if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           const data: any | undefined = error.response?.data
//           const message = data.message || error.message
//           toast.error(message)
//         }
//         return Promise.reject(error)
//       }
//     )
//   }
// }

// Cách dùng 2
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api-ecom.duthanhduoc.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    console.log(config)
    const accessToken = getAccessTokenFromLS() || ''
    if (accessToken && config.headers) {
      config.headers.Authorization = accessToken
      return config
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    let accessToken: string
    const url = response.config?.url
    if (url === path.login.link || url === path.register.link) {
      accessToken = (response.data as AuthResponse).data.access_token
      saveAccessTokenToLS(accessToken)
      setProfileToLS(response.data.data.user)
    } else if (url === path.logout) {
      accessToken = ''
      clearLS()
    }
    return response
  },
  function (error: AxiosError) {
    console.log(error);
    // Xét trường hợp khi call API mà trả về Unauthorized và url call là purchases
    // Thì ta return null không làm gì cả
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      clearLS()
      // window.location.reload() Đừng dùng cách này, ngu lắm
    }
    if (error.response?.status === HttpStatusCode.Unauthorized && error.config?.url === 'purchases') {
      return null
    }
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any | undefined = error.response?.data
      const message = data.message || error.message
      toast.error(message)
    }
    return Promise.reject(error)
  }
)

const http = axiosInstance
export default http
