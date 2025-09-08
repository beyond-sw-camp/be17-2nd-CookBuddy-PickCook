import api from '@/plugins/axiosinterceptor'

const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`api/reviews.json?v=1.0.0`)

    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data

    console.log('파싱된 데이터:', data)
    console.log('배열인지 확인:', Array.isArray(data))

    const productReviews = response.data.find((item) => item.productId == productId)

    if (!productReviews) {
      return { productId, reviews: [] }
    }

    return productReviews
  } catch (error) {
    console.error('리뷰 데이터 로딩 실패:', error)
    return { productId, reviews: [] }
  }
}

const getAllReviews = async () => {
  const response = await api.get('api/reviews.json')
  return response.data
}

const reviewAPI = {
  getProductReviews,
  getAllReviews,
}

export default reviewAPI
