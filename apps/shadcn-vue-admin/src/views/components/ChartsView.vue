<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shadcn-vue-ui'

// 模拟图表数据
const chartData = ref({
  sales: [
    { month: '1月', value: 2400 },
    { month: '2月', value: 1398 },
    { month: '3月', value: 9800 },
    { month: '4月', value: 3908 },
    { month: '5月', value: 4800 },
    { month: '6月', value: 3800 }
  ],
  userStats: {
    total: 12580,
    active: 8420,
    new: 1240
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">图表组件</h1>
      <p class="text-muted-foreground">展示各种数据可视化图表组件</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">总用户数</CardTitle>
          <div class="h-4 w-4 rounded bg-blue-500"></div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ chartData.userStats.total.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">比上月增长 +20.1%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">活跃用户</CardTitle>
          <div class="h-4 w-4 rounded bg-green-500"></div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ chartData.userStats.active.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">比上月增长 +15.3%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">新增用户</CardTitle>
          <div class="h-4 w-4 rounded bg-orange-500"></div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ chartData.userStats.new.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">比上月增长 +8.2%</p>
        </CardContent>
      </Card>
    </div>

    <!-- 图表区域 -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- 销售趋势图 -->
      <Card>
        <CardHeader>
          <CardTitle>销售趋势</CardTitle>
          <CardDescription>过去6个月的销售数据走势</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center border rounded-lg bg-muted/50">
            <div class="text-center space-y-2">
              <div class="text-4xl">📊</div>
              <p class="text-sm text-muted-foreground">图表组件占位符</p>
              <p class="text-xs text-muted-foreground">可集成 ECharts、Chart.js 等图表库</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 用户分布饼图 -->
      <Card>
        <CardHeader>
          <CardTitle>用户分布</CardTitle>
          <CardDescription>不同地区用户分布情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center border rounded-lg bg-muted/50">
            <div class="text-center space-y-2">
              <div class="text-4xl">🥧</div>
              <p class="text-sm text-muted-foreground">饼图组件占位符</p>
              <p class="text-xs text-muted-foreground">支持交互式饼图和环形图</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 实时数据图 -->
      <Card>
        <CardHeader>
          <CardTitle>实时监控</CardTitle>
          <CardDescription>系统实时数据监控</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center border rounded-lg bg-muted/50">
            <div class="text-center space-y-2">
              <div class="text-4xl">📈</div>
              <p class="text-sm text-muted-foreground">实时图表占位符</p>
              <p class="text-xs text-muted-foreground">支持WebSocket实时数据更新</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 热力图 -->
      <Card>
        <CardHeader>
          <CardTitle>访问热力图</CardTitle>
          <CardDescription>用户访问热力分布</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center border rounded-lg bg-muted/50">
            <div class="text-center space-y-2">
              <div class="text-4xl">🔥</div>
              <p class="text-sm text-muted-foreground">热力图组件占位符</p>
              <p class="text-xs text-muted-foreground">可视化用户行为热点</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 数据表格图表 -->
    <Card>
      <CardHeader>
        <CardTitle>数据明细</CardTitle>
        <CardDescription>详细的数据表格展示</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="grid grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg text-sm font-medium">
            <div>月份</div>
            <div>销售额</div>
            <div>订单数</div>
            <div>客户数</div>
            <div>转化率</div>
            <div>增长率</div>
          </div>
          <div v-for="(item, index) in chartData.sales" :key="index" class="grid grid-cols-6 gap-4 p-4 border rounded-lg text-sm">
            <div>{{ item.month }}</div>
            <div>¥{{ item.value.toLocaleString() }}</div>
            <div>{{ Math.floor(item.value / 100) }}</div>
            <div>{{ Math.floor(item.value / 200) }}</div>
            <div>{{ (Math.random() * 10 + 2).toFixed(1) }}%</div>
            <div class="text-green-600">+{{ (Math.random() * 20 + 5).toFixed(1) }}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 