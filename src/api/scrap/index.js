import api from '@/plugins/axiosinterceptor'

const toggleScrap = async (targetType, targetId) => {
  try {
    await api.post(`/scrap?targetType=${targetType}&targetId=${targetId}`)
  } catch (error) {
    console.error('❌ 스크랩 API 오류:', error)
  }
}

export default { toggleScrap }