import { request } from './request'

export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    name: string
    email: string
    avatar?: string
    roles: string[]
    permissions: string[]
  }
}

export interface UserInfo {
  id: string
  username: string
  name: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

// 登录
export const login = (data: LoginParams) => {
  return request<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

// 登出
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'POST'
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request<UserInfo>({
    url: '/auth/userinfo',
    method: 'GET'
  })
}

// 刷新token
export const refreshToken = () => {
  return request<{ token: string }>({
    url: '/auth/refresh',
    method: 'POST'
  })
} 