<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from 'shadcn-vue-ui'
import RichTextEditor from '@/components/RichTextEditor.vue'

const content1 = ref('<p>这是一个基于 <strong>TipTap</strong> 的富文本编辑器示例</p>')
const content2 = ref(`
<h2>欢迎使用 TipTap 富文本编辑器</h2>
<p>这是一个基于 <strong>TipTap</strong> 构建的富文本编辑器，具有以下特性：</p>
<ul>
  <li><strong>Vue3 原生支持</strong> - 专为 Vue3 设计</li>
  <li><em>模块化架构</em> - 按需加载功能</li>
  <li><u>小程序友好</u> - 移动端兼容性佳</li>
  <li>丰富的扩展 - 插件生态完善</li>
</ul>
<blockquote>
  <p>TipTap 是基于 ProseMirror 构建的现代化富文本编辑器框架</p>
</blockquote>
<p>还支持插入<a href="https://tiptap.dev">链接</a>和图片等功能。</p>
<pre><code>console.log('支持代码块显示')</code></pre>
`)
const content3 = ref('')
const readOnlyContent = ref(`
<h3>只读模式示例</h3>
<p>这个编辑器处于只读模式，展示了 <strong>TipTap</strong> 的内容渲染能力。</p>
<ul>
  <li>完美的样式渲染</li>
  <li>保持格式完整性</li>
  <li>适用于内容展示场景</li>
</ul>
`)

const clearContent = (contentRef: any) => {
  contentRef.value = ''
}

const insertSample = (contentRef: any) => {
  contentRef.value = `
<h2>TipTap 功能展示</h2>
<p>这是插入的<strong>示例内容</strong>，展示了 TipTap 的各种功能：</p>

<h3>文本格式</h3>
<p>支持 <strong>粗体</strong>、<em>斜体</em>、<u>下划线</u>和<del>删除线</del>等格式。</p>

<h3>列表功能</h3>
<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2
    <ul>
      <li>嵌套列表项</li>
    </ul>
  </li>
</ul>

<ol>
  <li>有序列表项 1</li>
  <li>有序列表项 2</li>
</ol>

<h3>引用和代码</h3>
<blockquote>
  <p>这是一个引用示例，展示了 TipTap 的引用块功能。</p>
</blockquote>

<p>行内代码：<code>const editor = new Editor()</code></p>

<pre><code>// 代码块示例
function initTipTap() {
  return new Editor({
    extensions: [StarterKit]
  })
}</code></pre>

<h3>对齐方式</h3>
<p style="text-align: left">左对齐文本</p>
<p style="text-align: center">居中对齐文本</p>
<p style="text-align: right">右对齐文本</p>
`
}

