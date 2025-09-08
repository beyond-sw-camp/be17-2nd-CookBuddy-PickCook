import api from '@/plugins/axiosinterceptor'

/**
 * 쇼핑 관련 API 함수들 (수정된 버전)
 */

/**
 * 모든 상품 목록 조회 (정렬 파라미터 추가)
 */
const getAllProducts = async (page, size, sort = 'id', dir = 'ASC') => {
  try {
    const response = await api.get(`/api/products?page=${page}&size=${size}&sort=${sort}&dir=${dir}`)
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
export const getProductReviews = async (productId, filterRequest) => {
  const params = new URLSearchParams()
  
  // null이 아닌 값들만 파라미터로 추가
  if (filterRequest.rating !== null && filterRequest.rating !== undefined) {
    params.append('rating', filterRequest.rating)
  }
  if (filterRequest.sortType) {
    params.append('sortType', filterRequest.sortType)
  }
  if (filterRequest.period) {
    params.append('period', filterRequest.period)
  }
  if (filterRequest.imageFilter) {
    params.append('imageFilter', filterRequest.imageFilter)
  }
  if (filterRequest.page !== undefined) {
    params.append('page', filterRequest.page)
  }
  if (filterRequest.size) {
    params.append('size', filterRequest.size)
  }

  const url = `/api/reviews/products/${productId}?${params.toString()}`
  console.log('실제 호출 URL:', url) // 확인용
  
  const response = await api.get(url)
  return response.data.results
}

/**
 * 카테고리별 상품 조회 (정렬 파라미터 추가)
 */
const getProductsByCategory = async (categoryId, page = 0, size = 10, sort = 'id', dir = 'ASC') => {
  try {
    const response = await api.get(`/api/products/category/${categoryId}?page=${page}&size=${size}&sort=${sort}&dir=${dir}`)
    return response.data.results || []
  } catch (error) {
    console.error('카테고리별 상품 조회 실패:', error)
    throw error
  }
}

/**
 * 상품 검색 (정렬 파라미터 추가)
 */
const searchProducts = async (keyword, page = 0, size = 10, sort = 'id', dir = 'ASC') => {
  try {
    const response = await api.get('/api/products/search', {
      params: { keyword, page, size, sort, dir }
    })
    return response.data.results || []
  } catch (error) {
    console.error('상품 검색 실패:', error)
    throw error
  }
}

// 기존 코드 유지하고 아래 함수 추가

/**
 * 레시피 기반 연관 상품 조회 (🆕 새로 추가)
 */
const getRelatedProductsByRecipe = async (recipeId) => {
  try {
    const response = await api.get(`/api/products/recipe/${recipeId}/related`)
    return response.data.results || []
  } catch (error) {
    console.error('레시피 연관 상품 조회 실패:', error)
    throw error
  }
}

const shoppingAPI = {
  getAllProducts,
  getProductDetail,
  getProductReviews,
  getProductsByCategory,
  searchProducts,
  getRelatedProductsByRecipe
}

export default shoppingAPI