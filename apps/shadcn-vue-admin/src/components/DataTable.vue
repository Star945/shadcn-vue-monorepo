<script setup lang="ts" generic="T = any">
import { ref, computed, watch } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Badge
} from 'shadcn-vue-ui'
import { Search, RefreshCw, Download, Upload, Plus, MoreHorizontal } from 'lucide-vue-next'

export interface Column {
  key: string
  title: string
  dataIndex?: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: T, index: number) => any
  slot?: string
}

export interface TableAction {
  label: string
  key: string
  type?: 'primary' | 'default' | 'danger'
  icon?: any
  permission?: string
  disabled?: (record: T) => boolean
}

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizes?: number[]
}

interface Props {
  columns: Column[]
  data: T[]
  loading?: boolean
  pagination?: PaginationConfig
  rowSelection?: boolean
  searchable?: boolean
  exportable?: boolean
  importable?: boolean
  actions?: TableAction[]
  rowActions?: TableAction[]
  searchFields?: { key: string; label: string; type?: 'input' | 'select'; options?: { label: string; value: any }[] }[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowSelection: false,
  searchable: true,
  exportable: true,
  importable: false
})

const emit = defineEmits<{
  search: [params: Record<string, any>]
  pageChange: [page: number, pageSize: number]
  action: [key: string, record?: T]
  rowAction: [key: string, record: T]
  selectionChange: [selectedRows: T[]]
  export: [params: Record<string, any>]
  import: [file: File]
}>()

// 状态
const searchParams = ref<Record<string, any>>({})
const selectedRows = ref<T[]>([])
const sortConfig = ref<{ key: string; order: 'asc' | 'desc' } | null>(null)

// 计算属性
const filteredData = computed(() => {
  let result = [...props.data]
  
  // 搜索过滤
  Object.keys(searchParams.value).forEach(key => {
    const value = searchParams.value[key]
    if (value !== undefined && value !== '') {
      result = result.filter(item => {
        const itemValue = item[key]
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }
        return itemValue === value
      })
    }
  })
  
  // 排序
  if (sortConfig.value) {
    const { key, order } = sortConfig.value
    result.sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return result
})

// 方法
const handleSearch = () => {
  emit('search', searchParams.value)
}

const handleSort = (column: Column) => {
  if (!column.sortable) return
  
  const key = column.dataIndex || column.key
  if (sortConfig.value?.key === key) {
    sortConfig.value.order = sortConfig.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value = { key, order: 'asc' }
  }
}

const handleSelectAll = (checked: boolean) => {
  selectedRows.value = checked ? [...filteredData.value] : []
  emit('selectionChange', selectedRows.value)
}

const handleSelectRow = (record: T, checked: boolean) => {
  if (checked) {
    selectedRows.value.push(record)
  } else {
    const index = selectedRows.value.findIndex(row => row === record)
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    }
  }
  emit('selectionChange', selectedRows.value)
}

const renderCell = (column: Column, record: T, index: number) => {
  const value = record[column.dataIndex || column.key]
  
  if (column.render) {
    return column.render(value, record, index)
  }
  
  return value
}

// 监听选中状态变化
watch(selectedRows, (newVal) => {
  emit('selectionChange', newVal)
}, { deep: true })
</script>

<template>
  <div class="data-table space-y-4">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <!-- 搜索 -->
        <div v-if="searchable" class="flex items-center space-x-2">
          <div v-for="field in searchFields" :key="field.key" class="flex items-center space-x-1">
            <span class="text-sm text-muted-foreground">{{ field.label }}:</span>
            <Input
              v-if="field.type === 'input' || !field.type"
              v-model="searchParams[field.key]"
              :placeholder="`请输入${field.label}`"
              class="w-32"
            />
            <Select v-else-if="field.type === 'select'" v-model="searchParams[field.key]">
              <SelectTrigger class="w-32">
                <SelectValue :placeholder="`选择${field.label}`" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button @click="handleSearch" size="sm">
            <Search class="mr-1 h-3 w-3" />
            搜索
          </Button>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- 表格操作按钮 -->
        <template v-for="action in actions" :key="action.key">
          <Button
            :variant="action.type === 'danger' ? 'destructive' : action.type === 'primary' ? 'default' : 'outline'"
            size="sm"
            @click="emit('action', action.key)"
          >
            <component v-if="action.icon" :is="action.icon" class="mr-1 h-3 w-3" />
            {{ action.label }}
          </Button>
        </template>
        
        <!-- 导入导出 -->
        <Button v-if="importable" variant="outline" size="sm" @click="emit('action', 'import')">
          <Upload class="mr-1 h-3 w-3" />
          导入
        </Button>
        <Button v-if="exportable" variant="outline" size="sm" @click="emit('export', searchParams)">
          <Download class="mr-1 h-3 w-3" />
          导出
        </Button>
        
        <Button variant="outline" size="sm" @click="emit('action', 'refresh')">
          <RefreshCw class="h-3 w-3" />
        </Button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-if="rowSelection" class="w-12">
              <Checkbox
                :checked="selectedRows.length === filteredData.length && filteredData.length > 0"
                @update:checked="handleSelectAll"
              />
            </TableHead>
            <TableHead
              v-for="column in columns"
              :key="column.key"
              :class="[
                column.align ? `text-${column.align}` : '',
                column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''
              ]"
              :style="{ width: column.width }"
              @click="handleSort(column)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.title }}</span>
                <span v-if="column.sortable && sortConfig?.key === (column.dataIndex || column.key)" class="text-xs">
                  {{ sortConfig.order === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </TableHead>
            <TableHead v-if="rowActions?.length" class="w-20 text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(record, index) in filteredData" :key="index">
            <TableCell v-if="rowSelection">
              <Checkbox
                :checked="selectedRows.includes(record)"
                @update:checked="(checked) => handleSelectRow(record, checked)"
              />
            </TableCell>
            <TableCell
              v-for="column in columns"
              :key="column.key"
              :class="column.align ? `text-${column.align}` : ''"
            >
              <slot v-if="column.slot" :name="column.slot" :record="record" :value="record[column.dataIndex || column.key]" :index="index">
                {{ renderCell(column, record, index) }}
              </slot>
              <template v-else>
                {{ renderCell(column, record, index) }}
              </template>
            </TableCell>
            <TableCell v-if="rowActions?.length" class="text-center">
              <div class="flex items-center justify-center space-x-1">
                <template v-for="action in rowActions" :key="action.key">
                  <Button
                    v-if="!action.disabled || !action.disabled(record)"
                    :variant="action.type === 'danger' ? 'destructive' : 'ghost'"
                    size="sm"
                    @click="emit('rowAction', action.key, record)"
                  >
                    <component v-if="action.icon" :is="action.icon" class="h-3 w-3" />
                    <span v-else>{{ action.label }}</span>
                  </Button>
                </template>
              </div>
            </TableCell>
          </TableRow>
          
          <!-- 空状态 -->
          <TableRow v-if="filteredData.length === 0">
            <TableCell :colspan="columns.length + (rowSelection ? 1 : 0) + (rowActions?.length ? 1 : 0)" class="text-center py-8">
              <div class="text-muted-foreground">暂无数据</div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- 分页 -->
    <div v-if="pagination" class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        共 {{ pagination.total }} 条记录，第 {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.pageSize) }} 页
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1"
          @click="emit('pageChange', pagination.page - 1, pagination.pageSize)"
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
          @click="emit('pageChange', pagination.page + 1, pagination.pageSize)"
        >
          下一页
        </Button>
      </div>
    </div>
  </div>
</template> 