// 演示编辑器配置
const demoConfigs = ref([
  {
    title: '完整功能',
    description: '包含所有工具栏功能',
    height: '300px',
    toolbar: true
  },
  {
    title: '紧凑模式',
    description: '较小的编辑器高度',
    height: '200px',
    toolbar: true
  },
  {
    title: '高编辑器',
    description: '适合长文本编辑',
    height: '500px',
    toolbar: true
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">TipTap 富文本编辑器</h1>
      <p class="text-muted-foreground">基于 TipTap 的现代化富文本编辑组件</p>
    </div>

    <!-- TipTap 特性介绍 -->
    <Card>
      <CardHeader>
        <CardTitle>为什么选择 TipTap？</CardTitle>
        <CardDescription>现代化富文本编辑器的最佳选择</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <h4 class="font-medium text-green-600">🚀 Vue3 原生支持</h4>
            <p class="text-sm text-muted-foreground">专为 Vue3 设计，无需额外适配层</p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-blue-600">📦 模块化设计</h4>
            <p class="text-sm text-muted-foreground">按需引入功能，体积可控</p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-purple-600">📱 移动端友好</h4>
            <p class="text-sm text-muted-foreground">小程序和移动端兼容性佳</p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-orange-600">🔧 高度可扩展</h4>
            <p class="text-sm text-muted-foreground">丰富的插件生态，自定义能力强</p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-red-600">⚡ 性能优秀</h4>
            <p class="text-sm text-muted-foreground">基于 ProseMirror，性能和稳定性俱佳</p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-teal-600">💡 TypeScript</h4>
            <p class="text-sm text-muted-foreground">完整的 TypeScript 支持</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 基础编辑器 -->
    <Card>
      <CardHeader>
        <CardTitle>基础编辑器</CardTitle>
        <CardDescription>最简单的 TipTap 编辑器使用</CardDescription>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          v-model="content1"
          placeholder="请输入内容..."
        />
        
        <div class="mt-4 flex gap-2">
          <Button variant="outline" @click="clearContent(content1)">
            清空内容
          </Button>
          <Button variant="outline" @click="insertSample(content1)">
            插入示例
          </Button>
        </div>
        
        <div class="mt-4">
          <h4 class="text-sm font-medium mb-2">内容预览 (HTML):</h4>
          <pre class="text-xs bg-muted p-2 rounded overflow-auto max-h-32">{{ content1 }}</pre>
        </div>
      </CardContent>
    </Card>

    <!-- 预设内容编辑器 -->
    <Card>
      <CardHeader>
        <CardTitle>功能演示编辑器</CardTitle>
        <CardDescription>包含丰富预设内容的编辑器，展示各种功能</CardDescription>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          v-model="content2"
          height="450px"
        />
      </CardContent>
    </Card>

    <!-- 不同配置的编辑器 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card v-for="(config, index) in demoConfigs" :key="index">
        <CardHeader>
          <CardTitle class="text-lg">{{ config.title }}</CardTitle>
          <CardDescription>{{ config.description }}</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            v-model="content3"
            :height="config.height"
            :toolbar="config.toolbar"
            :placeholder="`${config.title}编辑器...`"
          />
        </CardContent>
      </Card>
    </div>

    <!-- 无工具栏编辑器 -->
    <Card>
      <CardHeader>
        <CardTitle>无工具栏编辑器</CardTitle>
        <CardDescription>隐藏工具栏的简洁编辑器，适合评论输入等场景</CardDescription>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          v-model="content3"
          :toolbar="false"
          placeholder="这是一个无工具栏的编辑器，专注于内容输入..."
          height="150px"
        />
      </CardContent>
    </Card>

    <!-- 只读编辑器 -->
    <Card>
      <CardHeader>
        <CardTitle>只读模式</CardTitle>
        <CardDescription>禁用编辑功能的只读模式，适合内容展示</CardDescription>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          v-model="readOnlyContent"
          :disabled="true"
          height="200px"
        />
      </CardContent>
    </Card>

    <!-- 技术文档 -->
    <Card>
      <CardHeader>
        <CardTitle>技术特性</CardTitle>
        <CardDescription>TipTap 编辑器的技术实现和使用说明</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium mb-3">🎯 核心功能</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• 文本格式化 (粗体、斜体、下划线、删除线)</li>
                <li>• 文本对齐 (左、中、右对齐)</li>
                <li>• 列表支持 (有序、无序列表)</li>
                <li>• 引用块和代码块</li>
                <li>• 链接和图片插入</li>
                <li>• 撤销/重做功能</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-sm font-medium mb-3">⚙️ 组件属性</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• <code>v-model</code> - 双向绑定编辑器内容</li>
                <li>• <code>placeholder</code> - 占位符文本</li>
                <li>• <code>disabled</code> - 禁用编辑功能</li>
                <li>• <code>height</code> - 编辑器最小高度</li>
                <li>• <code>toolbar</code> - 显示/隐藏工具栏</li>
                <li>• <code>editable</code> - 控制编辑器可编辑状态</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-sm font-medium mb-3">📦 扩展支持</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• StarterKit - 基础功能包</li>
                <li>• Underline - 下划线扩展</li>
                <li>• TextAlign - 文本对齐扩展</li>
                <li>• Link - 链接功能扩展</li>
                <li>• Image - 图片插入扩展</li>
                <li>• Placeholder - 占位符扩展</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-sm font-medium mb-3">🔄 事件处理</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• <code>@update:modelValue</code> - 内容更新事件</li>
                <li>• <code>@change</code> - 内容变化事件</li>
                <li>• 实时双向数据绑定</li>
                <li>• 自动内容同步</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium mb-3">💡 使用示例</h4>
            <pre class="text-xs bg-muted p-3 rounded-md overflow-x-auto"><code>&lt;template&gt;
  &lt;RichTextEditor
    v-model="content"
    placeholder="请输入内容..."
    height="400px"
    :toolbar="true"
    @change="handleContentChange"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const content = ref('&lt;p&gt;初始内容&lt;/p&gt;')

const handleContentChange = (html) => {
  console.log('内容变化:', html)
}
&lt;/script&gt;</code></pre>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>