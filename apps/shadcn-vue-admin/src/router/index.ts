import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: {
          title: '仪表盘',
          icon: 'LayoutDashboard'
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/BasicLayout.vue'),
    meta: {
      title: '系统管理',
      icon: 'Settings'
    },
    children: [
      {
        path: 'users',
        name: 'SystemUsers',
        component: () => import('@/views/system/users/UsersView.vue'),
        meta: {
          title: '用户管理',
          icon: 'Users',
          permission: 'system:user:list'
        }
      },
      {
        path: 'roles',
        name: 'SystemRoles',
        component: () => import('@/views/system/roles/RolesView.vue'),
        meta: {
          title: '角色管理',
          icon: 'Shield',
          permission: 'system:role:list'
        }
      },
      {
        path: 'menus',
        name: 'SystemMenus',
        component: () => import('@/views/system/menus/MenusView.vue'),
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          permission: 'system:menu:list'
        }
      },
              {
          path: 'permissions',
          name: 'SystemPermissions',
          component: () => import('@/views/system/permissions/PermissionsView.vue'),
          meta: {
            title: '权限管理',
            icon: 'Key',
            permission: 'system:permission:list'
          }
        },
        {
          path: 'settings',
          name: 'SystemSettings',
          component: () => import('@/views/system/settings/SettingsView.vue'),
          meta: {
            title: '系统设置',
            icon: 'Settings',
            permission: 'system:settings:manage'
          }
        }
    ]
  },
  {
    path: '/components',
    name: 'Components',
    component: () => import('@/layouts/BasicLayout.vue'),
    meta: {
      title: '组件展示',
      icon: 'Package'
    },
    children: [
      {
        path: 'buttons',
        name: 'Buttons',
        component: () => import('@/views/components/ButtonsView.vue'),
        meta: {
          title: '按钮组件',
          icon: 'MousePointer'
        }
      },
      {
        path: 'forms',
        name: 'Forms',
        component: () => import('@/views/components/FormsView.vue'),
        meta: {
          title: '表单组件',
          icon: 'FileText'
        }
      },
      {
        path: 'tables',
        name: 'Tables',
        component: () => import('@/views/components/TablesView.vue'),
        meta: {
          title: '表格组件',
          icon: 'Table'
        }
      },
      {
        path: 'charts',
        name: 'Charts',
        component: () => import('@/views/components/ChartsView.vue'),
        meta: {
          title: '图表组件',
          icon: 'BarChart3'
        }
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/components/UploadView.vue'),
        meta: {
          title: '文件上传',
          icon: 'Upload'
        }
      },
      {
        path: 'richtext',
        name: 'RichText',
        component: () => import('@/views/components/RichTextView.vue'),
        meta: {
          title: '富文本编辑器',
          icon: 'FileText'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由守卫
router.beforeEach((to: any, from: any, next: any) => {
  // 这里可以添加权限验证逻辑
  next()
})

export default router 