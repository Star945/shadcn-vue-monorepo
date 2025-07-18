# ShadCN Vue Admin

一个基于 **shadcn-vue** 构建的现代化管理后台系统模板，采用最新的前端技术栈，提供企业级的开发体验。

## ✨ 项目特色

### 🎨 设计哲学
- **无头组件设计** - 基于 reka-ui 提供底层交互逻辑，样式完全可控
- **原子化CSS** - 使用 TailwindCSS 4.x 最新版本，性能和开发体验俱佳
- **组合式架构** - 小粒度可组合组件，灵活度极高
- **类型安全** - 完整的 TypeScript 支持和变体系统

### 🔧 技术栈
- **Vue 3.5+** - 最新的 Vue 版本，Composition API
- **TypeScript** - 类型安全的开发体验
- **Vite** - 极速的开发构建工具
- **TailwindCSS 4.x** - 最新的原子化 CSS 框架
- **Reka UI** - Vue 版本的 Radix UI 无头组件库
- **Pinia** - 现代化的状态管理
- **Vue Router** - 官方路由解决方案
- **shadcn-vue** - 基于 Radix UI 的高质量组件库

### 📦 核心功能

#### 🔐 权限管理系统
- **RBAC权限模型** - 基于角色的访问控制
- **用户管理** - 完整的用户CRUD操作、状态管理、密码重置
- **角色管理** - 角色创建、权限分配、状态控制
- **菜单管理** - 动态菜单配置、层级管理、可见性控制
- **权限管理** - 细粒度权限控制(菜单/按钮/API)

#### 🎯 核心组件
- **DataTable** - 功能完整的数据表格组件
  - 搜索、排序、分页
  - 行选择、批量操作
  - 自定义列渲染
  - 导入导出功能
- **DynamicForm** - 基于JSON Schema的动态表单
  - 多种字段类型支持
  - 表单验证和错误处理
  - 自定义布局和样式
  - 条件显示逻辑
- **FileUpload** - 文件上传组件
  - 拖拽上传支持
  - 多种预览模式
  - 进度显示
  - 文件类型和大小验证

#### 🎨 界面特性
- **响应式布局** - 桌面端和移动端完美适配
- **主题切换** - 支持亮色/暗色/系统主题
- **动态菜单** - 基于权限的动态菜单系统
- **面包屑导航** - 自动生成的导航链
- **状态持久化** - 用户偏好和登录状态保持

#### ⚙️ 系统设置
- **基本设置** - 网站信息、会话配置、安全策略
- **外观设置** - 主题色、圆角、动画效果配置
- **邮件设置** - SMTP服务器配置
- **安全设置** - 双因子认证、IP白名单、密码策略
- **高级设置** - 缓存配置、开发者选项、系统信息

## 📁 项目结构

```
apps/shadcn-vue-admin/
├── src/
│   ├── api/                    # API接口定义
│   │   ├── auth.ts            # 认证相关API
│   │   ├── user.ts            # 用户管理API
│   │   ├── role.ts            # 角色管理API
│   │   └── request.ts         # 请求封装
│   ├── components/            # 通用组件
│   │   ├── DataTable.vue      # 数据表格组件
│   │   ├── DynamicForm.vue    # 动态表单组件
│   │   └── FileUpload.vue     # 文件上传组件
│   ├── layouts/               # 布局组件
│   │   └── BasicLayout.vue    # 基础布局
│   ├── router/                # 路由配置
│   │   └── index.ts          # 路由定义
│   ├── stores/                # 状态管理
│   │   ├── auth.ts           # 认证状态
│   │   ├── theme.ts          # 主题状态
│   │   ├── menu.ts           # 菜单状态
│   │   └── permission.ts     # 权限状态
│   ├── views/                 # 页面组件
│   │   ├── auth/             # 认证相关页面
│   │   ├── dashboard/        # 仪表盘
│   │   ├── system/           # 系统管理
│   │   │   ├── users/        # 用户管理
│   │   │   ├── roles/        # 角色管理
│   │   │   ├── menus/        # 菜单管理
│   │   │   ├── permissions/  # 权限管理
│   │   │   └── settings/     # 系统设置
│   │   └── components/       # 组件展示页面
│   ├── App.vue               # 根组件
│   ├── main.ts              # 应用入口
│   └── style.css            # 全局样式
├── package.json             # 依赖配置
├── vite.config.ts           # Vite 配置
└── tsconfig.json            # TypeScript 配置
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
# 在项目根目录执行
pnpm install
```

### 启动开发服务器
```bash
# 启动shadcn-vue-admin
cd apps/shadcn-vue-admin
pnpm dev

# 或在根目录使用workspace命令
pnpm --filter shadcn-vue-admin dev
```

