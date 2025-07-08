import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    console.log('요청 보내기 전 실행')
    return config
  },
  (error) => {
    console.log('요청할 때 에러 처리')
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    console.log('응답을 받기 전 실행')
    return response
  },
  (error) => {
    console.log('응답 받을 때 에러 처리')
    return Promise.reject(error)
  },
)

export default api
