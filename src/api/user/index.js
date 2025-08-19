import api from '@/plugins/axiosinterceptor'

// 상수 정의
const ERROR_MESSAGES = {
  LOGIN: '로그인 중 오류가 발생했습니다.',
  LOGOUT: '로그아웃 중 오류가 발생했습니다.',
  GET_USER: '인증되지 않은 사용자입니다.',
  SIGNUP: '회원가입 중 오류가 발생했습니다.',
  EMAIL_CHECK: '이메일 중복 확인 중 오류가 발생했습니다.',
  NICKNAME_CHECK: '닉네임 중복 확인 중 오류가 발생했습니다.',
  PROFILE_UPDATE: '프로필 수정 중 오류가 발생했습니다.',
  FIND_EMAIL: '아이디 찾기 중 오류가 발생했습니다.',
  PASSWORD_RESET: '비밀번호 재설정 요청 중 오류가 발생했습니다.',
  WITHDRAW: '회원탈퇴 중 오류가 발생했습니다.',
  DEFAULT: '요청 처리 중 오류가 발생했습니다.'
}

// 유틸리티 함수들
const normalizeResponse = (data) => {
  if (data.success !== undefined) {
    return {
      success: data.success,
      message: data.message,
      results: data.results,
      user: data.results,
      data: data.results,
      available: data.results?.available
    }
  }
  
  return {
    success: true,
    message: '성공',
    results: data,
    user: data,
    data: data
  }
}

const normalizeError = (error, defaultMessage) => {
  const errorData = error.response?.data
  return {
    success: false,
    message: errorData?.message || defaultMessage,
    results: null,
    user: null,
    data: null,
    available: false
  }
}

const apiCall = async (requestFn, defaultErrorMessage = ERROR_MESSAGES.DEFAULT) => {
  try {
    const response = await requestFn()
    return normalizeResponse(response.data)
  } catch (error) {
    console.error('API 에러:', error.config?.url, error.response?.status)
    return normalizeError(error, defaultErrorMessage)
  }
}

const addCacheBuster = (url) => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_t=${Date.now()}`
}

// 인증 관련 API
const login = async (email, password) => {
  return apiCall(
    () => api.post('/login', { email, password }),
    ERROR_MESSAGES.LOGIN
  )
}

const logout = async () => {
  return apiCall(
    () => api.post('/api/user/logout'),
    ERROR_MESSAGES.LOGOUT
  )
}

const getCurrentUser = async () => {
  return apiCall(
    () => api.get(addCacheBuster('/api/user/me'), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }),
    ERROR_MESSAGES.GET_USER
  )
}

// 회원가입 관련 API
const signup = async (signupData) => {
  const requestData = {
    email: signupData.email,
    nickname: signupData.nickname,
    password: signupData.password,
    name: signupData.name,
    phone: signupData.phone,
    zipCode: signupData.zipCode || '',
    address: signupData.address || '',
    detailAddress: signupData.detailAddress || ''
  }

  // 🔧 강화된 디버깅: API 계층에서 데이터 확인
  console.log('🚀 API 계층 - 회원가입 요청 데이터:')
  console.log('받은 데이터:', signupData)
  console.log('전송할 데이터:', requestData)
  console.log('필드별 상세:')
  console.log('  - email    :', requestData.email)
  console.log('  - nickname :', requestData.nickname, '(닉네임)')
  console.log('  - name     :', requestData.name, '(실명)')
  console.log('  - phone    :', requestData.phone)
  console.log('  - address  :', requestData.address)
  console.log('=' .repeat(60))
  
  return apiCall(
    () => api.post('/api/user/signup', requestData),
    ERROR_MESSAGES.SIGNUP
  )
}

const checkEmailDuplicate = async (email) => {
  return apiCall(
    () => api.get(`/api/user/check-email?email=${email}`),
    ERROR_MESSAGES.EMAIL_CHECK
  )
}

const checkNicknameDuplicate = async (nickname) => {
  return apiCall(
    () => api.get(`/api/user/check-nickname?nickname=${nickname}`),
    ERROR_MESSAGES.NICKNAME_CHECK
  )
}

// 프로필 관련 API
const updateProfile = async (profileData) => {
  return apiCall(
    () => api.patch('/api/user/profile', profileData),
    ERROR_MESSAGES.PROFILE_UPDATE
  )
}

const findEmail = async (name, phone) => {
  const requestData = { name, phone }
  
  return apiCall(
    () => api.post('/api/user/find-email', requestData),
    ERROR_MESSAGES.FIND_EMAIL
  )
}

const requestPasswordReset = async (email) => {
  return apiCall(
    () => api.post('/api/user/request-password-reset', { email }),
    ERROR_MESSAGES.PASSWORD_RESET
  )
}

const withdrawUser = async (withdrawData) => {
  return apiCall(
    () => api.post('/api/user/withdraw', withdrawData),
    ERROR_MESSAGES.WITHDRAW
  )
}

export default {
  login,
  logout,
  getCurrentUser,
  signup,
  checkEmailDuplicate,
  checkNicknameDuplicate,
  updateProfile,
  findEmail,
  requestPasswordReset,
  withdrawUser
}