### 构建生产版本
```bash
cd apps/shadcn-vue-admin
pnpm build
```

## 🎯 设计理念对比

### 与传统 Ant Design 方案的区别

| 特性 | 传统 Ant Design | ShadCN Vue Admin |
|------|----------------|------------------|
| **组件哲学** | 重量级UI组件 | 无头组件 + 样式分离 |
| **样式系统** | Less/CSS-in-JS | TailwindCSS 原子化 |
| **定制能力** | 主题变量覆盖 | 完全控制每个样式 |
| **包大小** | 较大，全量引入 | 按需引入，极致优化 |
| **设计一致性** | Ant Design 规范 | 现代化设计系统 |
| **开发体验** | 配置驱动 | 组合驱动 |

### 核心优势

1. **极致的可定制性**
   - 每个组件都可以完全自定义样式
   - 不受限于设计系统的视觉约束
   - 可以实现任何设计稿的精确还原

2. **更好的性能**
   - 基于 Vite 的极速热重载
   - TailwindCSS 的 JIT 编译
   - Tree-shaking 友好的组件设计

3. **现代化的开发体验**
   - TypeScript 优先的组件 API
   - Composition API 的状态管理
   - 直观的 props 和事件系统

## 📚 功能模块详解

### 用户管理
- ✅ 用户列表展示和搜索
- ✅ 新增/编辑/删除用户
- ✅ 用户状态管理(启用/禁用)
- ✅ 密码重置功能
- ✅ 角色分配
- ✅ 批量操作支持

### 角色管理
- ✅ 角色列表管理
- ✅ 角色权限分配
- ✅ 角色状态控制
- ✅ 权限继承机制

### 菜单管理
- ✅ 树形菜单结构
- ✅ 菜单图标配置
- ✅ 路由路径管理
- ✅ 可见性控制
- ✅ 排序功能

### 权限管理
- ✅ 三级权限体系(菜单/按钮/API)
- ✅ 权限码规范化
- ✅ 资源路径映射
- ✅ 权限状态管理

### 系统设置
- ✅ 多标签页设置界面
- ✅ 基本信息配置
- ✅ 外观主题设置
- ✅ 邮件服务配置
- ✅ 安全策略设置
- ✅ 系统高级选项

## 🔧 开发指南

### 添加新页面
1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 更新 `src/layouts/BasicLayout.vue` 中的菜单配置

### 自定义组件
基于 shadcn-vue 组件进行二次封装：

```vue
<script setup lang="ts">
import { Button } from 'shadcn-vue-ui'

// 组件逻辑
</script>

<template>
  <Button variant="default">
    自定义按钮
  </Button>
</template>
```

### API 集成
使用封装的 request 方法：

```typescript
import { request } from '@/api/request'

export const getUserList = (params: UserListParams) => {
  return request<UserListResponse>({
    url: '/user/list',
    method: 'GET',
    params
  })
}
```

### 状态管理
使用 Pinia 进行状态管理：

```typescript
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  
  const fetchUsers = async () => {
    // 获取用户数据
  }
  
  return { users, fetchUsers }
})
```

## 🎉 功能特色

### 🚀 性能优化
- 组件懒加载
- 路由级代码分割
- 图片懒加载
- 请求缓存机制

### 🔒 安全特性
- JWT 令牌认证
- 权限路由守卫
- API 访问控制
- XSS 防护
- CSRF 防护

### 💡 开发体验
- 热重载开发
- TypeScript 类型检查
- ESLint 代码规范
- 组件自动导入
- 路径别名支持

### 📱 移动端适配
- 响应式布局设计
- 移动端菜单优化
- 触摸手势支持
- 移动端表格优化

## 🔗 相关链接

- [shadcn-vue](https://www.shadcn-vue.com/) - 组件库文档
- [Reka UI](https://reka-ui.com/) - 无头组件库
- [TailwindCSS](https://tailwindcss.com/) - 原子化CSS框架
- [Vue 3](https://vuejs.org/) - Vue.js 官方文档
- [Vite](https://vitejs.dev/) - 构建工具文档
- [Pinia](https://pinia.vuejs.org/) - 状态管理文档

## 📄 许可证

MIT License

## 🙏 致谢

感谢以下开源项目的支持：
- [shadcn-ui](https://ui.shadcn.com/) - 原始设计系统
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [buqiyuan/vue3-antdv-admin](https://github.com/buqiyuan/vue3-antdv-admin) - 参考项目

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**ShadCN Vue Admin** - 让管理后台开发更简单、更现代、更高效！ 🚀 