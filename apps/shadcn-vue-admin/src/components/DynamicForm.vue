<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Checkbox,
  RadioGroup,
  RadioGroupItem
} from 'shadcn-vue-ui'

export interface FormField {
  name: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'switch' | 'number' | 'email' | 'password' | 'date'
  required?: boolean
  placeholder?: string
  disabled?: boolean
  visible?: boolean | ((formData: Record<string, any>) => boolean)
  options?: { label: string; value: any }[]
  rules?: FormRule[]
  span?: number // 栅格占用列数 (1-12)
  defaultValue?: any
  props?: Record<string, any>
}

export interface FormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any, formData: Record<string, any>) => string | true
}

export interface FormSchema {
  title?: string
  fields: FormField[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  columns?: number // 表单列数
}

interface Props {
  schema: FormSchema
  modelValue?: Record<string, any>
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  readonly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  submit: [value: Record<string, any>]
  reset: []
  fieldChange: [field: string, value: any]
}>()

// 表单数据
const formData = ref<Record<string, any>>({ ...props.modelValue })
const errors = ref<Record<string, string>>({})

// 初始化表单默认值
const initFormData = () => {
  props.schema.fields.forEach(field => {
    if (field.defaultValue !== undefined && formData.value[field.name] === undefined) {
      formData.value[field.name] = field.defaultValue
    }
  })
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  formData.value = { ...newVal }
}, { deep: true })

// 监听表单数据变化
watch(formData, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

// 字段可见性判断
const isFieldVisible = (field: FormField): boolean => {
  if (field.visible === undefined) return true
  if (typeof field.visible === 'boolean') return field.visible
  return field.visible(formData.value)
}

// 表单验证
const validateField = (field: FormField, value: any): string | null => {
  if (!field.rules) return null
  
  for (const rule of field.rules) {
    // 必填验证
    if (rule.required && (value === undefined || value === null || value === '')) {
      return rule.message || `${field.label}不能为空`
    }
    
    // 长度验证
    if (value && typeof value === 'string') {
      if (rule.min && value.length < rule.min) {
        return rule.message || `${field.label}长度不能少于${rule.min}个字符`
      }
      if (rule.max && value.length > rule.max) {
        return rule.message || `${field.label}长度不能超过${rule.max}个字符`
      }
    }
    
    // 正则验证
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.message || `${field.label}格式不正确`
    }
    
    // 自定义验证
    if (rule.validator) {
      const result = rule.validator(value, formData.value)
      if (result !== true) {
        return result
      }
    }
  }
  
  return null
}

// 验证所有字段
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  let isValid = true
  
  props.schema.fields.forEach(field => {
    if (isFieldVisible(field)) {
      const error = validateField(field, formData.value[field.name])
      if (error) {
        newErrors[field.name] = error
        isValid = false
      }
    }
  })
  
  errors.value = newErrors
  return isValid
}

// 处理字段值变化
const handleFieldChange = (field: FormField, value: any) => {
  formData.value[field.name] = value
  
  // 清除该字段的错误
  if (errors.value[field.name]) {
    delete errors.value[field.name]
  }
  
  emit('fieldChange', field.name, value)
}

// 提交表单
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  }
}

// 重置表单
const handleReset = () => {
  formData.value = {}
  errors.value = {}
  initFormData()
  emit('reset')
}

// 计算栅格类
const getGridClass = computed(() => {
  const columns = props.schema.columns || 1
  return `grid-cols-${columns}`
})

// 初始化
initFormData()

// 暴露方法
defineExpose({
  validate: validateForm,
  reset: handleReset,
  getFormData: () => formData.value
})
</script>

<template>
  <Card>
    <CardHeader v-if="schema.title">
      <CardTitle>{{ schema.title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4" :class="getGridClass">
          <template v-for="field in schema.fields" :key="field.name">
            <div
              v-if="isFieldVisible(field)"
              class="space-y-2"
              :class="field.span ? `col-span-${field.span}` : ''"
            >
              <Label 
                :for="field.name"
                :class="{ 'text-destructive': errors[field.name] }"
              >
                {{ field.label }}
                <span v-if="field.required" class="text-destructive">*</span>
              </Label>
              
              <!-- 输入框 -->
              <Input
                v-if="field.type === 'input' || field.type === 'email' || field.type === 'password'"
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type"
                :placeholder="field.placeholder"
                :disabled="field.disabled || readonly"
                :class="{ 'border-destructive': errors[field.name] }"
                v-bind="field.props"
                @update:model-value="(value) => handleFieldChange(field, value)"
              />
              
              <!-- 数字输入框 -->
              <Input
                v-else-if="field.type === 'number'"
                :id="field.name"
                v-model.number="formData[field.name]"
                type="number"
                :placeholder="field.placeholder"
                :disabled="field.disabled || readonly"
                :class="{ 'border-destructive': errors[field.name] }"
                v-bind="field.props"
                @update:model-value="(value) => handleFieldChange(field, value)"
              />
              
              <!-- 文本域 -->
              <Textarea
                v-else-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
                :disabled="field.disabled || readonly"
                :class="{ 'border-destructive': errors[field.name] }"
                v-bind="field.props"
                @update:model-value="(value) => handleFieldChange(field, value)"
              />
              
              <!-- 选择器 -->
              <Select
                v-else-if="field.type === 'select'"
                v-model="formData[field.name]"
                :disabled="field.disabled || readonly"
                @update:model-value="(value) => handleFieldChange(field, value)"
              >
                <SelectTrigger :class="{ 'border-destructive': errors[field.name] }">
                  <SelectValue :placeholder="field.placeholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <!-- 单选框组 -->
              <RadioGroup
                v-else-if="field.type === 'radio'"
                v-model="formData[field.name]"
                :disabled="field.disabled || readonly"
                @update:model-value="(value) => handleFieldChange(field, value)"
              >
                <div v-for="option in field.options" :key="option.value" class="flex items-center space-x-2">
                  <RadioGroupItem :value="option.value" :id="`${field.name}-${option.value}`" />
                  <Label :for="`${field.name}-${option.value}`">{{ option.label }}</Label>
                </div>
              </RadioGroup>
              
              <!-- 开关 -->
              <div v-else-if="field.type === 'switch'" class="flex items-center space-x-2">
                <Switch
                  :id="field.name"
                  v-model:checked="formData[field.name]"
                  :disabled="field.disabled || readonly"
                  @update:checked="(value) => handleFieldChange(field, value)"
                />
              </div>
              
              <!-- 复选框 -->
              <div v-else-if="field.type === 'checkbox'" class="flex items-center space-x-2">
                <Checkbox
                  :id="field.name"
                  v-model:checked="formData[field.name]"
                  :disabled="field.disabled || readonly"
                  @update:checked="(value) => handleFieldChange(field, value)"
                />
              </div>
              
              <!-- 日期 -->
              <Input
                v-else-if="field.type === 'date'"
                :id="field.name"
                v-model="formData[field.name]"
                type="date"
                :disabled="field.disabled || readonly"
                :class="{ 'border-destructive': errors[field.name] }"
                v-bind="field.props"
                @update:model-value="(value) => handleFieldChange(field, value)"
              />
              
              <!-- 错误信息 -->
              <p v-if="errors[field.name]" class="text-sm text-destructive">
                {{ errors[field.name] }}
              </p>
            </div>
          </template>
        </div>
        
        <!-- 操作按钮 -->
        <div v-if="!readonly" class="mt-6 flex justify-end space-x-2">
          <Button type="button" variant="outline" @click="handleReset">
            重置
          </Button>
          <Button type="submit">
            提交
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template> 