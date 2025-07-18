import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export interface Permission {
  id: string
  code: string
  name: string
  type: 'menu' | 'button' | 'api'
  parentId?: string
  path?: string
  component?: string
  icon?: string
  sort: number
  status: 'active' | 'inactive'
  children?: Permission[]
}

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<Permission[]>([])
  const routes = ref<RouteRecordRaw[]>([])
  const menuTree = ref<Permission[]>([])

  // 计算属性
  const buttonPermissions = computed(() => {
    return permissions.value.filter(p => p.type === 'button').map(p => p.code)
  })

  const apiPermissions = computed(() => {
    return permissions.value.filter(p => p.type === 'api').map(p => p.code)
  })

  // 设置权限列表
  const setPermissions = (perms: Permission[]) => {
    permissions.value = perms
    menuTree.value = buildMenuTree(perms.filter(p => p.type === 'menu'))
  }

  // 构建菜单树
  const buildMenuTree = (menuPerms: Permission[]): Permission[] => {
    const menuMap = new Map<string, Permission>()
    const result: Permission[] = []

    // 创建映射
    menuPerms.forEach(menu => {
      menuMap.set(menu.id, { ...menu, children: [] })
    })

    // 构建树结构
    menuPerms.forEach(menu => {
      const menuItem = menuMap.get(menu.id)!
      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId)!
        parent.children!.push(menuItem)
      } else {
        result.push(menuItem)
      }
    })

    return result.sort((a, b) => a.sort - b.sort)
  }

  // 生成动态路由
  const generateRoutes = (menus: Permission[]): RouteRecordRaw[] => {
    const routes: RouteRecordRaw[] = []

    menus.forEach(menu => {
      if (menu.path && menu.component) {
        const route: RouteRecordRaw = {
          path: menu.path,
          name: menu.code,
          component: () => import(`@/views${menu.component}.vue`),
          meta: {
            title: menu.name,
            icon: menu.icon,
            permission: menu.code,
            keepAlive: true
          }
        }

        if (menu.children && menu.children.length > 0) {
          route.children = generateRoutes(menu.children)
        }

        routes.push(route)
      }
    })

    return routes
  }

  // 检查权限
  const hasPermission = (permission: string | string[]): boolean => {
    if (!permission) return true
    
    const perms = Array.isArray(permission) ? permission : [permission]
    const userPermissions = permissions.value.map(p => p.code)
    
    return perms.some(perm => userPermissions.includes(perm))
  }

  // 检查按钮权限
  const hasButtonPermission = (buttonCode: string): boolean => {
    return buttonPermissions.value.includes(buttonCode)
  }

  return {
    permissions,
    routes,
    menuTree,
    buttonPermissions,
    apiPermissions,
    setPermissions,
    generateRoutes,
    hasPermission,
    hasButtonPermission
  }
}) 