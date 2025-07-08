import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('auth', () => {
  const isLogin = ref(false)

  const login = () => {
    isLogin.value = true
    localStorage.setItem('isLogin', 'true')
  }

  const proceedLogout = () => {
    isLogin.value = false
    localStorage.removeItem('isLogin')
  }

  const restore = () => {
    isLogin.value = localStorage.getItem('isLogin') === 'true'
  }

  return { isLogin, login, proceedLogout, restore }
})
