<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle } from 'shadcn-vue-ui'
import { Plus, Edit, Trash2, Shield } from 'lucide-vue-next'
import DataTable from '@/components/DataTable.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import type { Role, RoleListParams, CreateRoleParams, UpdateRoleParams } from '@/api/role'
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role'
import type { FormSchema } from '@/components/DynamicForm.vue'

// 状态
const loading = ref(false)
const roles = ref<Role[]>([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 弹窗状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRole = ref<Role | null>(null)
const formData = ref<CreateRoleParams | UpdateRoleParams>({
  name: '',
  code: '',
  description: '',
  permissions: []
})

// 表格列配置
const columns = [
  {
    key: 'name',
    title: '角色名称',
    dataIndex: 'name',
    sortable: true
  },
  {
    key: 'code',
    title: '角色编码',
    dataIndex: 'code',
    sortable: true
  },
  {
    key: 'description',
    title: '描述',
    dataIndex: 'description'
  },
  {
    key: 'permissions',
    title: '权限数量',
    dataIndex: 'permissions',
    render: (value: string[]) => {
      return h(Badge, { variant: 'outline' }, `${value.length} 个权限`)
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
    key: 'createTime',
    title: '创建时间',
    dataIndex: 'createTime'
  }
]

// 搜索字段
const searchFields = [
  { key: 'name', label: '角色名称', type: 'input' as const },
  { key: 'code', label: '角色编码', type: 'input' as const },
  { key: 'status', label: '状态', type: 'select' as const, options: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ]}
]

// 表格操作
const tableActions = [
  {
    label: '新增角色',
    key: 'create',
    type: 'primary' as const,
    icon: Plus,
    permission: 'system:role:create'
  }
]

// 行操作
const rowActions = [
  {
    label: '编辑',
    key: 'edit',
    icon: Edit,
    permission: 'system:role:update'
  },
  {
    label: '权限',
    key: 'permission',
    icon: Shield,
    permission: 'system:role:permission'
  },
  {
    label: '删除',
    key: 'delete',
    type: 'danger' as const,
    icon: Trash2,
    permission: 'system:role:delete'
  }
]

// 表单配置
const formSchema = ref<FormSchema>({
  title: '角色信息',
  columns: 1,
  fields: [
    {
      name: 'name',
      label: '角色名称',
      type: 'input',
      required: true,
      placeholder: '请输入角色名称',
      rules: [
        { required: true, message: '角色名称不能为空' },
        { min: 2, max: 50, message: '角色名称长度为2-50个字符' }
      ]
    },
    {
      name: 'code',
      label: '角色编码',
      type: 'input',
      required: true,
      placeholder: '请输入角色编码',
      rules: [
        { required: true, message: '角色编码不能为空' },
        { pattern: /^[A-Z_]+$/, message: '角色编码只能包含大写字母和下划线' }
      ]
    },
    {
      name: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入角色描述',
      props: { rows: 3 }
    }
  ]
})

// 加载角色列表
const loadRoles = async (params: RoleListParams = {}) => {
  loading.value = true
  try {
    const response = await getRoleList({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...params
    })
    roles.value = response.list
    pagination.value.total = response.total
  } catch (error) {
    console.error('加载角色列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params: Record<string, any>) => {
  pagination.value.page = 1
  loadRoles(params)
}

// 处理分页
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.page = page
  pagination.value.pageSize = pageSize
  loadRoles()
}

// 处理表格操作
const handleAction = (key: string) => {
  switch (key) {
    case 'create':
      openCreateDialog()
      break
    case 'refresh':
      loadRoles()
      break
  }
}

// 处理行操作
const handleRowAction = async (key: string, record: Role) => {
  switch (key) {
    case 'edit':
      openEditDialog(record)
      break
    case 'delete':
      await handleDelete(record)
      break
    case 'permission':
      handleManagePermission(record)
      break
  }
}

// 打开新增弹窗
const openCreateDialog = () => {
  dialogTitle.value = '新增角色'
  currentRole.value = null
  formData.value = {
    name: '',
    code: '',
    description: '',
    permissions: []
  }
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (role: Role) => {
  dialogTitle.value = '编辑角色'
  currentRole.value = role
  formData.value = {
    id: role.id,
    name: role.name,
    code: role.code,
    description: role.description || '',
    permissions: role.permissions
  }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async (data: any) => {
  try {
    if (currentRole.value) {
      // 编辑
      await updateRole(data as UpdateRoleParams)
      console.log('角色更新成功')
    } else {
      // 新增
      await createRole(data as CreateRoleParams)
      console.log('角色创建成功')
    }
    dialogVisible.value = false
    loadRoles()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 删除角色
const handleDelete = async (role: Role) => {
  if (confirm(`确定要删除角色 ${role.name} 吗？`)) {
    try {
      await deleteRole(role.id)
      console.log('角色删除成功')
      loadRoles()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 管理权限
const handleManagePermission = (role: Role) => {
  console.log('管理权限:', role)
  // 这里可以打开权限管理弹窗
}

// 初始化
onMounted(() => {
  loadRoles()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">角色管理</h1>
      <p class="text-muted-foreground">管理系统角色和权限分配</p>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :columns="columns"
      :data="roles"
      :loading="loading"
      :pagination="pagination"
      :search-fields="searchFields"
      :actions="tableActions"
      :row-actions="rowActions"
      @search="handleSearch"
      @page-change="handlePageChange"
      @action="handleAction"
      @row-action="handleRowAction"
    />

    <!-- 角色表单弹窗 -->
    <Dialog v-model:open="dialogVisible">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ dialogTitle }}</DialogTitle>
        </DialogHeader>
        <DynamicForm
          :schema="formSchema"
          :model-value="formData"
          @submit="handleSubmit"
        />
      </DialogContent>
    </Dialog>
  </div>
</template> 