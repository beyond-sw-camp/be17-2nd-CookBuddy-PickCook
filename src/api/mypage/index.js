import api from '@/plugins/axiosinterceptor'

// 장바구니 관련
const getCartList = async () => {
  try {
    const response = await api.get('/api/user/cart')
    return response.data.results || []
  } catch (error) {
    console.error('장바구니 목록 조회 실패:', error)
    return []
  }
}

// 주문 내역 관련
const getOrderList = async () => {
  try {
    const response = await api.get('/api/user/orders')
    return response.data.results || []
  } catch (error) {
    console.error('주문 내역 조회 실패:', error)
    return []
  }
}

// 내가 작성한 게시글
const getMyPosts = async (page, size, sort) => {
  try {
    const response = await api.get(`/api/posts/mplist?page=${page}&size=${size}&sortType=${sort}&filterType=my`)
    return response.data.results || []
  } catch (error) {
    console.error('내 게시글 조회 실패:', error)
    return []
  }
}

// 좋아요한 게시글
const getLikedPosts = async (page, size, sort) => {
  try {
    const response = await api.get(
      `/api/posts/mplist?page=${page}&size=${size}&sortType=${sort}&filterType=liked`,
    )
    return response.data.results || []
  } catch (error) {
    console.error('좋아요한 게시글 조회 실패:', error)
    return []
  }
}

// 스크랩한 게시글
const getScrappedPosts = async (page, size, sort) => {
  try {
    const response = await api.get(
      `/api/posts/mplist?page=${page}&size=${size}&sortType=${sort}&filterType=scrapped`,
    )
    return response.data.results || []
  } catch (error) {
    console.error('스크랩한 게시글 조회 실패:', error)
    return []
  }
}

// 댓글 단 게시글
const getCommentedPosts = async (page, size, sort) => {
  try {
    const response = await api.get(
      `/api/posts/mplist?page=${page}&size=${size}&sortType=${sort}&filterType=replied`,
    )
    return response.data.results || []
  } catch (error) {
    console.error('댓글 단 게시글 조회 실패:', error)
    return []
  }
}

// 사용자 정보 수정
const updateUserInfo = async (userData) => {
  try {
    const response = await api.patch('/api/user/profile', userData)
    return {
      success: response.data.success,
      message: response.data.message
    }
  } catch (error) {
    console.error('사용자 정보 수정 실패:', error)
    return { success: false, message: '정보 수정 중 오류가 발생했습니다.' }
  }
}

// 배송지 목록 조회
const getAddresses = async () => {
  try {
    const response = await api.get('/api/user/addresses')
    return {
      success: true,
      data: response.data.results || []
    }
  } catch (error) {
    console.error('배송지 목록 조회 실패:', error)
    return {
      success: false,
      message: error.response?.data?.message || '배송지 목록 조회 중 오류가 발생했습니다.',
      data: []
    }
  }
}

// 특정 배송지 조회
const getAddress = async (addressId) => {
  try {
    const response = await api.get(`/api/user/addresses/${addressId}`)
    return {
      success: true,
      data: response.data.results
    }
  } catch (error) {
    console.error('배송지 조회 실패:', error)
    return {
      success: false,
      message: error.response?.data?.message || '배송지 조회 중 오류가 발생했습니다.',
      data: null
    }
  }
}

// 배송지 추가
const createAddress = async (addressData) => {
  try {
    const response = await api.post('/api/user/addresses', addressData)
    return {
      success: true,
      data: response.data.results,
      message: response.data.message || '배송지가 성공적으로 추가되었습니다.'
    }
  } catch (error) {
    console.error('배송지 추가 실패:', error)
    return {
      success: false,
      message: error.response?.data?.message || '배송지 추가 중 오류가 발생했습니다.',
      data: null
    }
  }
}

// 배송지 수정
const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/api/user/addresses/${addressId}`, addressData)
    return {
      success: true,
      data: response.data.results,
      message: response.data.message || '배송지가 성공적으로 수정되었습니다.'
    }
  } catch (error) {
    console.error('배송지 수정 실패:', error)
    return {
      success: false,
      message: error.response?.data?.message || '배송지 수정 중 오류가 발생했습니다.',
      data: null
    }
  }
}

// 배송지 삭제
const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/api/user/addresses/${addressId}`)
    return {
      success: true,
      message: response.data.message || '배송지가 성공적으로 삭제되었습니다.'
    }
  } catch (error) {
    console.error('배송지 삭제 실패:', error)
    return {
      success: false,
      message: error.response?.data?.message || '배송지 삭제 중 오류가 발생했습니다.'
    }
  }
}

// 기본배송지 조회
const getDefaultAddress = async () => {
  try {
    const response = await api.get('/api/user/addresses/default')
    return {
      success: true,
      data: response.data.results
    }
  } catch (error) {
    console.error('기본배송지 조회 실패:', error)
    return {
      success: false,
      message: error.response?.data?.message || '기본배송지 조회 중 오류가 발생했습니다.',
      data: null
    }
  }
}

export default { 
  getCartList, 
  getOrderList, 
  getMyPosts, 
  getLikedPosts, 
  getScrappedPosts, 
  getCommentedPosts,
  updateUserInfo,
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  getDefaultAddress
}