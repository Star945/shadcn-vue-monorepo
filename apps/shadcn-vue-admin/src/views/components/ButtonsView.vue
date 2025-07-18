<script setup lang="ts">
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'shadcn-vue-ui'
import { Mail, Download, Plus, Heart } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">按钮组件</h1>
      <p class="text-muted-foreground">展示不同样式和状态的按钮组件</p>
    </div>

    <!-- Button Variants -->
    <Card>
      <CardHeader>
        <CardTitle>按钮变体</CardTitle>
        <CardDescription>不同样式的按钮变体</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Button Sizes -->
    <Card>
      <CardHeader>
        <CardTitle>按钮尺寸</CardTitle>
        <CardDescription>不同大小的按钮</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus class="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Buttons with Icons -->
    <Card>
      <CardHeader>
        <CardTitle>带图标的按钮</CardTitle>
        <CardDescription>包含图标的按钮组合</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button>
            <Mail class="mr-2 h-4 w-4" />
            发送邮件
          </Button>
          <Button variant="outline">
            <Download class="mr-2 h-4 w-4" />
            下载
          </Button>
          <Button variant="destructive">
            <Heart class="mr-2 h-4 w-4" />
            喜欢
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Loading and Disabled States -->
    <Card>
      <CardHeader>
        <CardTitle>按钮状态</CardTitle>
        <CardDescription>加载和禁用状态的按钮</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button disabled>禁用按钮</Button>
          <Button variant="outline" disabled>禁用轮廓</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 