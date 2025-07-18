<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button, Separator } from 'shadcn-vue-ui'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-vue-next'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  height?: string
  toolbar?: boolean
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  disabled: false,
  height: '300px',
  toolbar: true,
  editable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

// 创建编辑器实例
const editor = ref<Editor>()

// 初始化编辑器
const initEditor = () => {
  editor.value = new Editor({
    content: props.modelValue,
    editable: props.editable && !props.disabled,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md',
        },
      }),
      Placeholder.configure({
        placeholder: props.placeholder,
      }),
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      emit('update:modelValue', html)
      emit('change', html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4',
        style: `min-height: ${props.height};`,
      },
    },
  })
}

// 工具栏按钮配置
const toolbarButtons = [
  {
    name: 'bold',
    icon: Bold,
    title: '粗体',
    action: () => editor.value?.chain().focus().toggleBold().run(),
    isActive: () => editor.value?.isActive('bold')
  },
  {
    name: 'italic',
    icon: Italic,
    title: '斜体',
    action: () => editor.value?.chain().focus().toggleItalic().run(),
    isActive: () => editor.value?.isActive('italic')
  },
  {
    name: 'underline',
    icon: UnderlineIcon,
    title: '下划线',
    action: () => editor.value?.chain().focus().toggleUnderline().run(),
    isActive: () => editor.value?.isActive('underline')
  },
  {
    name: 'strike',
    icon: Strikethrough,
    title: '删除线',
    action: () => editor.value?.chain().focus().toggleStrike().run(),
    isActive: () => editor.value?.isActive('strike')
  },
  { type: 'separator' },
  {
    name: 'alignLeft',
    icon: AlignLeft,
    title: '左对齐',
    action: () => editor.value?.chain().focus().setTextAlign('left').run(),
    isActive: () => editor.value?.isActive({ textAlign: 'left' })
  },
  {
    name: 'alignCenter',
    icon: AlignCenter,
    title: '居中对齐',
    action: () => editor.value?.chain().focus().setTextAlign('center').run(),
    isActive: () => editor.value?.isActive({ textAlign: 'center' })
  },
  {
    name: 'alignRight',
    icon: AlignRight,
    title: '右对齐',
    action: () => editor.value?.chain().focus().setTextAlign('right').run(),
    isActive: () => editor.value?.isActive({ textAlign: 'right' })
  },
  { type: 'separator' },
  {
    name: 'bulletList',
    icon: List,
    title: '无序列表',
    action: () => editor.value?.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value?.isActive('bulletList')
  },
  {
    name: 'orderedList',
    icon: ListOrdered,
    title: '有序列表',
    action: () => editor.value?.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value?.isActive('orderedList')
  },
  {
    name: 'blockquote',
    icon: Quote,
    title: '引用',
    action: () => editor.value?.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value?.isActive('blockquote')
  },
  {
    name: 'codeBlock',
    icon: Code,
    title: '代码块',
    action: () => editor.value?.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.value?.isActive('codeBlock')
  },
  { type: 'separator' },
  {
    name: 'undo',
    icon: Undo,
    title: '撤销',
    action: () => editor.value?.chain().focus().undo().run(),
    isActive: () => false
  },
  {
    name: 'redo',
    icon: Redo,
    title: '重做',
    action: () => editor.value?.chain().focus().redo().run(),
    isActive: () => false
  }
]

// 添加链接
const addLink = () => {
  const url = window.prompt('请输入链接地址:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

// 添加图片
const addImage = () => {
  const url = window.prompt('请输入图片地址:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue)
  }
})

watch(() => props.disabled, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(!newValue && props.editable)
  }
})

watch(() => props.editable, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue && !props.disabled)
  }
})

// 初始化编辑器
initEditor()

// 清理
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <div class="rich-text-editor border rounded-md overflow-hidden bg-background">
    <!-- 工具栏 -->
    <div v-if="toolbar" class="flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
      <template v-for="(button, index) in toolbarButtons" :key="index">
        <Separator v-if="button.type === 'separator'" orientation="vertical" class="h-6" />
        <Button
          v-else
          variant="ghost"
          size="sm"
          :disabled="disabled"
          :class="{
            'bg-accent': button.isActive?.()
          }"
          @click="button.action"
          :title="button.title"
        >
          <component :is="button.icon" class="h-4 w-4" />
        </Button>
      </template>
      
      <Separator orientation="vertical" class="h-6" />
      
      <!-- 插入链接 -->
      <Button
        variant="ghost"
        size="sm"
        :disabled="disabled"
        @click="addLink"
        title="插入链接"
      >
        <LinkIcon class="h-4 w-4" />
      </Button>
      
      <!-- 插入图片 -->
      <Button
        variant="ghost"
        size="sm"
        :disabled="disabled"
        @click="addImage"
        title="插入图片"
      >
        <ImageIcon class="h-4 w-4" />
      </Button>
    </div>

    <!-- 编辑区域 -->
    <div 
      class="editor-content"
      :class="{
        'opacity-50 cursor-not-allowed': disabled
      }"
    >
      <EditorContent 
        :editor="editor" 
        :style="{ minHeight: height }"
      />
    </div>
  </div>
</template>

<style scoped>
.rich-text-editor :deep(.ProseMirror) {
  outline: none;
  padding: 1rem;
  min-height: v-bind(height);
}

.rich-text-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.rich-text-editor :deep(.ProseMirror) {
  line-height: 1.6;
}

.rich-text-editor :deep(.ProseMirror h1),
.rich-text-editor :deep(.ProseMirror h2),
.rich-text-editor :deep(.ProseMirror h3),
.rich-text-editor :deep(.ProseMirror h4),
.rich-text-editor :deep(.ProseMirror h5),
.rich-text-editor :deep(.ProseMirror h6) {
  font-weight: bold;
  margin: 1em 0 0.5em 0;
}

.rich-text-editor :deep(.ProseMirror h1) { font-size: 2em; }
.rich-text-editor :deep(.ProseMirror h2) { font-size: 1.5em; }
.rich-text-editor :deep(.ProseMirror h3) { font-size: 1.25em; }

.rich-text-editor :deep(.ProseMirror p) {
  margin: 0.5em 0;
}

.rich-text-editor :deep(.ProseMirror ul),
.rich-text-editor :deep(.ProseMirror ol) {
  padding-left: 2em;
  margin: 0.5em 0;
}

.rich-text-editor :deep(.ProseMirror blockquote) {
  border-left: 4px solid hsl(var(--border));
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: hsl(var(--muted-foreground));
}

.rich-text-editor :deep(.ProseMirror pre) {
  background: hsl(var(--muted));
  padding: 1em;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875em;
  margin: 1em 0;
}

.rich-text-editor :deep(.ProseMirror code) {
  background: hsl(var(--muted));
  padding: 0.125em 0.25em;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
}

.rich-text-editor :deep(.ProseMirror a) {
  color: hsl(var(--primary));
  text-decoration: underline;
}

.rich-text-editor :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
}

/* 文本对齐样式 */
.rich-text-editor :deep(.ProseMirror .has-text-align-left) {
  text-align: left;
}

.rich-text-editor :deep(.ProseMirror .has-text-align-center) {
  text-align: center;
}

.rich-text-editor :deep(.ProseMirror .has-text-align-right) {
  text-align: right;
}
</style> 