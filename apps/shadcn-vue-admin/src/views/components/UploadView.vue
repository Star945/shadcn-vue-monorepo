<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shadcn-vue-ui'
import FileUpload from '@/components/FileUpload.vue'
import type { UploadFile } from '@/components/FileUpload.vue'

const imageFiles = ref<UploadFile[]>([])
const documentFiles = ref<UploadFile[]>([])
const multipleFiles = ref<UploadFile[]>([])

const handleImageUpload = (file: File) => {
  console.log('上传图片:', file.name)
}

const handleDocumentUpload = (file: File) => {
  console.log('上传文档:', file.name)
}

const handleMultipleUpload = (file: File) => {
  console.log('批量上传:', file.name)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">文件上传</h1>
      <p class="text-muted-foreground">展示各种文件上传组件和功能</p>
    </div>

    <!-- 基础上传 -->
    <Card>
      <CardHeader>
        <CardTitle>基础上传</CardTitle>
        <CardDescription>单文件上传，支持拖拽</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          accept="image/*"
          :max-size="5"
          @upload="handleImageUpload"
          @change="(files) => imageFiles = files"
        />
      </CardContent>
    </Card>

    <!-- 图片上传 -->
    <Card>
      <CardHeader>
        <CardTitle>图片上传</CardTitle>
        <CardDescription>图片文件上传，卡片式预览</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          accept="image/*"
          :max-size="10"
          :max-count="4"
          list-type="picture-card"
          multiple
          @upload="handleImageUpload"
          @change="(files) => imageFiles = files"
        />
      </CardContent>
    </Card>

    <!-- 文档上传 -->
    <Card>
      <CardHeader>
        <CardTitle>文档上传</CardTitle>
        <CardDescription>支持各种文档格式上传</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
          :max-size="20"
          :max-count="5"
          multiple
          @upload="handleDocumentUpload"
          @change="(files) => documentFiles = files"
        />
      </CardContent>
    </Card>

    <!-- 批量上传 -->
    <Card>
      <CardHeader>
        <CardTitle>批量上传</CardTitle>
        <CardDescription>支持批量选择和上传多个文件</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          :max-size="50"
          :max-count="10"
          multiple
          @upload="handleMultipleUpload"
          @change="(files) => multipleFiles = files"
        />
        
        <div v-if="multipleFiles.length > 0" class="mt-4">
          <h4 class="text-sm font-medium mb-2">上传统计</h4>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-muted-foreground">总文件数:</span>
              <span class="ml-1 font-medium">{{ multipleFiles.length }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">总大小:</span>
              <span class="ml-1 font-medium">
                {{ (multipleFiles.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2) }} MB
              </span>
            </div>
            <div>
              <span class="text-muted-foreground">完成:</span>
              <span class="ml-1 font-medium">
                {{ multipleFiles.filter(f => f.status === 'done').length }}/{{ multipleFiles.length }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 使用说明 -->
    <Card>
      <CardHeader>
        <CardTitle>使用说明</CardTitle>
        <CardDescription>文件上传组件的特性和配置</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium mb-2">主要特性</h4>
            <ul class="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>支持点击选择和拖拽上传</li>
              <li>文件类型和大小验证</li>
              <li>上传进度显示</li>
              <li>多种列表展示模式</li>
              <li>文件预览和删除</li>
              <li>批量上传支持</li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-sm font-medium mb-2">配置参数</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>accept:</strong> 接受的文件类型
              </div>
              <div>
                <strong>multiple:</strong> 是否支持多选
              </div>
              <div>
                <strong>maxSize:</strong> 单个文件最大大小(MB)
              </div>
              <div>
                <strong>maxCount:</strong> 最大文件数量
              </div>
              <div>
                <strong>listType:</strong> 列表展示类型
              </div>
              <div>
                <strong>disabled:</strong> 是否禁用
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 