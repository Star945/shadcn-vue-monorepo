import { request } from './request'

export interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions: string[]
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
}

export interface RoleListParams {
  page?: number
  pageSize?: number
  name?: string
  code?: string
  status?: string
}

export interface RoleListResponse {
  list: Role[]
  total: number
  page: number
  pageSize: number
}

export interface CreateRoleParams {
  name: string
  code: string
  description?: string
  permissions: string[]
}

export interface UpdateRoleParams extends Partial<CreateRoleParams> {
  id: string
}

// 获取角色列表
export const getRoleList = (params: RoleListParams) => {
  return request<RoleListResponse>({
    url: '/role/list',
    method: 'GET',
    params
  })
}

// 获取所有角色（不分页）
export const getAllRoles = () => {
  return request<Role[]>({
    url: '/role/all',
    method: 'GET'
  })
}

// 创建角色
export const createRole = (data: CreateRoleParams) => {
  return request<Role>({
    url: '/role/create',
    method: 'POST',
    data
  })
}

// 更新角色
export const updateRole = (data: UpdateRoleParams) => {
  return request<Role>({
    url: `/role/${data.id}`,
    method: 'PUT',
    data
  })
}

// 删除角色
export const deleteRole = (id: string) => {
  return request({
    url: `/role/${id}`,
    method: 'DELETE'
  })
}

// 获取角色权限
export const getRolePermissions = (id: string) => {
  return request<string[]>({
    url: `/role/${id}/permissions`,
    method: 'GET'
  })
}

// 更新角色权限
export const updateRolePermissions = (id: string, permissions: string[]) => {
  return request({
    url: `/role/${id}/permissions`,
    method: 'PUT',
    data: { permissions }
  })
} 