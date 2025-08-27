import api from '@/plugins/axiosinterceptor'

/**
 * 쇼핑 관련 API 함수들 (수정된 버전)
 */

/**
 * 모든 상품 목록 조회
 */
const getAllProducts = async (page, size) => {
  try {
    const response = await api.get(`/api/products?page=${page}&size=${size}&sort=id&dir=ASC`)
    return response.data.results || []
  } catch (error) {
    console.error('상품 목록 조회 실패:', error)
    throw error
  }
}

/**
 * 특정 상품 상세 정보 조회 (✅ 수정됨)
 */
const getProductDetail = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}`)
    
    console.log('API 응답 전체:', response.data)
    
    // ✅ 백엔드가 직접 객체를 반환하므로 바로 사용
    if (response.data && response.data.id) {
      return response.data
    } else {
      throw new Error('상품 데이터가 없습니다.')
    }
  } catch (error) {
    console.error('상품 상세 조회 실패:', error)
    console.error('응답 데이터:', error.response?.data)
    throw error
  }
}


/**
 * 상품 리뷰 조회 (✅ 새로 추가)
 */
const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}/reviews`)
    return response.data.results || []
  } catch (error) {
    console.error('리뷰 조회 실패:', error)
    throw error
  }
}

/**
 * 카테고리별 상품 조회 (✅ 새로 추가)
 */
const getProductsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/products/category/${categoryId}`)
    return response.data.results || []
  } catch (error) {
    console.error('카테고리별 상품 조회 실패:', error)
    throw error
  }
}

/**
 * 상품 검색 (✅ 새로 추가)
 */
const searchProducts = async (keyword) => {
  try {
    const response = await api.get('/api/products/search', {
      params: { keyword }
    })
    return response.data.results || []
  } catch (error) {
    console.error('상품 검색 실패:', error)
    throw error
  }
}

const shoppingAPI = {
  getAllProducts,
  getProductDetail,
  getProductReviews,
  getProductsByCategory,
  searchProducts
}

export default shoppingAPI