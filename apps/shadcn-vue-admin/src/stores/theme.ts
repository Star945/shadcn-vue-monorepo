import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

// 预定义常用颜色的OKLCH映射表
const colorMappings: Record<string, string> = {
  '#3b82f6': 'oklch(0.615 0.15 264)', // 蓝色
  '#0ea5e9': 'oklch(0.658 0.13 220)', // 天蓝色
  '#22c55e': 'oklch(0.722 0.156 142)', // 绿色
  '#8b5cf6': 'oklch(0.606 0.192 290)', // 紫色
  '#ef4444': 'oklch(0.629 0.218 27)', // 红色
  '#f97316': 'oklch(0.691 0.199 50)', // 橙色
  '#ec4899': 'oklch(0.627 0.221 345)', // 粉色
  '#06b6d4': 'oklch(0.691 0.125 195)', // 青色
  '#1e40af': 'oklch(0.463 0.138 264)', // 深蓝色
  '#059669': 'oklch(0.576 0.134 160)', // 深绿色
  '#7c3aed': 'oklch(0.544 0.202 290)', // 深紫色
  '#dc2626': 'oklch(0.569 0.189 27)', // 深红色
  '#000000': 'oklch(0 0 0)', // 黑色
  '#ffffff': 'oklch(1 0 0)', // 白色
}

// 将十六进制颜色转换为OKLCH
const hexToOklch = (hex: string) => {
  // 如果有预定义的映射，直接使用
  if (colorMappings[hex.toLowerCase()]) {
    const oklch = colorMappings[hex.toLowerCase()]
    const match = oklch.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/)
    if (match) {
      return {
        l: parseFloat(match[1]),
        c: parseFloat(match[2]),
        h: parseFloat(match[3])
      }
    }
  }
  
  // 移除 # 符号
  const cleanHex = hex.replace('#', '')
  
  // 转换为RGB
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255

  // 改进的RGB到OKLCH转换
  // 使用更准确的亮度计算
  const l = Math.pow(0.2126 * Math.pow(r, 2.2) + 0.7152 * Math.pow(g, 2.2) + 0.0722 * Math.pow(b, 2.2), 1/2.2)
  
  // 改进的色度和色相计算
  const a = 0.5 * (2 * r - g - b)
  const bComp = 0.866025 * (g - b)
  const c = Math.sqrt(a * a + bComp * bComp) * 0.2
  
  let h = Math.atan2(bComp, a) * 180 / Math.PI
  if (h < 0) h += 360
  
  return {
    l: Math.max(0, Math.min(1, l)),
    c: Math.max(0, Math.min(0.32, c)),
    h: h
  }
}

// 生成OKLCH颜色值
const oklchValue = (l: number, c: number, h: number) => {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('system')
  const sidebarCollapsed = ref(false)
  const primaryColor = ref('#3b82f6') // 默认蓝色

  // 主题切换逻辑
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    applyTheme()
  }

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    applyPrimaryColor(color)
  }

  // 应用主题色
  const applyPrimaryColor = (color: string) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const { l, c, h } = hexToOklch(color)
    
    // 生成主色调
    const primary = oklchValue(l, c, h)
    const primaryForeground = l > 0.5 ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)'
    
    // 设置CSS变量
    root.style.setProperty('--primary', primary)
    root.style.setProperty('--primary-foreground', primaryForeground)
    
    // 设置边框焦点颜色（稍微降低色度和调整亮度）
    const ringL = Math.max(0.5, Math.min(0.7, l + 0.1))
    const ringC = Math.max(0.02, c * 0.6)
    const ringColor = oklchValue(ringL, ringC, h)
    root.style.setProperty('--ring', ringColor)
    
    // 设置accent色（用于hover状态）
    const accentL = l > 0.5 ? 0.96 : 0.14
    const accentC = Math.max(0.002, c * 0.1)
    const accentColor = oklchValue(accentL, accentC, h)
    root.style.setProperty('--accent', accentColor)
  }

  const applyTheme = () => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    
    if (theme.value === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme.value)
    }
    
    // 重新应用主题色
    applyPrimaryColor(primaryColor.value)
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme()
      }
    })

    // 初始化主题和主题色
    applyTheme()
    applyPrimaryColor(primaryColor.value)
  }

  // 监听主题变化
  watch(theme, applyTheme)
  watch(primaryColor, applyPrimaryColor)

  return {
    theme,
    sidebarCollapsed,
    primaryColor,
    setTheme,
    setPrimaryColor,
    toggleSidebar
  }
}, {
  persist: true // 持久化存储
}) 