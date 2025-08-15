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

// 내 게시글 관련
const getMyPosts = async () => {
  try {
    const response = await api.get('/api/user/posts')
    return response.data.results || []
  } catch (error) {
    console.error('내 게시글 조회 실패:', error)
    return []
  }
}

// 좋아요한 게시글
const getLikedPosts = async () => {
  try {
    const response = await api.get('/api/user/liked-posts')
    return response.data.results || []
  } catch (error) {
    console.error('좋아요한 게시글 조회 실패:', error)
    return []
  }
}

// 스크랩한 게시글
const getScrappedPosts = async () => {
  try {
    const response = await api.get('/api/user/scrapped-posts')
    return response.data.results || []
  } catch (error) {
    console.error('스크랩한 게시글 조회 실패:', error)
    return []
  }
}

// 댓글 단 게시글
const getCommentedPosts = async () => {
  try {
    const response = await api.get('/api/user/commented-posts')
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

export default { 
  getCartList, 
  getOrderList, 
  getMyPosts, 
  getLikedPosts, 
  getScrappedPosts, 
  getCommentedPosts,
  updateUserInfo
}