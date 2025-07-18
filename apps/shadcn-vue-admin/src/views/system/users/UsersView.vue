<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle } from 'shadcn-vue-ui'
import { Plus, Edit, Trash2, Key, UserCheck, UserX } from 'lucide-vue-next'
import DataTable from '@/components/DataTable.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import type { User, UserListParams, CreateUserParams, UpdateUserParams } from '@/api/user'
import { getUserList, createUser, updateUser, deleteUser, resetPassword, toggleUserStatus } from '@/api/user'
import { getAllRoles } from '@/api/role'
import type { FormSchema } from '@/components/DynamicForm.vue'

// 状态
const loading = ref(false)
const users = ref<User[]>([])
const total = ref(0)
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 弹窗状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentUser = ref<User | null>(null)
const formData = ref<CreateUserParams | UpdateUserParams>({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  roleIds: [],
  department: ''
})

// 表格列配置
const columns = [
  {
    key: 'username',
    title: '用户名',
    dataIndex: 'username',
    sortable: true
  },
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    sortable: true
  },
  {
    key: 'email',
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    key: 'phone',
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: (value: string) => {
      return value === 'active' 
        ? h(Badge, { variant: 'default' }, '正常')
        : h(Badge, { variant: 'secondary' }, '禁用')
    }
  },
  {
    key: 'roles',
    title: '角色',
    dataIndex: 'roles',
    render: (value: string[]) => {
      return value.map(role => h(Badge, { variant: 'outline', class: 'mr-1' }, role)).join(' ')
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
  { key: 'username', label: '用户名', type: 'input' as const },
  { key: 'name', label: '姓名', type: 'input' as const },
  { key: 'status', label: '状态', type: 'select' as const, options: [
    { label: '正常', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ]}
]

// 表格操作
const tableActions = [
  {
    label: '新增用户',
    key: 'create',
    type: 'primary' as const,
    icon: Plus,
    permission: 'system:user:create'
  }
]

// 行操作
const rowActions = [
  {
    label: '编辑',
    key: 'edit',
    icon: Edit,
    permission: 'system:user:update'
  },
  {
    label: '重置密码',
    key: 'resetPassword',
    icon: Key,
    permission: 'system:user:resetPassword'
  },
  {
    label: '启用',
    key: 'enable',
    icon: UserCheck,
    permission: 'system:user:status',
    disabled: (record: User) => record.status === 'active'
  },
  {
    label: '禁用',
    key: 'disable',
    icon: UserX,
    permission: 'system:user:status',
    disabled: (record: User) => record.status === 'inactive'
  },
  {
    label: '删除',
    key: 'delete',
    type: 'danger' as const,
    icon: Trash2,
    permission: 'system:user:delete'
  }
]

// 表单配置
const formSchema = ref<FormSchema>({
  title: '用户信息',
  columns: 2,
  fields: [
    {
      name: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      placeholder: '请输入用户名',
      rules: [
        { required: true, message: '用户名不能为空' },
        { min: 3, max: 20, message: '用户名长度为3-20个字符' }
      ]
    },
    {
      name: 'name',
      label: '姓名',
      type: 'input',
      required: true,
      placeholder: '请输入姓名',
      rules: [
        { required: true, message: '姓名不能为空' }
      ]
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      required: true,
      placeholder: '请输入邮箱',
      rules: [
        { required: true, message: '邮箱不能为空' },
        { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }
      ]
    },
    {
      name: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号',
      rules: [
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
      ]
    },
    {
      name: 'password',
      label: '密码',
      type: 'password',
      required: true,
      placeholder: '请输入密码',
      visible: (formData) => !formData.id, // 编辑时不显示密码字段
      rules: [
        { required: true, message: '密码不能为空' },
        { min: 6, message: '密码长度不能少于6个字符' }
      ]
    },
    {
      name: 'roleIds',
      label: '角色',
      type: 'select',
      required: true,
      placeholder: '请选择角色',
      options: [],
      props: { multiple: true }
    },
    {
      name: 'department',
      label: '部门',
      type: 'input',
      placeholder: '请输入部门',
      span: 2
    }
  ]
})

// 加载用户列表
const loadUsers = async (params: UserListParams = {}) => {
  loading.value = true
  try {
    const response = await getUserList({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...params
    })
    users.value = response.list
    pagination.value.total = response.total
  } catch (error) {
    console.error('加载用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载角色选项
const loadRoles = async () => {
  try {
    const roles = await getAllRoles()
    const roleField = formSchema.value.fields.find(f => f.name === 'roleIds')
    if (roleField) {
      roleField.options = roles.map(role => ({
        label: role.name,
        value: role.id
      }))
    }
  } catch (error) {
    console.error('加载角色列表失败:', error)
  }
}

// 处理搜索
const handleSearch = (params: Record<string, any>) => {
  pagination.value.page = 1
  loadUsers(params)
}

// 处理分页
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.page = page
  pagination.value.pageSize = pageSize
  loadUsers()
}

// 处理表格操作
const handleAction = (key: string) => {
  switch (key) {
    case 'create':
      openCreateDialog()
      break
    case 'refresh':
      loadUsers()
      break
  }
}

// 处理行操作
const handleRowAction = async (key: string, record: User) => {
  switch (key) {
    case 'edit':
      openEditDialog(record)
      break
    case 'delete':
      await handleDelete(record)
      break
    case 'resetPassword':
      await handleResetPassword(record)
      break
    case 'enable':
      await handleToggleStatus(record, 'active')
      break
    case 'disable':
      await handleToggleStatus(record, 'inactive')
      break
  }
}

// 打开新增弹窗
const openCreateDialog = () => {
  dialogTitle.value = '新增用户'
  currentUser.value = null
  formData.value = {
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    roleIds: [],
    department: ''
  }
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (user: User) => {
  dialogTitle.value = '编辑用户'
  currentUser.value = user
  formData.value = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    roleIds: user.roles,
    department: user.department || ''
  }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async (data: any) => {
  try {
    if (currentUser.value) {
      // 编辑
      await updateUser(data as UpdateUserParams)
      console.log('用户更新成功')
    } else {
      // 新增
      await createUser(data as CreateUserParams)
      console.log('用户创建成功')
    }
    dialogVisible.value = false
    loadUsers()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 删除用户
const handleDelete = async (user: User) => {
  if (confirm(`确定要删除用户 ${user.name} 吗？`)) {
    try {
      await deleteUser(user.id)
      console.log('用户删除成功')
      loadUsers()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 重置密码
const handleResetPassword = async (user: User) => {
  const newPassword = prompt('请输入新密码:')
  if (newPassword) {
    try {
      await resetPassword(user.id, newPassword)
      console.log('密码重置成功')
    } catch (error) {
      console.error('密码重置失败:', error)
    }
  }
}

// 切换用户状态
const handleToggleStatus = async (user: User, status: 'active' | 'inactive') => {
  try {
    await toggleUserStatus(user.id, status)
    console.log('状态更新成功')
    loadUsers()
  } catch (error) {
    console.error('状态更新失败:', error)
  }
}

// 初始化
onMounted(() => {
  loadUsers()
  loadRoles()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">用户管理</h1>
      <p class="text-muted-foreground">管理系统用户信息和权限</p>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :columns="columns"
      :data="users"
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

    <!-- 用户表单弹窗 -->
    <Dialog v-model:open="dialogVisible">
      <DialogContent class="max-w-2xl">
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