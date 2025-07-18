import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || 'guest')

  // 动作
  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟登录成功
      const mockUser: User = {
        id: '1',
        name: '管理员',
        email: email,
        avatar: '/placeholder-user.jpg',
        role: 'admin'
      }
      
      user.value = mockUser
      token.value = 'mock-jwt-token'
      
      return { success: true }
    } catch (error) {
      return { success: false, message: '登录失败' }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  return {
    // 状态
    user,
    token,
    loading,
    
    // 计算属性
    isAuthenticated,
    userRole,
    
    // 动作
    login,
    logout,
    updateProfile
  }
}) 