import axios from 'axios'

// 환경 설정 및 상수
const API_TIMEOUT = 5000

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('요청 에러:', error.message)
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', response.config.url, response.status)
    return response
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url
    const message = error.response?.data?.message || error.message
    
    console.error('API 응답 에러:', {
      url,
      status,
      message
    })
    
    return Promise.reject(error)
  }
)

export default api