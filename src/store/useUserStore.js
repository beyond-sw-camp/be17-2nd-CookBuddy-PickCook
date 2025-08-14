import { defineStore } from 'pinia'
import { reactive } from 'vue'
import api from '@/api/login/index.js'

export const useUserStore = defineStore('auth', () => {
  const state = reactive({
    isLogin: false,
    user: null,
    loading: false
  })

  const login = async (email, password) => {
  state.loading = true

  try {
    const result = await api.login(email, password)

    if (result.success) {
      state.isLogin = true
      state.user = result.user
      
      // 여기가 핵심! user 정보를 return에 포함
      return { 
        success: true, 
        user: result.user, // 이 줄 추가!
        message: '로그인 성공' 
      }
    } else {
      return { success: false, message: result.message }
    }
  } catch (error) {
    console.error('로그인 처리 중 오류:', error)
    return { success: false, message: '로그인 중 오류가 발생했습니다.' }
  } finally {
    state.loading = false
  }
}


  const signup = async (signupData) => {
    state.loading = true
  
    try {
      const result = await api.signup(signupData)
    
      if (result.success) {
        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('회원가입 처리 중 오류:', error)
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
    } finally {
      state.loading = false
    }
  }

  const proceedLogout = async () => {
    state.loading = true
    
    try {
      // logout API가 없다면 클라이언트 사이드에서만 처리
      state.isLogin = false
      state.user = null
      
      // 쿠키 삭제 (만약 필요하다면)
      document.cookie = 'PICKCOOK_AT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      return { success: true, message: '로그아웃 성공' }
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error)
      state.isLogin = false
      state.user = null
      return { success: false, message: '로그아웃 중 오류가 발생했습니다.' }
    } finally {
      state.loading = false
    }
  }

  const restore = async () => {
  state.loading = true
  
  try {
    const result = await api.getCurrentUser()
    
    if (result.success) {
      state.isLogin = true
      state.user = result.user
      return true
    } else {
      state.isLogin = false
      state.user = null
      return false
    }
  } catch (error) {
    console.error('사용자 정보 확인 중 오류:', error)
    state.isLogin = false
    state.user = null
    return false
  } finally {
    state.loading = false
  }
  }
  
  const checkEmailDuplicate = async (email) => {
    state.loading = true
    
    try {
      const result = await api.checkEmailDuplicate(email)
      // BaseResponse 형식에 맞게 수정된 API 응답 그대로 반환
      return {
        success: result.success,
        available: result.available,
        message: result.message
      }
    } catch (error) {
      console.error('이메일 중복 확인 중 오류:', error)
      return { 
        success: false, 
        available: false,
        message: '이메일 중복 확인 중 오류가 발생했습니다.' 
      }
    } finally {
      state.loading = false
    }
  }
  
  return { state, login, signup, proceedLogout, restore, checkEmailDuplicate }

})