import api from '@/plugins/axiosinterceptor'

const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password })
    
    return { 
      success: response.data.success, 
      user: response.data.results, // 핵심: results
      message: response.data.message
    }
  } catch (error) {
    const errorData = error.response?.data
    return { 
      success: false, 
      message: errorData?.message || '로그인 중 오류가 발생했습니다.'
    }
  }
}

// 로그아웃 API 함수 추가
const logout = async () => {
  try {
    const response = await api.post('/api/user/logout')
    // BaseResponse: { success: true, code: 20102, message: "로그아웃이 완료되었습니다.", results: null }
    return {
      success: response.data.success,
      message: response.data.message
    }
  } catch (error) {
    const errorData = error.response?.data
    return {
      success: false,
      message: errorData?.message || '로그아웃 중 오류가 발생했습니다.'
    }
  }
}

// 사용자 정보 확인 API - BaseResponse 형식으로 수정
// 사용자 정보 확인 API - 캐시 방지 개선
const getCurrentUser = async () => {
  try {
    // 캐시 방지를 위한 타임스탬프 추가
    const timestamp = Date.now()
    
    const response = await api.get(`/api/user/me?_t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    console.log('서버 응답 (getCurrentUser):', response.data)
    
    // BaseResponse: { success: true, code: 20000, message: "...", results: UserDto.Response }
    return { 
      success: response.data.success, 
      user: response.data.results,
      message: response.data.message
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error)
    // 에러 응답도 BaseResponse 형식
    const errorData = error.response?.data
    return { 
      success: false, 
      message: errorData?.message || '인증되지 않은 사용자입니다.' 
    }
  }
}

// 회원가입 API - BaseResponse 형식으로 수정
const signup = async (signupData) => {
  try {
    console.log('회원가입 요청 데이터:', signupData) // 🔧 디버깅 로그 추가

    const response = await api.post('/api/user/signup', {
      email: signupData.email,
      nickname: signupData.nickname,
      password: signupData.password,
      name: signupData.name,
      phone: signupData.phone
    })

    console.log('회원가입 서버 응답:', response.data)

    // BaseResponse: { success: true, code: 20100, message: "회원가입이 완료되었습니다...", results: null }
    return { 
      success: response.data.success, 
      message: response.data.message 
    }
  } catch (error) {
    console.error('회원가입 실패:', error)
    // 에러 응답도 BaseResponse 형식
    const errorData = error.response?.data
    return { 
      success: false, 
      message: errorData?.message || '회원가입 중 오류가 발생했습니다.' 
    }
  }
}

// 이메일 중복체크 API - BaseResponse 형식으로 수정
const checkEmailDuplicate = async (email) => {
  try {
    const response = await api.get(`/api/user/check-email?email=${email}`)
    // BaseResponse: { success: true/false, message: "...", results: { available: true/false } }
    return {
      success: response.data.success,
      available: response.data.results.available,
      message: response.data.message
    }
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error)
    return {
      success: false,
      available: false,
      message: '이메일 중복 확인 중 오류가 발생했습니다.'
    }
  }
}

const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await api.get(`/api/user/check-nickname?nickname=${nickname}`)
    // BaseResponse: { success: true/false, message: "...", results: { available: true/false } }
    return {
      success: response.data.success,
      available: response.data.results.available,
      message: response.data.message
    }
  } catch (error) {
    return {
      success: false,
      available: false,
      message: '닉네임 중복 확인 중 오류가 발생했습니다.'
    }
  }
}

// 프로필 수정 API도 개선
const updateProfile = async (profileData) => {
  try {
    console.log('프로필 수정 요청 데이터:', profileData)
    
    const response = await api.patch('/api/user/profile', profileData)
    
    console.log('프로필 수정 서버 응답:', response.data)
    
    // BaseResponse: { success: true, code: 20105, message: "...", results: UserDto.Response }
    return {
      success: response.data.success,
      user: response.data.results,
      message: response.data.message
    }
  } catch (error) {
    console.error('프로필 수정 실패:', error)
    const errorData = error.response?.data
    return {
      success: false,
      message: errorData?.message || '프로필 수정 중 오류가 발생했습니다.'
    }
  }
}

const findEmail = async (name, phone) => {
  try {
    console.log('아이디 찾기 요청:', { name, phone })
    
    // 🔧 수정: 정확한 필드명으로 전송
    const requestData = { name: name, phone: phone }
    console.log('실제 전송 데이터:', requestData)
    
    const response = await api.post('/api/user/find-email', requestData)
    
    console.log('아이디 찾기 응답:', response.data)
    
    return {
      success: response.data.success,
      data: response.data.results,
      message: response.data.message
    }
  } catch (error) {
    console.error('아이디 찾기 실패:', error)
    console.error('에러 상세:', error.response?.data)
    const errorData = error.response?.data
    return {
      success: false,
      message: errorData?.message || '아이디 찾기 중 오류가 발생했습니다.'
    }
  }
}

// 🔧 추가: 비밀번호 재설정 요청 API
const requestPasswordReset = async (email) => {
  try {
    console.log('비밀번호 재설정 요청:', { email })
    
    const response = await api.post('/api/user/request-password-reset', { email })
    
    console.log('비밀번호 재설정 응답:', response.data)
    
    return {
      success: response.data.success,
      message: response.data.message
    }
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error)
    const errorData = error.response?.data
    return {
      success: false,
      message: errorData?.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.'
    }
  }
}

// 회원탈퇴 API 함수 추가
const withdrawUser = async (withdrawData) => {
  try {
    const response = await api.post('/api/user/withdraw', withdrawData)
    // BaseResponse: { success: true, code: 20108, message: "...", results: WithdrawResponse }
    return {
      success: response.data.success,
      data: response.data.results,
      message: response.data.message
    }
  } catch (error) {
    const errorData = error.response?.data
    return {
      success: false,
      message: errorData?.message || '회원탈퇴 중 오류가 발생했습니다.'
    }
  }
}


export default {
  logout, login, getCurrentUser, signup, checkEmailDuplicate, updateProfile,
  checkNicknameDuplicate, findEmail, requestPasswordReset, withdrawUser
}
