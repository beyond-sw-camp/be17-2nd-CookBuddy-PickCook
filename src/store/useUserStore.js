import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('auth', () => {
  const isLogin = ref(false)

  const testEmail = 'test@test.com'
  const testPassword = 'qwer1234'

  const signup = () => {
    // 회원가입 과정...
    isLogin.value = true
    localStorage.setItem('isLogin', 'true')
  }

  const checkLogin = (email, password) => {
    if (testEmail === email && testPassword === password) {
      isLogin.value = true
      localStorage.setItem('isLogin', 'true')
    }
  }

  const proceedLogout = () => {
    isLogin.value = false
    localStorage.removeItem('isLogin')
  }

  const restore = () => {
    isLogin.value = localStorage.getItem('isLogin') === 'true'
  }

  return { isLogin, signup, checkLogin, proceedLogout, restore }
})
