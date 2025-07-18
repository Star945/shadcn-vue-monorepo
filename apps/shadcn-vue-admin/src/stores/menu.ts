import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Component } from 'vue'

export interface MenuItem {
  title: string
  icon?: Component
  path: string
  children?: MenuItem[]
  meta?: {
    requiresAuth?: boolean
    roles?: string[]
    hideInMenu?: boolean
  }
}

export const useMenuStore = defineStore('menu', () => {
  const openKeys = ref<string[]>([])
  const selectedKeys = ref<string[]>([])

  const setOpenKeys = (keys: string[]) => {
    openKeys.value = keys
  }

  const setSelectedKeys = (keys: string[]) => {
    selectedKeys.value = keys
  }

  const toggleOpenKey = (key: string) => {
    const index = openKeys.value.indexOf(key)
    if (index > -1) {
      openKeys.value.splice(index, 1)
    } else {
      openKeys.value.push(key)
    }
  }

  return {
    openKeys,
    selectedKeys,
    setOpenKeys,
    setSelectedKeys,
    toggleOpenKey
  }
}) 