import api from '@/plugins/axiosinterceptor'

/**
 * 냉장고 API 함수들
 * - 실제 백엔드 API 엔드포인트 사용
 * - BaseResponse 구조에 맞춰 응답 처리
 */

// =================================================================
// 카테고리 관련 API
// =================================================================

/**
 * 전체 카테고리 목록 조회
 */
const getCategories = async () => {
  try {
    const response = await api.get('/api/categories')
    return response.data.results || []
  } catch (error) {
    console.error('카테고리 조회 실패:', error)
    throw error
  }
}

/**
 * 사용자가 실제 사용 중인 카테고리 조회
 */
const getActiveCategories = async () => {
  try {
    const response = await api.get('/api/categories/active')
    return response.data.results || []
  } catch (error) {
    console.error('활성 카테고리 조회 실패:', error)
    throw error
  }
}

/**
 * 카테고리별 통계 정보 조회
 */
const getCategorySummary = async () => {
  try {
    const response = await api.get('/api/categories/summary')
    return response.data.results || []
  } catch (error) {
    console.error('카테고리 통계 조회 실패:', error)
    throw error
  }
}

// =================================================================
// 냉장고 아이템 관련 API
// =================================================================

/**
 * 사용자의 모든 냉장고 아이템 조회
 */
const getIngredients = async () => {
  try {
    const response = await api.get('/api/refrigerator/items')
    return response.data.results || []
  } catch (error) {
    console.error('냉장고 아이템 조회 실패:', error)
    throw error
  }
}

/**
 * 특정 냉장고 아이템 조회
 */
const getIngredient = async (itemId) => {
  try {
    const response = await api.get(`/api/refrigerator/items/${itemId}`)
    return response.data.results
  } catch (error) {
    console.error('냉장고 아이템 상세 조회 실패:', error)
    throw error
  }
}

/**
 * 새 냉장고 아이템 추가
 */
const addIngredient = async (ingredientData) => {
  try {
    const response = await api.post('/api/refrigerator/items', ingredientData)
    return response.data.results
  } catch (error) {
    console.error('냉장고 아이템 추가 실패:', error)
    throw error
  }
}

/**
 * 냉장고 아이템 수정
 */
const updateIngredient = async (itemId, ingredientData) => {
  try {
    const response = await api.put(`/api/refrigerator/items/${itemId}`, ingredientData)
    return response.data.results
  } catch (error) {
    console.error('냉장고 아이템 수정 실패:', error)
    throw error
  }
}

/**
 * 냉장고 아이템 삭제
 */
const deleteIngredient = async (itemId) => {
  try {
    const response = await api.delete(`/api/refrigerator/items/${itemId}`)
    return response.data
  } catch (error) {
    console.error('냉장고 아이템 삭제 실패:', error)
    throw error
  }
}

/**
 * 삭제된 아이템 복원 (실행 취소)
 */
const undoDeleteIngredient = async (itemId) => {
  try {
    const response = await api.post(`/api/refrigerator/items/${itemId}/undo`)
    return response.data
  } catch (error) {
    console.error('냉장고 아이템 복원 실패:', error)
    throw error
  }
}

// =================================================================
// 검색 및 필터링 API
// =================================================================

/**
 * 키워드로 냉장고 아이템 검색
 */
const searchIngredients = async (keyword) => {
  try {
    const response = await api.get('/api/refrigerator/items/search', {
      params: { keyword }
    })
    return response.data.results || []
  } catch (error) {
    console.error('냉장고 아이템 검색 실패:', error)
    throw error
  }
}

/**
 * 복합 필터로 냉장고 아이템 조회
 */
const filterIngredients = async (filterData) => {
  try {
    const response = await api.post('/api/refrigerator/items/filter', filterData)
    return response.data.results || []
  } catch (error) {
    console.error('냉장고 아이템 필터링 실패:', error)
    throw error
  }
}

/**
 * 특정 위치의 아이템 조회
 */
const getIngredientsByLocation = async (location) => {
  try {
    const response = await api.get(`/api/refrigerator/items/location/${location}`)
    return response.data.results || []
  } catch (error) {
    console.error('위치별 아이템 조회 실패:', error)
    throw error
  }
}

/**
 * 특정 카테고리의 아이템 조회
 */
const getIngredientsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/refrigerator/items/category/${categoryId}`)
    return response.data.results || []
  } catch (error) {
    console.error('카테고리별 아이템 조회 실패:', error)
    throw error
  }
}

// =================================================================
// 특수 기능 API
// =================================================================

/**
 * 일괄 아이템 추가 (구매 → 냉장고 등록)
 */
const addBulkIngredients = async (itemsData) => {
  try {
    const response = await api.post('/api/refrigerator/items/bulk', { items: itemsData })
    return response.data.results || []
  } catch (error) {
    console.error('일괄 아이템 추가 실패:', error)
    throw error
  }
}

/**
 * 유통기한 임박 아이템 조회
 */
const getExpiringIngredients = async (days = 3) => {
  try {
    const response = await api.get('/api/refrigerator/items/expiring', {
      params: { days }
    })
    return response.data.results || []
  } catch (error) {
    console.error('유통기한 임박 아이템 조회 실패:', error)
    throw error
  }
}

/**
 * 만료된 아이템 조회
 */
const getExpiredIngredients = async () => {
  try {
    const response = await api.get('/api/refrigerator/items/expired')
    return response.data.results || []
  } catch (error) {
    console.error('만료된 아이템 조회 실패:', error)
    throw error
  }
}

const getSyncPrompt = async () => {
  try {
    const response = await api.get('/api/refrigerator/items/sync-prompt')
    return response.data.results
  } catch (error) {
    console.error('동기화 메시지 조회 실패:', error)
    throw error
  }
}

// =================================================================
// Export
// =================================================================

export default {
  // 카테고리
  getCategories,
  getActiveCategories,
  getCategorySummary,
  
  // 기본 CRUD
  getIngredients,
  getIngredient,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  undoDeleteIngredient,
  
  // 검색/필터링
  searchIngredients,
  filterIngredients,
  getIngredientsByLocation,
  getIngredientsByCategory,
  
  // 특수 기능
  addBulkIngredients,
  getExpiringIngredients,
  getExpiredIngredients,
  getSyncPrompt
}