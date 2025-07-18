<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Input, Label } from 'shadcn-vue-ui'
import { Upload, X, FileText, Image, File } from 'lucide-vue-next'

export interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  status: 'uploading' | 'done' | 'error'
  progress?: number
}

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // MB
  maxCount?: number
  disabled?: boolean
  listType?: 'text' | 'picture' | 'picture-card'
  showUploadList?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  maxSize: 10,
  maxCount: 1,
  disabled: false,
  listType: 'text',
  showUploadList: true
})

const emit = defineEmits<{
  change: [files: UploadFile[]]
  upload: [file: File]
  remove: [file: UploadFile]
}>()

const fileInput = ref<HTMLInputElement>()
const fileList = ref<UploadFile[]>([])
const dragOver = ref(false)

// 计算属性
const isDisabled = computed(() => {
  return props.disabled || (fileList.value.length >= props.maxCount)
})

// 生成文件ID
const generateFileId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

// 获取文件图标
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image
  if (type.includes('text') || type.includes('json')) return FileText
  return File
}

// 验证文件
const validateFile = (file: File): string | null => {
  // 检查文件类型
  if (props.accept) {
    const accepts = props.accept.split(',').map(s => s.trim())
    const isAccepted = accepts.some(accept => {
      if (accept.startsWith('.')) {
        return file.name.toLowerCase().endsWith(accept.toLowerCase())
      }
      return file.type.match(accept.replace('*', '.*'))
    })
    if (!isAccepted) {
      return '不支持的文件类型'
    }
  }

  // 检查文件大小
  if (file.size > props.maxSize * 1024 * 1024) {
    return `文件大小不能超过 ${props.maxSize}MB`
  }

  return null
}

// 处理文件选择
const handleFileSelect = (files: FileList | null) => {
  if (!files) return

  const newFiles: UploadFile[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // 检查数量限制
    if (fileList.value.length + newFiles.length >= props.maxCount) {
      alert(`最多只能上传 ${props.maxCount} 个文件`)
      break
    }

    // 验证文件
    const error = validateFile(file)
    if (error) {
      alert(error)
      continue
    }

    const uploadFile: UploadFile = {
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }

    newFiles.push(uploadFile)
    
    // 触发上传事件
    emit('upload', file)
    
    // 模拟上传进度
    simulateUpload(uploadFile)
  }

  fileList.value.push(...newFiles)
  emit('change', fileList.value)
}

// 模拟上传进度
const simulateUpload = (file: UploadFile) => {
  const interval = setInterval(() => {
    if (file.progress === undefined) file.progress = 0
    file.progress += Math.random() * 30
    
    if (file.progress >= 100) {
      file.progress = 100
      file.status = 'done'
      file.url = URL.createObjectURL(new Blob())
      clearInterval(interval)
      emit('change', fileList.value)
    }
  }, 200)
}

// 处理点击上传
const handleUploadClick = () => {
  if (isDisabled.value) return
  fileInput.value?.click()
}

// 处理拖拽
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!isDisabled.value) {
    dragOver.value = true
  }
}

const handleDragLeave = () => {
  dragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  
  if (isDisabled.value) return
  
  const files = e.dataTransfer?.files
  handleFileSelect(files)
}

// 移除文件
const removeFile = (file: UploadFile) => {
  const index = fileList.value.findIndex(f => f.id === file.id)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emit('remove', file)
    emit('change', fileList.value)
  }
}

// 暴露方法
defineExpose({
  clearFiles: () => {
    fileList.value = []
    emit('change', fileList.value)
  },
  getFiles: () => fileList.value
})
</script>

<template>
  <div class="space-y-4">
    <!-- 上传区域 -->
    <div
      class="relative rounded-lg border-2 border-dashed p-6 text-center transition-colors"
      :class="{
        'border-primary bg-primary/5': dragOver,
        'border-muted-foreground/25 hover:border-muted-foreground/50': !dragOver && !isDisabled,
        'opacity-50 cursor-not-allowed': isDisabled
      }"
      @click="handleUploadClick"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        :multiple="multiple"
        :disabled="isDisabled"
        @change="(e) => handleFileSelect((e.target as HTMLInputElement).files)"
      />
      
      <div class="space-y-2">
        <Upload class="mx-auto h-8 w-8 text-muted-foreground" />
        <div class="space-y-1">
          <p class="text-sm font-medium">
            点击或拖拽文件到此区域上传
          </p>
          <p class="text-xs text-muted-foreground">
            支持{{ accept || '所有格式' }}，单个文件最大{{ maxSize }}MB
            <span v-if="maxCount > 1">，最多{{ maxCount }}个文件</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="showUploadList && fileList.length > 0" class="space-y-2">
      <Label class="text-sm font-medium">上传列表</Label>
      
      <!-- 文本列表 -->
      <div v-if="listType === 'text'" class="space-y-1">
        <div
          v-for="file in fileList"
          :key="file.id"
          class="flex items-center justify-between rounded-md border p-2"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <component :is="getFileIcon(file.type)" class="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm truncate" :title="file.name">{{ file.name }}</p>
              <p class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- 进度条 -->
            <div v-if="file.status === 'uploading'" class="w-20">
              <div class="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary transition-all duration-300"
                  :style="{ width: `${file.progress || 0}%` }"
                ></div>
              </div>
            </div>
            
            <!-- 状态 -->
            <div class="text-xs">
              <span v-if="file.status === 'done'" class="text-green-600">完成</span>
              <span v-else-if="file.status === 'error'" class="text-red-600">失败</span>
              <span v-else class="text-blue-600">{{ Math.round(file.progress || 0) }}%</span>
            </div>
            
            <!-- 删除按钮 -->
            <Button
              variant="ghost"
              size="sm"
              @click="removeFile(file)"
            >
              <X class="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <!-- 图片卡片列表 -->
      <div v-else-if="listType === 'picture-card'" class="grid grid-cols-4 gap-2">
        <div
          v-for="file in fileList"
          :key="file.id"
          class="relative aspect-square rounded-lg border overflow-hidden"
        >
          <div v-if="file.type.startsWith('image/') && file.url" class="w-full h-full">
            <img :src="file.url" :alt="file.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-full h-full flex items-center justify-center bg-muted">
            <component :is="getFileIcon(file.type)" class="h-8 w-8 text-muted-foreground" />
          </div>
          
          <!-- 遮罩层 -->
          <div 
            v-if="file.status === 'uploading'"
            class="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div class="text-white text-xs">{{ Math.round(file.progress || 0) }}%</div>
          </div>
          
          <!-- 删除按钮 -->
          <Button
            variant="destructive"
            size="sm"
            class="absolute top-1 right-1"
            @click="removeFile(file)"
          >
            <X class="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template> 