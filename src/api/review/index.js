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

const getPresignedUrl = async (formData) => {
  let data = {}

  let url = '/api/image-upload'

  await api
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const uploadImage = async (presigedUrl, file) => {
  let data = {}
  await api
    .put(presigedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      withCredentials: false,
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const reviewWrite = async (orderId, productId, payload) => {
  try {
    const url = `/api/reviews/orders/${orderId}/products/${productId}`
    const res = await api.post(url, payload)
    return res.data
  } catch (error) {
    console.error('리뷰 작성 API 에러:', error)
    return error.response?.data || { success: false, message: 'API 요청 실패' }
  }
}


const getMyReviews = async () => {
  try {
    const url = `/api/reviews/my`
    const res = await api.get(url)
    return res.data
  } catch (error) {
    console.error('리뷰 받아오기 API 에러:', error)
    return error.response?.data || { success: false, message: 'API 요청 실패' }
  }
}

const deleteReview = async (reviewId) => {
  try {
    const url = `/api/reviews/${reviewId}`
    const res = await api.delete(url)
    return res.data
  } catch (error) {
    console.error('리뷰 삭제 API 에러:', error)
    return error.response?.data || { success: false, message: 'API 요청 실패' }
  }
}

const reviewAPI = {
  getProductReviews,
  getAllReviews,
  getPresignedUrl,
  uploadImage,
  reviewWrite,
  getMyReviews,
  deleteReview,
}

export default reviewAPI
