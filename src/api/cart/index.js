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

/**
 * 수량과 함께 장바구니에 상품 추가
 */
const addToCartWithQuantity = async (productId, quantity = 1) => {
  try {
    // 1단계: 상품을 장바구니에 추가
    const addResponse = await toggleInCart([productId])
    
    if (!addResponse.success) {
      throw new Error(addResponse.message || '장바구니 추가 실패')
    }

    // 2단계: 추가된 상품의 cart_item_id를 찾기 위해 장바구니 목록 조회
    const cartList = await cartList()
    const cartItem = cartList.find(item => item.product_id === productId)
    
    if (cartItem && quantity > 1) {
      // 3단계: 수량이 1보다 크면 수량 업데이트
      const updateResponse = await updateQuantity(cartItem.idx, quantity)
      if (!updateResponse.success) {
        throw new Error(updateResponse.message || '수량 변경 실패')
      }
    }

    return { success: true, message: '장바구니에 추가되었습니다.' }
    
  } catch (error) {
    console.error('장바구니 추가 (수량 포함) 실패:', error)
    return { success: false, message: error.message || '장바구니 추가 중 오류가 발생했습니다.' }
  }
}

export default { cartList, updateQuantity, toggleInCart, addToCartWithQuantity }