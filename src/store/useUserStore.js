import { defineStore } from 'pinia'
import { reactive } from 'vue'
import api from '@/api/user/index.js'

export const useUserStore = defineStore('auth', () => {
  const state = reactive({
    isLogin: false,
    user: null,
    loading: false,
    initialized: false // 🔧 추가: 초기화 상태 추적
  })

  // 🔧 단순화: 한 번의 초기화만 수행
  const initialize = async () => {
    if (state.initialized) return state.isLogin
    
    state.loading = true
    console.log('🔄 사용자 상태 초기화 시작...')
    
    try {
      const result = await api.getCurrentUser()
      
      if (result.success) {
        state.isLogin = true
        state.user = result.user
        console.log('✅ 초기화 성공:', result.user?.nickname)
      } else {
        state.isLogin = false
        state.user = null
        console.log('❌ 초기화 실패:', result.message)
      }
    } catch (error) {
      console.log('❌ 초기화 오류:', error.message)
      state.isLogin = false
      state.user = null
    } finally {
      state.initialized = true
      state.loading = false
    }
    
    return state.isLogin
  }

  const login = async (email, password) => {
    state.loading = true

    try {
      const result = await api.login(email, password)

      if (result.success) {
        state.isLogin = true
        state.user = result.user
        state.initialized = true // 🔧 로그인 성공 시 초기화 완료
        
        return { 
          success: true, 
          user: result.user,
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
  
  const logout = async () => {
    state.loading = true
    
    try {
      const result = await api.logout()
      
      // 🔧 단순화: 상태 완전 초기화
      state.isLogin = false
      state.user = null
      state.initialized = false // 🔧 초기화 상태도 리셋
      
      return { 
        success: true, 
        message: result.success ? result.message : '로그아웃이 완료되었습니다.' 
      }
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
      
      // 에러 발생해도 프론트엔드 상태는 초기화
      state.isLogin = false
      state.user = null
      state.initialized = false
      
      return { 
        success: true, 
        message: '로그아웃이 완료되었습니다.' 
      }
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

  // 🔧 단순화: getCurrentUser는 initialize를 호출
  const getCurrentUser = async () => {
    if (!state.initialized) {
      return await initialize()
    }
    
    // 이미 초기화되었으면 현재 상태 반환
    return {
      success: state.isLogin,
      user: state.user,
      message: state.isLogin ? '인증된 사용자입니다.' : '로그인이 필요합니다.'
    }
  }
  
  const updateProfile = async (profileData) => {
    state.loading = true
    
    try {
      const result = await api.updateProfile(profileData)
      
      if (result.success) {
        // 성공 시 스토어의 사용자 정보도 업데이트
        state.user = { ...state.user, ...result.user }
        
        return { 
          success: true, 
          message: result.message,
          user: result.user 
        }
      } else {
        return { 
          success: false, 
          message: result.message 
        }
      }
    } catch (error) {
      console.error('프로필 수정 중 오류:', error)
      return { 
        success: false, 
        message: '프로필 수정 중 오류가 발생했습니다.' 
      }
    } finally {
      state.loading = false
    }
  }

  const checkEmailDuplicate = async (email) => {
    state.loading = true
    
    try {
      const result = await api.checkEmailDuplicate(email)
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

  const checkNicknameDuplicate = async (nickname) => {
    state.loading = true
  
    try {
      const result = await api.checkNicknameDuplicate(nickname)
      return {
        success: result.success,
        available: result.available,
        message: result.message
      }
    } catch (error) {
      console.error('닉네임 중복 확인 중 오류:', error)
      return { 
        success: false, 
        available: false,
        message: '닉네임 중복 확인 중 오류가 발생했습니다.' 
      }
    } finally {
      state.loading = false
    }
  }

  const withdrawUser = async (withdrawData) => {
    state.loading = true
    
    try {
      const result = await api.withdrawUser(withdrawData)
      
      if (result.success) {
        // 탈퇴 성공 시 상태 초기화
        state.isLogin = false
        state.user = null
        state.initialized = false
        
        return { 
          success: true, 
          data: result.data,
          message: result.message 
        }
      } else {
        return { 
          success: false, 
          message: result.message 
        }
      }
    } catch (error) {
      console.error('회원탈퇴 중 오류:', error)
      return { 
        success: false, 
        message: '회원탈퇴 중 오류가 발생했습니다.' 
      }
    } finally {
      state.loading = false
    }
  }
  
  return {
    state, 
    initialize, // 🔧 새로운 초기화 메서드
    login, 
    logout, 
    signup, 
    getCurrentUser, 
    updateProfile, 
    checkEmailDuplicate,
    checkNicknameDuplicate, 
    withdrawUser
  }
})