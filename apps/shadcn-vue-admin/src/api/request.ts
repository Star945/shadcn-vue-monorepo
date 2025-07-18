import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    // 添加token到请求头
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    
    // 如果是文件下载，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 统一处理响应格式
    if (data.code === 200 || data.success) {
      return data.data || data
    } else {
      // 业务错误
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error) => {
    const authStore = useAuthStore()
    
    if (error.response) {
      const { status } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转登录
          authStore.logout()
          window.location.href = '/login'
          break
        case 403:
          console.error('权限不足')
          break
        case 404:
          console.error('接口不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('网络错误')
      }
    } else {
      console.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

// 请求方法封装
export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return instance(config)
}

export default instance 