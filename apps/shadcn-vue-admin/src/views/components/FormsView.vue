<script setup lang="ts">
import { ref } from 'vue'
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Switch
} from 'shadcn-vue-ui'

const email = ref('')
const name = ref('')
const message = ref('')
const category = ref('')
const newsletter = ref(false)
const notifications = ref(true)
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">表单组件</h1>
      <p class="text-muted-foreground">展示各种表单输入组件和表单布局</p>
    </div>

    <!-- Basic Form -->
    <Card>
      <CardHeader>
        <CardTitle>基本表单</CardTitle>
        <CardDescription>基本的表单输入组件</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">姓名</Label>
            <Input id="name" v-model="name" placeholder="输入您的姓名" />
          </div>
          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input id="email" v-model="email" type="email" placeholder="输入您的邮箱" />
          </div>
        </div>
        
        <div class="space-y-2">
          <Label for="category">类别</Label>
          <Select v-model="category">
            <SelectTrigger>
              <SelectValue placeholder="选择一个类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">一般</SelectItem>
              <SelectItem value="support">技术支持</SelectItem>
              <SelectItem value="billing">账单</SelectItem>
              <SelectItem value="feedback">反馈</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="message">消息</Label>
          <Textarea 
            id="message" 
            v-model="message" 
            placeholder="输入您的消息"
            rows="4"
          />
        </div>

        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <Checkbox id="newsletter" v-model:checked="newsletter" />
            <Label for="newsletter">订阅新闻通讯</Label>
          </div>
          
          <div class="flex items-center space-x-2">
            <Switch id="notifications" v-model:checked="notifications" />
            <Label for="notifications">启用通知</Label>
          </div>
        </div>

        <Button type="submit" class="w-full">提交表单</Button>
      </CardContent>
    </Card>

    <!-- Form Layout Examples -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>紧凑布局</CardTitle>
          <CardDescription>使用较小间距的紧凑表单布局</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="space-y-1">
            <Label htmlFor="compact-name" class="text-sm">姓名</Label>
            <Input id="compact-name" size="sm" placeholder="姓名" />
          </div>
          <div class="space-y-1">
            <Label htmlFor="compact-email" class="text-sm">邮箱</Label>
            <Input id="compact-email" size="sm" type="email" placeholder="邮箱" />
          </div>
          <Button size="sm" class="w-full">保存</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>验证状态</CardTitle>
          <CardDescription>显示不同验证状态的表单输入</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="space-y-1">
            <Label>有效输入</Label>
            <Input placeholder="这是有效的输入" class="border-green-500" />
          </div>
          <div class="space-y-1">
            <Label>错误输入</Label>
            <Input placeholder="这是错误的输入" class="border-red-500" />
            <p class="text-sm text-red-500">请输入有效的值</p>
          </div>
          <div class="space-y-1">
            <Label>警告输入</Label>
            <Input placeholder="这是警告的输入" class="border-yellow-500" />
            <p class="text-sm text-yellow-600">这个值可能需要确认</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 