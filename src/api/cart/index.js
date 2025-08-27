import api from '@/plugins/axiosinterceptor'


// 장바구니 목록 불러오기
const cartList = async () => {
  let data = {}
  let url = 'api/cart'

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


// 장바구니 수량 변경
const updateQuantity = async (cartItemId, quantity) => {
  try {
    const response = await api.patch(`api/cart/${cartItemId}`, quantity )
    return {
      success: response.data.success,
      message: response.data.message,
    }
  } catch (error) {
    console.error('수량 변경 실패:', error)
    return { success: false, message: '수량 변경 중 오류가 발생했습니다.' }
  }
}


// 장바구니 등록
const addToCart = async (cartItemIds, quantity = 1) => {
  try {
    const response = await api.post('api/cart/register', { 
      product_ids: cartItemIds,
      quantity: quantity
    });
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error('장바구니 등록 오류 :', error);
    return { success: false, message: '장바구니 등록 중 오류가 발생했습니다.' };
  }
}

// 장바구니 삭제
const removeFromCart = async (cartItemIds) => {
  try {
    const response = await api.post('api/cart/delete', { 
      product_ids: cartItemIds
    });
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error('장바구니 삭제 오류 :', error);
    return { success: false, message: '장바구니 삭제 중 오류가 발생했습니다.' };
  }
}

export default { cartList, updateQuantity, addToCart, removeFromCart }