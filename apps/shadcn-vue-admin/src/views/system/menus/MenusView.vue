<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle } from 'shadcn-vue-ui'
import { Plus, Edit, Trash2, Menu as MenuIcon, Eye, EyeOff } from 'lucide-vue-next'
import DataTable from '@/components/DataTable.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import type { FormSchema } from '@/components/DynamicForm.vue'

export interface MenuInfo {
  id: string
  title: string
  path: string
  icon?: string
  parentId?: string
  sort: number
  visible: boolean
  status: 'active' | 'inactive'
  component?: string
  type: 'menu' | 'button'
  permission?: string
  createTime: string
  children?: MenuInfo[]
}

// 状态
const loading = ref(false)
const menus = ref<MenuInfo[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentMenu = ref<MenuInfo | null>(null)

// 模拟菜单数据
const mockMenus: MenuInfo[] = [
  {
    id: '1',
    title: '仪表盘',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    sort: 1,
    visible: true,
    status: 'active',
    component: '/dashboard/DashboardView',
    type: 'menu',
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: '2',
    title: '系统管理',
    path: '/system',
    icon: 'Settings',
    sort: 2,
    visible: true,
    status: 'active',
    type: 'menu',
    createTime: '2024-01-01 00:00:00',
    children: [
      {
        id: '2-1',
        title: '用户管理',
        path: '/system/users',
        icon: 'Users',
        parentId: '2',
        sort: 1,
        visible: true,
        status: 'active',
        component: '/system/users/UsersView',
        type: 'menu',
        permission: 'system:user:list',
        createTime: '2024-01-01 00:00:00'
      },
      {
        id: '2-2',
        title: '角色管理',
        path: '/system/roles',
        icon: 'Shield',
        parentId: '2',
        sort: 2,
        visible: true,
        status: 'active',
        component: '/system/roles/RolesView',
        type: 'menu',
        permission: 'system:role:list',
        createTime: '2024-01-01 00:00:00'
      }
    ]
  }
]

// 表格列配置
const columns = [
  {
    key: 'title',
    title: '菜单名称',
    dataIndex: 'title',
    render: (value: string, record: MenuInfo) => {
      const indent = record.parentId ? 'ml-6' : ''
      return h('div', { class: `flex items-center ${indent}` }, [
        record.icon && h('span', { class: 'mr-2' }, '📁'),
        value
      ])
    }
  },
  {
    key: 'path',
    title: '路径',
    dataIndex: 'path'
  },
  {
    key: 'icon',
    title: '图标',
    dataIndex: 'icon'
  },
  {
    key: 'sort',
    title: '排序',
    dataIndex: 'sort'
  },
  {
    key: 'visible',
    title: '可见性',
    dataIndex: 'visible',
    render: (value: boolean) => {
      return value 
        ? h(Badge, { variant: 'default' }, '显示')
        : h(Badge, { variant: 'secondary' }, '隐藏')
    }
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: (value: string) => {
      return value === 'active' 
        ? h(Badge, { variant: 'default' }, '启用')
        : h(Badge, { variant: 'secondary' }, '禁用')
    }
  },
  {
    key: 'type',
    title: '类型',
    dataIndex: 'type',
    render: (value: string) => {
      return value === 'menu' 
        ? h(Badge, { variant: 'outline' }, '菜单')
        : h(Badge, { variant: 'outline' }, '按钮')
    }
  }
]

// 搜索字段
const searchFields = [
  { key: 'title', label: '菜单名称', type: 'input' as const },
  { key: 'path', label: '路径', type: 'input' as const },
  { key: 'status', label: '状态', type: 'select' as const, options: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ]}
]

// 表格操作
const tableActions = [
  {
    label: '新增菜单',
    key: 'create',
    type: 'primary' as const,
    icon: Plus,
    permission: 'system:menu:create'
  }
]

// 行操作
const rowActions = [
  {
    label: '编辑',
    key: 'edit',
    icon: Edit,
    permission: 'system:menu:update'
  },
  {
    label: '显示',
    key: 'show',
    icon: Eye,
    permission: 'system:menu:update',
    disabled: (record: MenuInfo) => record.visible
  },
  {
    label: '隐藏',
    key: 'hide',
    icon: EyeOff,
    permission: 'system:menu:update',
    disabled: (record: MenuInfo) => !record.visible
  },
  {
    label: '删除',
    key: 'delete',
    type: 'danger' as const,
    icon: Trash2,
    permission: 'system:menu:delete'
  }
]

