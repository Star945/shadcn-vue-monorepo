<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shadcn-vue-ui'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-vue-next'

// 模拟数据
const stats = ref([
  {
    title: '总收入',
    value: '¥45,231.89',
    change: '+20.1% 从上月',
    icon: DollarSign
  },
  {
    title: '订阅数',
    value: '+2350',
    change: '+180.1% 从上月',
    icon: Users
  },
  {
    title: '销售额',
    value: '+12,234',
    change: '+19% 从上月',
    icon: CreditCard
  },
  {
    title: '活跃用户',
    value: '+573',
    change: '+201 自上小时',
    icon: Activity
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">仪表盘</h1>
      <p class="text-muted-foreground">欢迎使用 ShadCN Vue Admin 管理系统</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in stats" :key="stat.title">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ stat.title }}</CardTitle>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <p class="text-xs text-muted-foreground">{{ stat.change }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Placeholder -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>概览</CardTitle>
          <CardDescription>过去12个月的收入概览</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[200px] flex items-center justify-center text-muted-foreground">
            图表组件占位符
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>最近销售</CardTitle>
          <CardDescription>本月已完成 265 笔销售</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium">O</span>
              </div>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">Olivia Martin</p>
                <p class="text-sm text-muted-foreground">olivia.martin@email.com</p>
              </div>
              <div class="ml-auto font-medium">+¥1,999.00</div>
            </div>
            <div class="flex items-center">
              <div class="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium">J</span>
              </div>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">Jackson Lee</p>
                <p class="text-sm text-muted-foreground">jackson.lee@email.com</p>
              </div>
              <div class="ml-auto font-medium">+¥39.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 