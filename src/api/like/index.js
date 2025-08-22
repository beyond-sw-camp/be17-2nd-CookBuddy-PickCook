import api from '@/plugins/axiosinterceptor'

const toggleLike = async (targetType, targetId) => {
  try {
    await api.post(`/likes?targetType=${targetType}&targetId=${targetId}`)
  } catch (error) {
    console.error('❌ 좋아요 API 오류:', error)
  }
}

export default { toggleLike }