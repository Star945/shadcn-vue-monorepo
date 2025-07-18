import { request } from './request'

export interface User {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive'
  roles: string[]
  department?: string
  createTime: string
  updateTime: string
}

export interface UserListParams {
  page?: number
  pageSize?: number
  username?: string
  name?: string
  status?: string
  roleId?: string
}

export interface UserListResponse {
  list: User[]
  total: number
  page: number
  pageSize: number
}

export interface CreateUserParams {
  username: string
  name: string
  email: string
  phone?: string
  password: string
  roleIds: string[]
  department?: string
}

export interface UpdateUserParams extends Partial<CreateUserParams> {
  id: string
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return request<UserListResponse>({
    url: '/user/list',
    method: 'GET',
    params
  })
}

// 创建用户
export const createUser = (data: CreateUserParams) => {
  return request<User>({
    url: '/user/create',
    method: 'POST',
    data
  })
}

// 更新用户
export const updateUser = (data: UpdateUserParams) => {
  return request<User>({
    url: `/user/${data.id}`,
    method: 'PUT',
    data
  })
}

// 删除用户
export const deleteUser = (id: string) => {
  return request({
    url: `/user/${id}`,
    method: 'DELETE'
  })
}

// 批量删除用户
export const batchDeleteUsers = (ids: string[]) => {
  return request({
    url: '/user/batch-delete',
    method: 'POST',
    data: { ids }
  })
}

// 重置用户密码
export const resetPassword = (id: string, newPassword: string) => {
  return request({
    url: `/user/${id}/reset-password`,
    method: 'POST',
    data: { password: newPassword }
  })
}

// 启用/禁用用户
export const toggleUserStatus = (id: string, status: 'active' | 'inactive') => {
  return request({
    url: `/user/${id}/status`,
    method: 'PUT',
    data: { status }
  })
} 