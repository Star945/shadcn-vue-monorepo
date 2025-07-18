<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label
} from 'shadcn-vue-ui'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  // 这里添加实际的登录逻辑
  // 临时直接跳转到仪表盘
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <Card>
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl text-center">登录</CardTitle>
          <CardDescription class="text-center">
            输入您的邮箱和密码以访问管理系统
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">邮箱</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="password">密码</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="输入密码"
                required
              />
            </div>
            <Button type="submit" class="w-full">
              登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template> 