// 表单配置
const formSchema = ref<FormSchema>({
  title: '菜单信息',
  columns: 2,
  fields: [
    {
      name: 'title',
      label: '菜单名称',
      type: 'input',
      required: true,
      placeholder: '请输入菜单名称',
      rules: [
        { required: true, message: '菜单名称不能为空' }
      ]
    },
    {
      name: 'path',
      label: '路径',
      type: 'input',
      required: true,
      placeholder: '请输入菜单路径',
      rules: [
        { required: true, message: '路径不能为空' }
      ]
    },
    {
      name: 'icon',
      label: '图标',
      type: 'input',
      placeholder: '请输入图标名称'
    },
    {
      name: 'sort',
      label: '排序',
      type: 'number',
      defaultValue: 1,
      rules: [
        { required: true, message: '排序不能为空' }
      ]
    },
    {
      name: 'parentId',
      label: '父级菜单',
      type: 'select',
      placeholder: '请选择父级菜单',
      options: []
    },
    {
      name: 'component',
      label: '组件路径',
      type: 'input',
      placeholder: '请输入组件路径'
    },
    {
      name: 'type',
      label: '类型',
      type: 'radio',
      required: true,
      defaultValue: 'menu',
      options: [
        { label: '菜单', value: 'menu' },
        { label: '按钮', value: 'button' }
      ]
    },
    {
      name: 'permission',
      label: '权限标识',
      type: 'input',
      placeholder: '请输入权限标识'
    },
    {
      name: 'visible',
      label: '是否可见',
      type: 'switch',
      defaultValue: true,
      span: 2
    }
  ]
})

// 将树形数据扁平化用于表格显示
const flattenMenus = (menus: MenuInfo[]): MenuInfo[] => {
  const result: MenuInfo[] = []
  
  const traverse = (items: MenuInfo[]) => {
    items.forEach(item => {
      result.push(item)
      if (item.children) {
        traverse(item.children)
      }
    })
  }
  
  traverse(menus)
  return result
}

// 加载菜单列表
const loadMenus = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    menus.value = flattenMenus(mockMenus)
  } catch (error) {
    console.error('加载菜单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params: Record<string, any>) => {
  console.log('搜索参数:', params)
  loadMenus()
}

// 处理表格操作
const handleAction = (key: string) => {
  switch (key) {
    case 'create':
      openCreateDialog()
      break
    case 'refresh':
      loadMenus()
      break
  }
}

// 处理行操作
const handleRowAction = async (key: string, record: MenuInfo) => {
  switch (key) {
    case 'edit':
      openEditDialog(record)
      break
    case 'delete':
      await handleDelete(record)
      break
    case 'show':
      await handleToggleVisible(record, true)
      break
    case 'hide':
      await handleToggleVisible(record, false)
      break
  }
}

// 打开新增弹窗
const openCreateDialog = () => {
  dialogTitle.value = '新增菜单'
  currentMenu.value = null
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (menu: MenuInfo) => {
  dialogTitle.value = '编辑菜单'
  currentMenu.value = menu
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async (data: any) => {
  try {
    console.log('提交数据:', data)
    // 这里调用API保存数据
    dialogVisible.value = false
    loadMenus()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 删除菜单
const handleDelete = async (menu: MenuInfo) => {
  if (confirm(`确定要删除菜单 ${menu.title} 吗？`)) {
    try {
      console.log('删除菜单:', menu)
      loadMenus()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 切换菜单可见性
const handleToggleVisible = async (menu: MenuInfo, visible: boolean) => {
  try {
    console.log('切换可见性:', menu.title, visible)
    loadMenus()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 初始化
onMounted(() => {
  loadMenus()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">菜单管理</h1>
      <p class="text-muted-foreground">管理系统菜单结构和权限配置</p>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :columns="columns"
      :data="menus"
      :loading="loading"
      :search-fields="searchFields"
      :actions="tableActions"
      :row-actions="rowActions"
      @search="handleSearch"
      @action="handleAction"
      @row-action="handleRowAction"
    />

    <!-- 菜单表单弹窗 -->
    <Dialog v-model:open="dialogVisible">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{ dialogTitle }}</DialogTitle>
        </DialogHeader>
        <DynamicForm
          :schema="formSchema"
          @submit="handleSubmit"
        />
      </DialogContent>
    </Dialog>
  </div>
</template> 