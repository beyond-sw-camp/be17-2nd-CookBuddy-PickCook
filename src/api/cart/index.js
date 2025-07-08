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

export default { cartList }
