import api from '@/plugins/axiosinterceptor'

const cartList = async () => {
  let data = {}
  let url = '/cart_list.json'

  try {
    const res = await api.get(url)
    data = res.data.data.cart_items
  } catch (e) {
    console.error('장바구니 불러오기 실패: ', e)
    data = []
  }

  return data
}

const updateQuantity = async (cartItemId, quantity) => {
  try {
    const response = await api.patch(`/api/cart/${cartItemId}`, { quantity })
    return {
      success: response.data.success,
      message: response.data.message
    }
  } catch (error) {
    console.error('수량 변경 실패:', error)
    return { success: false, message: '수량 변경 중 오류가 발생했습니다.' }
  }
}

const deleteItems = async (cartItemIds) => {
  try {
    const response = await api.post('/api/cart/delete', { ids: cartItemIds })
    return {
      success: response.data.success,
      message: response.data.message
    }
  } catch (error) {
    console.error('삭제 실패:', error)
    return { success: false, message: '삭제 중 오류가 발생했습니다.' }
  }
}

export default { cartList, updateQuantity, deleteItems }
