import api from '@/plugins/axiosinterceptor'

const toggleScrap = async (targetType, targetId) => {
  const res = await api.post(`api/scrap?targetType=${targetType}&targetId=${targetId}`)

  // HTTP 상태 200~299가 아니면 throw
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`좋아요 실패: ${res.status}`)
  }

  return res.data
}

export default { toggleScrap }
