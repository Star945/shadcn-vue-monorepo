<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle } from 'shadcn-vue-ui'
import { Plus, Edit, Trash2, Shield, Key, Users } from 'lucide-vue-next'
import DataTable from '@/components/DataTable.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import type { FormSchema } from '@/components/DynamicForm.vue'

export interface PermissionInfo {
  id: string
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  resource: string
  description?: string
  parentId?: string
  status: 'active' | 'inactive'
  createTime: string
  children?: PermissionInfo[]
}

// 状态
const loading = ref(false)
const permissions = ref<PermissionInfo[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentPermission = ref<PermissionInfo | null>(null)

// 模拟权限数据
const mockPermissions: PermissionInfo[] = [
  {
    id: '1',
    name: '系统管理',
    code: 'system',
    type: 'menu',
    resource: '/system',
    description: '系统管理模块',
    status: 'active',
    createTime: '2024-01-01 00:00:00',
    children: [
      {
        id: '1-1',
        name: '用户管理',
        code: 'system:user',
        type: 'menu',
        resource: '/system/users',
        parentId: '1',
        status: 'active',
        createTime: '2024-01-01 00:00:00',
        children: [
          {
            id: '1-1-1',
            name: '查看用户',
            code: 'system:user:list',
            type: 'api',
            resource: 'GET:/api/users',
            parentId: '1-1',
            status: 'active',
            createTime: '2024-01-01 00:00:00'
          },
          {
            id: '1-1-2',
            name: '创建用户',
            code: 'system:user:create',
            type: 'button',
            resource: 'user-create-btn',
            parentId: '1-1',
            status: 'active',
            createTime: '2024-01-01 00:00:00'
          },
          {
            id: '1-1-3',
            name: '编辑用户',
            code: 'system:user:update',
            type: 'button',
            resource: 'user-edit-btn',
            parentId: '1-1',
            status: 'active',
            createTime: '2024-01-01 00:00:00'
          },
          {
            id: '1-1-4',
            name: '删除用户',
            code: 'system:user:delete',
            type: 'button',
            resource: 'user-delete-btn',
            parentId: '1-1',
            status: 'active',
            createTime: '2024-01-01 00:00:00'
          }
        ]
      },
      {
        id: '1-2',
        name: '角色管理',
        code: 'system:role',
        type: 'menu',
        resource: '/system/roles',
        parentId: '1',
        status: 'active',
        createTime: '2024-01-01 00:00:00',
        children: [
          {
            id: '1-2-1',
            name: '查看角色',
            code: 'system:role:list',
            type: 'api',
            resource: 'GET:/api/roles',
            parentId: '1-2',
            status: 'active',
            createTime: '2024-01-01 00:00:00'
          },
          {
            id: '1-2-2',
            name: '创建角色',
            code: 'system:role:create',
            type: 'button',
            resource: 'role-create-btn',
            parentId: '1-2',
            status: 'active',
            createTime: '2024-01-01 00:00:00'
          }
        ]
      }
    ]
  }
]

// 表格列配置
const columns = [
  {
    key: 'name',
    title: '权限名称',
    dataIndex: 'name',
    render: (value: string, record: PermissionInfo) => {
      const getIndent = (id: string): number => {
        const parts = id.split('-')
        return (parts.length - 1) * 20
      }
      const indent = getIndent(record.id)
      return h('div', { 
        style: { paddingLeft: `${indent}px` },
        class: 'flex items-center'
      }, [
        h('span', { class: 'mr-2' }, record.type === 'menu' ? '📁' : record.type === 'button' ? '🔘' : '🔗'),
        value
      ])
    }
  },
  {
    key: 'code',
    title: '权限编码',
    dataIndex: 'code'
  },
  {
    key: 'type',
    title: '类型',
    dataIndex: 'type',
    render: (value: string) => {
      const config = {
        menu: { text: '菜单', variant: 'default' },
        button: { text: '按钮', variant: 'outline' },
        api: { text: 'API', variant: 'secondary' }
      }
      const { text, variant } = config[value as keyof typeof config]
      return h(Badge, { variant: variant as any }, text)
    }
  },
  {
    key: 'resource',
    title: '资源标识',
    dataIndex: 'resource'
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
    key: 'createTime',
    title: '创建时间',
    dataIndex: 'createTime'
  }
]

// 搜索字段
const searchFields = [
  { key: 'name', label: '权限名称', type: 'input' as const },
  { key: 'code', label: '权限编码', type: 'input' as const },
  { key: 'type', label: '类型', type: 'select' as const, options: [
    { label: '菜单', value: 'menu' },
    { label: '按钮', value: 'button' },
    { label: 'API', value: 'api' }
  ]},
  { key: 'status', label: '状态', type: 'select' as const, options: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ]}
]

// 表格操作
const tableActions = [
  {
    label: '新增权限',
    key: 'create',
    type: 'primary' as const,
    icon: Plus,
    permission: 'system:permission:create'
  }
]

// 行操作
const rowActions = [
  {
    label: '编辑',
    key: 'edit',
    icon: Edit,
    permission: 'system:permission:update'
  },
  {
    label: '删除',
    key: 'delete',
    type: 'danger' as const,
    icon: Trash2,
    permission: 'system:permission:delete'
  }
]

