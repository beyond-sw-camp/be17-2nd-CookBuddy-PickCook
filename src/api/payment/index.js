import api from '@/plugins/axiosinterceptor'

// 결제 시작 요청 → 백엔드에서 uuid(payment_id) 받아오기
const startPayment = async (totalPrice, orderItems, orderType, shippingInfo, user, postalCode, roadAddress, detailAddress) => {
  let data = {}
  const url = 'api/order/start'

  await api
    .post(url, {
      total_price: totalPrice,
      orderItems: orderItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        product_price: Math.round((item.original_price * (100 - item.discount_rate)) / 100), // 할인 적용 가격
        quantity: item.quantity,
      })),
      orderType: orderType,
      orderDelivery: {
        receiverName: shippingInfo.receiverName,
        receiverPhone: shippingInfo.receiverPhone,
        zipCode: postalCode,
        address: roadAddress,
        detailAddress: detailAddress,
        deliveryPlace: shippingInfo.deliveryPlace,
        requestMessage: shippingInfo.requestMessage,
      },
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
  const url = 'api/order/validation'

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

const orderList = async (period, page, size) => {
  let data = {}
  let url = `api/order/history?period=${period}&page=${page}&size=${size}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const orderDetail = async (orderId) => {
  let data = {}
  let url = `api/order/details?orderId=${orderId}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const userInfo = async () => {
  let data = {}
  let url = 'api/api/user/me'

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const userAddress = async () => {
  let data = {}
  let url = '/api/user/addresses'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

export default { startPayment, validatePayment, orderList, orderDetail, userInfo, userAddress }
