import api from '@/plugins/axiosinterceptor'

const cartList = async () => {
  let data = {}
  let url = '/cart'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results
    })
    .catch((error) => {
      data = error.data.results
    })

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

const toggleInCart = async (cartItemIds) => {
  try {
    const response = await api.post('/cart/register', { product_ids: cartItemIds })
    return {
      success: response.data.success,
      message: response.data.message
    }
  } catch (error) {
    console.error('삭제 실패:', error)
    return { success: false, message: '삭제 중 오류가 발생했습니다.' }
  }
}

export default { cartList, updateQuantity, toggleInCart }