// 表单配置
const formSchema = ref<FormSchema>({
  title: '权限信息',
  columns: 2,
  fields: [
    {
      name: 'name',
      label: '权限名称',
      type: 'input',
      required: true,
      placeholder: '请输入权限名称',
      rules: [
        { required: true, message: '权限名称不能为空' }
      ]
    },
    {
      name: 'code',
      label: '权限编码',
      type: 'input',
      required: true,
      placeholder: '请输入权限编码',
      rules: [
        { required: true, message: '权限编码不能为空' },
        { pattern: /^[a-z:]+$/, message: '权限编码只能包含小写字母和冒号' }
      ]
    },
    {
      name: 'type',
      label: '权限类型',
      type: 'radio',
      required: true,
      defaultValue: 'menu',
      options: [
        { label: '菜单', value: 'menu' },
        { label: '按钮', value: 'button' },
        { label: 'API', value: 'api' }
      ]
    },
    {
      name: 'resource',
      label: '资源标识',
      type: 'input',
      required: true,
      placeholder: '请输入资源标识',
      rules: [
        { required: true, message: '资源标识不能为空' }
      ]
    },
    {
      name: 'parentId',
      label: '父级权限',
      type: 'select',
      placeholder: '请选择父级权限',
      options: []
    },
    {
      name: 'status',
      label: '状态',
      type: 'radio',
      defaultValue: 'active',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    {
      name: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入权限描述',
      span: 2,
      props: { rows: 3 }
    }
  ]
})

// 将树形数据扁平化用于表格显示
const flattenPermissions = (permissions: PermissionInfo[]): PermissionInfo[] => {
  const result: PermissionInfo[] = []
  
  const traverse = (items: PermissionInfo[]) => {
    items.forEach(item => {
      result.push(item)
      if (item.children) {
        traverse(item.children)
      }
    })
  }
  
  traverse(permissions)
  return result
}

// 加载权限列表
const loadPermissions = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    permissions.value = flattenPermissions(mockPermissions)
  } catch (error) {
    console.error('加载权限列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params: Record<string, any>) => {
  console.log('搜索参数:', params)
  loadPermissions()
}

// 处理表格操作
const handleAction = (key: string) => {
  switch (key) {
    case 'create':
      openCreateDialog()
      break
    case 'refresh':
      loadPermissions()
      break
  }
}

// 处理行操作
const handleRowAction = async (key: string, record: PermissionInfo) => {
  switch (key) {
    case 'edit':
      openEditDialog(record)
      break
    case 'delete':
      await handleDelete(record)
      break
  }
}

// 打开新增弹窗
const openCreateDialog = () => {
  dialogTitle.value = '新增权限'
  currentPermission.value = null
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (permission: PermissionInfo) => {
  dialogTitle.value = '编辑权限'
  currentPermission.value = permission
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async (data: any) => {
  try {
    console.log('提交数据:', data)
    // 这里调用API保存数据
    dialogVisible.value = false
    loadPermissions()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 删除权限
const handleDelete = async (permission: PermissionInfo) => {
  if (confirm(`确定要删除权限 ${permission.name} 吗？`)) {
    try {
      console.log('删除权限:', permission)
      loadPermissions()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 初始化
onMounted(() => {
  loadPermissions()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">权限管理</h1>
      <p class="text-muted-foreground">管理系统权限配置和资源访问控制</p>
    </div>

    <!-- 统计信息 -->
    <div class="grid gap-4 md:grid-cols-4">
      <div class="rounded-lg border p-4">
        <div class="flex items-center gap-2">
          <Shield class="h-4 w-4 text-blue-500" />
          <span class="text-sm font-medium">总权限数</span>
        </div>
        <div class="mt-2 text-2xl font-bold">{{ permissions.length }}</div>
      </div>
      
      <div class="rounded-lg border p-4">
        <div class="flex items-center gap-2">
          <Key class="h-4 w-4 text-green-500" />
          <span class="text-sm font-medium">菜单权限</span>
        </div>
        <div class="mt-2 text-2xl font-bold">{{ permissions.filter(p => p.type === 'menu').length }}</div>
      </div>
      
      <div class="rounded-lg border p-4">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-orange-500" />
          <span class="text-sm font-medium">按钮权限</span>
        </div>
        <div class="mt-2 text-2xl font-bold">{{ permissions.filter(p => p.type === 'button').length }}</div>
      </div>
      
      <div class="rounded-lg border p-4">
        <div class="flex items-center gap-2">
          <Shield class="h-4 w-4 text-purple-500" />
          <span class="text-sm font-medium">API权限</span>
        </div>
        <div class="mt-2 text-2xl font-bold">{{ permissions.filter(p => p.type === 'api').length }}</div>
      </div>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :columns="columns"
      :data="permissions"
      :loading="loading"
      :search-fields="searchFields"
      :actions="tableActions"
      :row-actions="rowActions"
      @search="handleSearch"
      @action="handleAction"
      @row-action="handleRowAction"
    />

    <!-- 权限表单弹窗 -->
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