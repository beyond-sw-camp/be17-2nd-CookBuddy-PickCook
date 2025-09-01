import api from '@/plugins/axiosinterceptor'

// 결제 시작 요청 → 백엔드에서 uuid(payment_id) 받아오기
const startPayment = async (totalPrice, orderItems, orderType) => {
  let data = {}
  const url = '/order/start'

  await api
    .post(url, {
      total_price: totalPrice,
      orderItems: orderItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        product_price: Math.round(item.original_price * (100 - item.discount_rate) / 100), // 할인 적용 가격
        quantity: item.quantity,
      })),
      orderType: orderType
    })
    .then((res) => {
      data = res.data.results // 여기서 payment_id(uuid) 받기
    })
    .catch((error) => {
      console.error('결제 시작 요청 실패: ', error)
      data = error?.response?.data?.results
    })

  return data
}

// 결제 검증 요청
const validatePayment = async (paymentId) => {
  let data = {}
  const url = '/order/validation'

  await api
    .post(url, { paymentId }, { timeout: 15000 })
    .then((res) => {
      data = res.data.results // 서버 응답 (order_id, status)
    })
    .catch((error) => {
      console.error('결제 검증 요청 실패: ', error)
      data = error?.response?.data?.results
    })

  return data
}

export default { startPayment, validatePayment }
