<script setup lang="ts">
import { ref } from 'vue'
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Input
} from 'shadcn-vue-ui'
import { Search, MoreHorizontal, ArrowUpDown } from 'lucide-vue-next'

// 模拟数据
const users = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: '编辑',
    status: '活跃',
    joinDate: '2024-02-20'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: '用户',
    status: '非活跃',
    joinDate: '2024-03-10'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: '编辑',
    status: '活跃',
    joinDate: '2024-03-25'
  }
])

const searchQuery = ref('')

const getStatusVariant = (status: string) => {
  return status === '活跃' ? 'default' : 'secondary'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">表格组件</h1>
      <p class="text-muted-foreground">展示数据表格和相关功能</p>
    </div>

    <!-- Data Table -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>用户列表</CardTitle>
            <CardDescription>管理系统中的用户信息</CardDescription>
          </div>
          <Button>
            添加用户
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <!-- Search -->
        <div class="flex items-center space-x-2 py-4">
          <Search class="h-4 w-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="搜索用户..."
            class="max-w-sm"
          />
        </div>

        <!-- Table -->
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]">
                  <Button variant="ghost" class="h-8 data-[state=open]:bg-accent">
                    ID
                    <ArrowUpDown class="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" class="h-8 data-[state=open]:bg-accent">
                    姓名
                    <ArrowUpDown class="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>加入日期</TableHead>
                <TableHead class="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in users" :key="user.id">
                <TableCell class="font-medium">{{ user.id }}</TableCell>
                <TableCell>{{ user.name }}</TableCell>
                <TableCell>{{ user.email }}</TableCell>
                <TableCell>{{ user.role }}</TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(user.status)">
                    {{ user.status }}
                  </Badge>
                </TableCell>
                <TableCell>{{ user.joinDate }}</TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between space-x-2 py-4">
          <div class="text-sm text-muted-foreground">
            显示 1-4 条，共 4 条记录
          </div>
          <div class="space-x-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm" disabled>
              下一页
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Simple Tables -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>简单表格</CardTitle>
          <CardDescription>基本的表格展示</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>产品</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>产品 A</TableCell>
                <TableCell>¥99.00</TableCell>
                <TableCell>
                  <Badge variant="default">有库存</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>产品 B</TableCell>
                <TableCell>¥199.00</TableCell>
                <TableCell>
                  <Badge variant="secondary">缺货</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>产品 C</TableCell>
                <TableCell>¥299.00</TableCell>
                <TableCell>
                  <Badge variant="default">有库存</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>紧凑表格</CardTitle>
          <CardDescription>使用较小间距的紧凑表格</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="h-8">名称</TableHead>
                <TableHead class="h-8">值</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell class="py-1">CPU</TableCell>
                <TableCell class="py-1">85%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="py-1">内存</TableCell>
                <TableCell class="py-1">62%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="py-1">磁盘</TableCell>
                <TableCell class="py-1">34%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="py-1">网络</TableCell>
                <TableCell class="py-1">12%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 