import { defineStore } from 'pinia'
import { reactive } from 'vue'
import api from '@/api/user/index.js'

export const useUserStore = defineStore('auth', () => {
  // 상태 정의
  const state = reactive({
    isLogin: false,
    user: null,
    loading: false,
    initialized: false
  })

  // 유틸리티 함수들
  const withLoading = async (asyncFn) => {
    state.loading = true
    try {
      return await asyncFn()
    } finally {
      state.loading = false
    }
  }

  const updateLoginState = (user) => {
    state.isLogin = true
    state.user = user
    state.initialized = true
  }

  const clearLoginState = () => {
    state.isLogin = false
    state.user = null
    state.initialized = false
  }

  // 핵심 상태 관리 함수들
  const initialize = async () => {
    if (state.initialized) return state.isLogin
    
    return withLoading(async () => {
      const result = await api.getCurrentUser()
      
      if (result.success) {
        updateLoginState(result.user)
        console.log('초기화 성공:', result.user?.nickname)
      } else {
        clearLoginState()
        console.log('초기화 실패:', result.message)
      }
      
      return state.isLogin
    })
  }

  const getCurrentUser = async () => {
    if (!state.initialized) {
      await initialize()
    }
    
    return {
      success: state.isLogin,
      user: state.user,
      message: state.isLogin ? '인증된 사용자입니다.' : '로그인이 필요합니다.'
    }
  }

  // 인증 관련 함수들
  const login = async (email, password) => {
    return withLoading(async () => {
      const result = await api.login(email, password)
      
      if (result.success) {
      console.log('🏪 Store login - 받은 사용자 정보:', result.user)
      updateLoginState(result.user)  // 여기서 잘못된 데이터가 설정될 수 있음
    }
      
      return result
    })
  }

  const logout = async () => {
    return withLoading(async () => {
      const result = await api.logout()
      
      // API 성공/실패와 관계없이 프론트엔드 상태는 초기화
      clearLoginState()
      
      return {
        success: true,
        message: result.message || '로그아웃이 완료되었습니다.'
      }
    })
  }

  // 사용자 관리 함수들
  const signup = async (signupData) => {
    return withLoading(async () => {
      return await api.signup(signupData)
    })
  }

  const updateProfile = async (profileData) => {
    return withLoading(async () => {
      const result = await api.updateProfile(profileData)
      
      if (result.success) {
        // 성공 시 스토어의 사용자 정보 업데이트
        state.user = { ...state.user, ...result.user }
      }
      
      return result
    })
  }

  const withdrawUser = async (withdrawData) => {
    return withLoading(async () => {
      const result = await api.withdrawUser(withdrawData)
      
      if (result.success) {
        // 탈퇴 성공 시 상태 초기화
        clearLoginState()
      }
      
      return result
    })
  }

  // 검증 관련 함수들
  const checkEmailDuplicate = async (email) => {
    return withLoading(async () => {
      return await api.checkEmailDuplicate(email)
    })
  }

  const checkNicknameDuplicate = async (nickname) => {
    return withLoading(async () => {
      return await api.checkNicknameDuplicate(nickname)
    })
  }

  const generatePasswordChangeToken = async () => {
  return withLoading(async () => {
    return await api.generatePasswordChangeToken()
  })
}

  return {
    state,
    initialize,
    getCurrentUser,
    login,
    logout,
    signup,
    updateProfile,
    withdrawUser,
    checkEmailDuplicate,
    checkNicknameDuplicate,
    generatePasswordChangeToken
  }
})