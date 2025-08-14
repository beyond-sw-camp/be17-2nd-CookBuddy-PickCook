import api from '@/plugins/axiosinterceptor'

const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password })
    return { 
      success: true, 
      user: response.data,
      message: '로그인 성공'
    }
  } catch (error) {
    console.error('로그인 실패:', error)
    
    if (error.response?.status === 401) {
      return { 
        success: false, 
        type: 'auth_failed', 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      }
    }
    
    return { 
      success: false, 
      type: 'server_error', 
      message: '로그인 중 오류가 발생했습니다.' 
    }
  }
}

// 사용자 정보 확인 API
const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user/me')
    return { success: true, user: response.data }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error)
    return { success: false, message: '인증되지 않은 사용자입니다.' }
  }
}

const signup = async (signupData) => {
  try {
    const response = await api.post('/api/user/signup', {
      email: signupData.email,
      nickname: signupData.nickname,
      password: signupData.password
    })
    return { success: true, message: response.data }
  } catch (error) {
    console.error('회원가입 실패:', error)
    const errorMessage = error.response?.data || '회원가입 중 오류가 발생했습니다.'
    return { success: false, message: errorMessage }
  }
}

const checkEmailDuplicate = async (email) => {
  try {
    const response = await api.get(`/api/user/check-email?email=${email}`)
    return {
      success: true,
      available: response.data.available,
      message: response.data.message
    }
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error)
    return {
      success: false,
      message: '이메일 중복 확인 중 오류가 발생했습니다.'
    }
  }
}


export default { login, getCurrentUser, signup, checkEmailDuplicate }
