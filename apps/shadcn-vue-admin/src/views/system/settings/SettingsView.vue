<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea
} from 'shadcn-vue-ui'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 系统设置数据
const systemSettings = ref({
  siteName: 'ShadCN Vue Admin',
  siteDescription: '基于 ShadCN Vue 构建的管理后台系统',
  siteKeywords: 'admin,vue3,shadcn,管理后台',
  allowRegistration: true,
  maintenanceMode: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordMinLength: 6,
  enableEmailVerification: true
})

// 外观设置
const appearanceSettings = ref({
  primaryColor: themeStore.primaryColor,
  borderRadius: '0.375', // 默认6px圆角
  animation: true,
  compactMode: false
})

// 从localStorage加载设置
const loadSettings = () => {
  try {
    const savedSystemSettings = localStorage.getItem('systemSettings')
    if (savedSystemSettings) {
      Object.assign(systemSettings.value, JSON.parse(savedSystemSettings))
    }
    
    const savedAppearanceSettings = localStorage.getItem('appearanceSettings')
    if (savedAppearanceSettings) {
      Object.assign(appearanceSettings.value, JSON.parse(savedAppearanceSettings))
    }
    
    const savedEmailSettings = localStorage.getItem('emailSettings')
    if (savedEmailSettings) {
      Object.assign(emailSettings.value, JSON.parse(savedEmailSettings))
    }
    
    const savedSecuritySettings = localStorage.getItem('securitySettings')
    if (savedSecuritySettings) {
      Object.assign(securitySettings.value, JSON.parse(savedSecuritySettings))
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// 初始化时应用当前设置
if (typeof document !== 'undefined') {
  loadSettings()
  document.documentElement.style.setProperty('--radius', `${appearanceSettings.value.borderRadius}rem`)
}

// 邮件设置
const emailSettings = ref({
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  smtpTls: true,
  fromEmail: 'noreply@example.com',
  fromName: 'ShadCN Admin'
})

// 安全设置
const securitySettings = ref({
  enableTwoFactor: false,
  enableSsoLogin: false,
  ipWhitelist: '',
  passwordExpiry: 90,
  accountLockDuration: 30,
  enableLoginLog: true
})

// 预设主题色
const presetColors = [
  { name: '默认蓝色', value: '#3b82f6' },
  { name: '天蓝色', value: '#0ea5e9' },
  { name: '绿色', value: '#22c55e' },
  { name: '紫色', value: '#8b5cf6' },
  { name: '红色', value: '#ef4444' },
  { name: '橙色', value: '#f97316' },
  { name: '粉色', value: '#ec4899' },
  { name: '青色', value: '#06b6d4' },
  { name: '深蓝色', value: '#1e40af' },
  { name: '深绿色', value: '#059669' },
  { name: '深紫色', value: '#7c3aed' },
  { name: '深红色', value: '#dc2626' }
]

// 处理主题色变更
const handlePrimaryColorChange = (color: string) => {
  appearanceSettings.value.primaryColor = color
  themeStore.setPrimaryColor(color)
}

// 处理圆角大小变更
const handleBorderRadiusChange = (radius: any) => {
  if (radius && typeof radius === 'string') {
    appearanceSettings.value.borderRadius = radius
    // 应用圆角设置到根元素
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--radius', `${radius}rem`)
    }
  }
}

// 监听主题色变化
watch(
  () => appearanceSettings.value.primaryColor,
  (newColor) => {
    if (newColor && newColor !== themeStore.primaryColor) {
      handlePrimaryColorChange(newColor)
    }
  }
)

// 监听圆角大小变化
watch(
  () => appearanceSettings.value.borderRadius,
  (newRadius) => {
    handleBorderRadiusChange(newRadius)
  }
)

// 重置外观设置
const resetAppearanceSettings = () => {
  appearanceSettings.value = {
    primaryColor: '#3b82f6',
    borderRadius: '0.375',
    animation: true,
    compactMode: false
  }
  // 应用重置后的设置
  themeStore.setPrimaryColor(appearanceSettings.value.primaryColor)
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--radius', `${appearanceSettings.value.borderRadius}rem`)
  }
}

// 保存设置
const saveSettings = async (type: string) => {
  try {
    console.log(`保存${type}设置`)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据设置类型保存对应的数据
    switch (type) {
      case '基本':
        localStorage.setItem('systemSettings', JSON.stringify(systemSettings.value))
        break
      case '外观':
        localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings.value))
        // 同时更新theme store
        themeStore.setPrimaryColor(appearanceSettings.value.primaryColor)
        break
      case '邮件':
        localStorage.setItem('emailSettings', JSON.stringify(emailSettings.value))
        break
      case '安全':
        localStorage.setItem('securitySettings', JSON.stringify(securitySettings.value))
        break
      case '高级':
        console.log('保存高级设置')
        break
    }
    
    // TODO: 这里可以显示成功提示
    console.log(`${type}设置保存成功`)
  } catch (error) {
    console.error(`${type}设置保存失败:`, error)
    // TODO: 这里可以显示错误提示
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">系统设置</h1>
      <p class="text-muted-foreground">配置系统参数和功能选项</p>
    </div>

    <!-- 设置选项卡 -->
    <Tabs default-value="general" class="space-y-6">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="general">基本设置</TabsTrigger>
        <TabsTrigger value="appearance">外观设置</TabsTrigger>
        <TabsTrigger value="email">邮件设置</TabsTrigger>
        <TabsTrigger value="security">安全设置</TabsTrigger>
        <TabsTrigger value="advanced">高级设置</TabsTrigger>
      </TabsList>

      <!-- 基本设置 -->
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>基本设置</CardTitle>
            <CardDescription>网站基本信息和核心功能配置</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="siteName">网站名称</Label>
                <Input
                  id="siteName"
                  v-model="systemSettings.siteName"
                  placeholder="输入网站名称"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="sessionTimeout">会话超时(分钟)</Label>
                <Select v-model="systemSettings.sessionTimeout">
                  <SelectTrigger>
                    <SelectValue placeholder="选择超时时间" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="15">15分钟</SelectItem>
                    <SelectItem :value="30">30分钟</SelectItem>
                    <SelectItem :value="60">1小时</SelectItem>
                    <SelectItem :value="120">2小时</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="siteDescription">网站描述</Label>
              <Textarea
                id="siteDescription"
                v-model="systemSettings.siteDescription"
                placeholder="输入网站描述"
                :rows="3"
              />
            </div>

            <div class="space-y-2">
              <Label for="siteKeywords">关键词</Label>
              <Input
                id="siteKeywords"
                v-model="systemSettings.siteKeywords"
                placeholder="输入关键词，用逗号分隔"
              />
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="maxLoginAttempts">最大登录尝试次数</Label>
                <Input
                  id="maxLoginAttempts"
                  v-model.number="systemSettings.maxLoginAttempts"
                  type="number"
                  min="1"
                  max="10"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="passwordMinLength">密码最小长度</Label>
                <Input
                  id="passwordMinLength"
                  v-model.number="systemSettings.passwordMinLength"
                  type="number"
                  min="6"
                  max="20"
                />
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>允许用户注册</Label>
                  <p class="text-sm text-muted-foreground">开启后用户可以自主注册账号</p>
                </div>
                <Switch
                  v-model:checked="systemSettings.allowRegistration"
                />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>维护模式</Label>
                  <p class="text-sm text-muted-foreground">开启后只有管理员可以访问系统</p>
                </div>
                <Switch
                  v-model:checked="systemSettings.maintenanceMode"
                />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>邮箱验证</Label>
                  <p class="text-sm text-muted-foreground">要求用户验证邮箱后才能使用</p>
                </div>
                <Switch
                  v-model:checked="systemSettings.enableEmailVerification"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <Button @click="saveSettings('基本')">保存设置</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 外观设置 -->
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>外观设置</CardTitle>
            <CardDescription>自定义系统的视觉样式和用户体验</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="primaryColor">主题色</Label>
                <div class="flex items-center space-x-3">
                  <div class="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      v-model="appearanceSettings.primaryColor"
                      type="color"
                      class="w-12 h-10 border-none p-0 cursor-pointer"
                      @change="handlePrimaryColorChange(appearanceSettings.primaryColor)"
                    />
                    <Input
                      v-model="appearanceSettings.primaryColor"
                      placeholder="#3b82f6"
                      class="w-32 font-mono text-sm"
                      @input="handlePrimaryColorChange(appearanceSettings.primaryColor)"
                    />
                  </div>
                  <div class="text-sm text-muted-foreground">
                    当前颜色预览
                  </div>
                </div>
                
                <!-- 预设主题色 -->
                <div class="space-y-3">
                  <Label class="text-sm font-medium">预设颜色</Label>
                  <div class="grid grid-cols-6 gap-3">
                    <button
                      v-for="color in presetColors"
                      :key="color.value"
                      type="button"
                      :style="{ backgroundColor: color.value }"
                      :title="color.name"
                      class="w-10 h-10 rounded-lg border-2 border-border hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                      :class="{
                        'ring-2 ring-ring ring-offset-2 scale-105': appearanceSettings.primaryColor === color.value
                      }"
                      @click="handlePrimaryColorChange(color.value)"
                    >
                      <span class="sr-only">{{ color.name }}</span>
                    </button>
                  </div>
                  <p class="text-xs text-muted-foreground">
                    点击选择预设颜色，或使用颜色选择器自定义
                  </p>
                </div>
              </div>

              <div class="space-y-3">
                <Label for="borderRadius">圆角大小</Label>
                <Select 
                  v-model="appearanceSettings.borderRadius"
                  @update:model-value="handleBorderRadiusChange"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择圆角大小" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">无圆角 (0px)</SelectItem>
                    <SelectItem value="0.25">小圆角 (4px)</SelectItem>
                    <SelectItem value="0.375">默认圆角 (6px)</SelectItem>
                    <SelectItem value="0.5">中等圆角 (8px)</SelectItem>
                    <SelectItem value="0.75">大圆角 (12px)</SelectItem>
                    <SelectItem value="1">超大圆角 (16px)</SelectItem>
                  </SelectContent>
                </Select>
                <!-- 圆角预览 -->
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-8 h-8 bg-primary border-2 border-border"
                    :style="{ borderRadius: `${appearanceSettings.borderRadius}rem` }"
                  ></div>
                  <span class="text-sm text-muted-foreground">预览效果</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>动画效果</Label>
                  <p class="text-sm text-muted-foreground">启用界面动画和过渡效果</p>
                </div>
                <Switch
                  v-model:checked="appearanceSettings.animation"
                />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>紧凑模式</Label>
                  <p class="text-sm text-muted-foreground">减少界面元素间距，显示更多内容</p>
                </div>
                <Switch
                  v-model:checked="appearanceSettings.compactMode"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label>主题模式</Label>
              <div class="flex space-x-2">
                <Button
                  variant="outline"
                  :class="{ 'bg-accent': themeStore.theme === 'light' }"
                  @click="themeStore.setTheme('light')"
                >
                  浅色模式
                </Button>
                <Button
                  variant="outline"
                  :class="{ 'bg-accent': themeStore.theme === 'dark' }"
                  @click="themeStore.setTheme('dark')"
                >
                  深色模式
                </Button>
                <Button
                  variant="outline"
                  :class="{ 'bg-accent': themeStore.theme === 'system' }"
                  @click="themeStore.setTheme('system')"
                >
                  跟随系统
                </Button>
              </div>
            </div>

            <div class="flex justify-between">
              <Button 
                variant="outline" 
                @click="resetAppearanceSettings"
              >
                重置默认
              </Button>
              <Button @click="saveSettings('外观')">保存设置</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 邮件设置 -->
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>邮件设置</CardTitle>
            <CardDescription>配置SMTP服务器用于发送系统邮件</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="smtpHost">SMTP服务器</Label>
                <Input
                  id="smtpHost"
                  v-model="emailSettings.smtpHost"
                  placeholder="smtp.example.com"
                />
              </div>

              <div class="space-y-2">
                <Label for="smtpPort">端口</Label>
                <Input
                  id="smtpPort"
                  v-model.number="emailSettings.smtpPort"
                  type="number"
                  placeholder="587"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="smtpUser">用户名</Label>
                <Input
                  id="smtpUser"
                  v-model="emailSettings.smtpUser"
                  placeholder="邮箱账号"
                />
              </div>

              <div class="space-y-2">
                <Label for="smtpPassword">密码</Label>
                <Input
                  id="smtpPassword"
                  v-model="emailSettings.smtpPassword"
                  type="password"
                  placeholder="邮箱密码或授权码"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="fromEmail">发件人邮箱</Label>
                <Input
                  id="fromEmail"
                  v-model="emailSettings.fromEmail"
                  placeholder="noreply@example.com"
                />
              </div>

              <div class="space-y-2">
                <Label for="fromName">发件人名称</Label>
                <Input
                  id="fromName"
                  v-model="emailSettings.fromName"
                  placeholder="网站名称"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label>启用TLS</Label>
                <p class="text-sm text-muted-foreground">使用安全的TLS连接</p>
              </div>
              <Switch
                v-model:checked="emailSettings.smtpTls"
              />
            </div>

            <div class="flex justify-end space-x-2">
              <Button variant="outline">测试连接</Button>
              <Button @click="saveSettings('邮件')">保存设置</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 安全设置 -->
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>安全设置</CardTitle>
            <CardDescription>配置系统安全策略和访问控制</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="passwordExpiry">密码过期天数</Label>
                <Input
                  id="passwordExpiry"
                  v-model.number="securitySettings.passwordExpiry"
                  type="number"
                  placeholder="90"
                />
              </div>

              <div class="space-y-2">
                <Label for="accountLockDuration">账户锁定时长(分钟)</Label>
                <Input
                  id="accountLockDuration"
                  v-model.number="securitySettings.accountLockDuration"
                  type="number"
                  placeholder="30"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="ipWhitelist">IP白名单</Label>
              <Textarea
                id="ipWhitelist"
                v-model="securitySettings.ipWhitelist"
                placeholder="输入允许访问的IP地址，每行一个"
                :rows="4"
              />
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>双因子认证</Label>
                  <p class="text-sm text-muted-foreground">要求用户启用2FA验证</p>
                </div>
                <Switch
                  v-model:checked="securitySettings.enableTwoFactor"
                />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>SSO登录</Label>
                  <p class="text-sm text-muted-foreground">启用第三方单点登录</p>
                </div>
                <Switch
                  v-model:checked="securitySettings.enableSsoLogin"
                />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label>登录日志</Label>
                  <p class="text-sm text-muted-foreground">记录用户登录活动</p>
                </div>
                <Switch
                  v-model:checked="securitySettings.enableLoginLog"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <Button @click="saveSettings('安全')">保存设置</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 高级设置 -->
      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>高级设置</CardTitle>
            <CardDescription>系统性能优化和开发者选项</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium mb-2">缓存设置</h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm">页面缓存</span>
                    <Switch />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm">API缓存</span>
                    <Switch />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm">静态文件缓存</span>
                    <Switch />
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium mb-2">开发者选项</h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm">调试模式</span>
                    <Switch />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm">API文档</span>
                    <Switch />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm">错误详情</span>
                    <Switch />
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium mb-2">数据库</h4>
                <div class="space-x-2">
                  <Button variant="outline">优化表</Button>
                  <Button variant="outline">清理日志</Button>
                  <Button variant="outline">备份数据</Button>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium mb-2">系统信息</h4>
                <div class="text-sm space-y-1 text-muted-foreground">
                  <p>系统版本: v1.0.0</p>
                  <p>Vue版本: v3.5.17</p>
                  <p>构建时间: 2025-01-03 10:30:00</p>
                  <p>运行环境: Development</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <Button @click="saveSettings('高级')">保存设置</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template> 