<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'shadcn-vue-ui'
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  MousePointer,
  FileText,
  Table,
  BarChart3,
  Users,
  Shield,
  Key,
  Upload as UploadIcon
} from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(false)

// 菜单配置
const menuItems = [
  {
    title: '仪表盘',
    icon: LayoutDashboard,
    path: '/dashboard',
    children: []
  },
  {
    title: '系统管理',
    icon: Settings,
    path: '/system',
    children: [
      { title: '用户管理', icon: Users, path: '/system/users' },
      { title: '角色管理', icon: Shield, path: '/system/roles' },
      { title: '菜单管理', icon: Menu, path: '/system/menus' },
      { title: '权限管理', icon: Key, path: '/system/permissions' },
      { title: '系统设置', icon: Settings, path: '/system/settings' }
    ]
  },
  {
    title: '组件展示',
    icon: Package,
    path: '/components',
    children: [
      { title: '按钮组件', icon: MousePointer, path: '/components/buttons' },
      { title: '表单组件', icon: FileText, path: '/components/forms' },
      { title: '表格组件', icon: Table, path: '/components/tables' },
      { title: '图表组件', icon: BarChart3, path: '/components/charts' },
      { title: '文件上传', icon: UploadIcon, path: '/components/upload' },
      { title: '富文本编辑器', icon: FileText, path: '/components/richtext' }
    ]
  }
]

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    title: item.meta?.title as string,
    path: item.path
  }))
})
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Mobile Sidebar -->
    <Sheet v-model:open="sidebarOpen">
      <SheetContent side="left" class="w-64 p-0">
        <div class="flex h-full flex-col">
          <!-- Logo -->
          <div class="flex h-14 items-center border-b px-4">
            <h2 class="text-lg font-semibold">ShadCN Admin</h2>
          </div>
          <!-- Navigation -->
          <nav class="flex-1 space-y-1 p-4">
            <template v-for="item in menuItems" :key="item.path">
              <div>
                <router-link
                  :to="item.path"
                  class="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
                  :class="{ 'bg-accent': route.path.startsWith(item.path) }"
                >
                  <component :is="item.icon" class="h-4 w-4" />
                  {{ item.title }}
                </router-link>
                <!-- Submenu -->
                <div
                  v-if="item.children.length > 0"
                  class="ml-4 mt-1 space-y-1"
                >
                  <router-link
                    v-for="child in item.children"
                    :key="child.path"
                    :to="child.path"
                    class="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
                    :class="{ 'bg-accent': route.path === child.path }"
                  >
                    <component :is="child.icon" class="h-3 w-3" />
                    {{ child.title }}
                  </router-link>
                </div>
              </div>
            </template>
          </nav>
        </div>
      </SheetContent>
    </Sheet>

    <!-- Desktop Layout -->
    <div class="flex">
      <!-- Desktop Sidebar -->
      <aside class="bg-background hidden w-64 border-r lg:block">
        <div class="flex h-full flex-col">
          <!-- Logo -->
          <div class="flex h-14 items-center border-b px-4">
            <h2 class="text-lg font-semibold">ShadCN Admin</h2>
          </div>
          <!-- Navigation -->
          <nav class="flex-1 space-y-1 p-4">
            <template v-for="item in menuItems" :key="item.path">
              <div>
                <router-link
                  :to="item.path"
                  class="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
                  :class="{ 'bg-accent': route.path.startsWith(item.path) }"
                >
                  <component :is="item.icon" class="h-4 w-4" />
                  {{ item.title }}
                </router-link>
                <!-- Submenu -->
                <div
                  v-if="item.children.length > 0"
                  class="ml-4 mt-1 space-y-1"
                >
                  <router-link
                    v-for="child in item.children"
                    :key="child.path"
                    :to="child.path"
                    class="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
                    :class="{ 'bg-accent': route.path === child.path }"
                  >
                    <component :is="child.icon" class="h-3 w-3" />
                    {{ child.title }}
                  </router-link>
                </div>
              </div>
            </template>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex flex-1 flex-col">
        <!-- Header -->
        <header
          class="bg-background flex h-14 items-center border-b px-4 lg:px-6"
        >
          <div class="flex flex-1 items-center gap-4">
            <!-- Mobile Menu Button -->
            <Sheet>
              <SheetTrigger as-child>
                <Button variant="ghost" size="icon" class="lg:hidden">
                  <Menu class="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </Sheet>

            <!-- Breadcrumb -->
            <nav
              class="text-muted-foreground flex items-center space-x-1 text-sm"
            >
              <template
                v-for="(breadcrumb, index) in breadcrumbs"
                :key="breadcrumb.path"
              >
                <span v-if="index > 0" class="mx-1">/</span>
                <span
                  :class="{
                    'text-foreground': index === breadcrumbs.length - 1
                  }"
                >
                  {{ breadcrumb.title }}
                </span>
              </template>
            </nav>

            <div class="flex-1"></div>

            <!-- Header Actions -->
            <div class="flex items-center space-x-2">
              <!-- Search -->
              <Button variant="ghost" size="icon">
                <Search class="h-4 w-4" />
              </Button>

              <!-- Notifications -->
              <Button variant="ghost" size="icon">
                <Bell class="h-4 w-4" />
              </Button>

              <!-- User Menu -->
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                    <Avatar class="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56" align="end">
                  <DropdownMenuItem>
                    <User class="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings class="mr-2 h-4 w-4" />
                    <span>设置</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut class="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-4 lg:p-6">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
