<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PortOne from '@portone/browser-sdk/v2'
import orderApi from '@/api/payment'
import PaymentLayout from '@/components/PaymentLayout.vue'
import SelectAddressModal from '@/components/SelectAddressModal.vue'
import ShippingRequestModal from '@/components/ShippingRequestModal.vue'
import PrivacyUsageConsentModal from '@/components/PrivacyUsageConsentModal.vue'
import PrivacyThirdPartyConsentModal from '@/components/PrivacyThirdPartyConsentModal.vue'

const route = useRoute()
const router = useRouter()
const selectedItems = ref([]) // 결제할 상품 목록
const orderType = ref('CART')
const user = ref({})
const userAddress = ref({})
const postalCode = ref('')
const roadAddress = ref('')
const detailAddress = ref('')
const shippingInfo = ref(null)
const isAgreeChecked = ref(false) // 체크박스 상태

const isSelectShippingRegionModalOpen = ref(false) // 배송지 변경 모달
const isShippingRequestModalOpen = ref(false) // 배송요청 입력 모달
const isPrivacyUsageConsentModalOpen = ref(false) // 개인정보 수집/이용 및 처리 동의 모달
const isPrivacyThirdPartyConsentModalOpen = ref(false) // 개인정보 제 3자 제공 동의 모달

// 사용되는 모달들
const openSelectShippingRegionModal = () => {
  isSelectShippingRegionModalOpen.value = true
}
const closeSelectShippingRegionModal = (address) => {
  if (address) {
    postalCode.value = address.postalCode
    roadAddress.value = address.roadAddress
    detailAddress.value = address.detailAddress
    userAddress.value = address
  }
  isSelectShippingRegionModalOpen.value = false
}
const openShippingRequestModal = () => {
  isShippingRequestModalOpen.value = true
}
const closeShippingRequestModal = () => {
  isShippingRequestModalOpen.value = false
}
const openPrivacyUsageConsentModal = () => {
  isPrivacyUsageConsentModalOpen.value = true
}
const closePrivacyUsageConsentModal = () => {
  isPrivacyUsageConsentModalOpen.value = false
}
const openPrivacyThirdPartyConsentModal = () => {
  isPrivacyThirdPartyConsentModalOpen.value = true
}
const closePrivacyThirdPartyConsentModal = () => {
  isPrivacyThirdPartyConsentModalOpen.value = false
}

// 할인 적용 후 단일 상품 가격 계산
const discountedPrice = (item) => {
  return Math.round((item.original_price * (100 - item.discount_rate)) / 100)
}

// 총 결제 금액 계산 (할인 적용 + 수량)
const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + discountedPrice(item) * item.quantity
  }, 0)
})

// 총 상품 원가 (할인 전)
const totalProductPrice = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.original_price * item.quantity, 0),
)

// 총 할인 금액 (얼마나 깎였는지)
const totalDiscount = computed(() =>
  selectedItems.value.reduce((sum, item) => {
    const discountAmountPerOne = item.original_price - discountedPrice(item)
    return sum + discountAmountPerOne * item.quantity
  }, 0),
)

// 상품명 요약
const orderNameSummary = computed(() => {
  if (selectedItems.value.length === 0) return ''
  if (selectedItems.value.length === 1) return selectedItems.value[0].name
  return `${selectedItems.value[0].name} 외 ${selectedItems.value.length - 1}개`
})

onMounted(async () => {
  // router state에서 결제할 상품 정보 받아오기
  if (route.state?.items) {
    selectedItems.value = route.state.items
    orderType.value = route.state.orderType || 'CART'
    // localStorage에도 저장 (새로고침 대비)
    localStorage.setItem(
      'checkoutItems',
      JSON.stringify({
        items: selectedItems.value,
        orderType: orderType.value,
      }),
    )
  } else {
    // 만약 router state 없으면 localStorage에서 복구
    const saved = localStorage.getItem('checkoutItems')
    if (saved) {
      const parsed = JSON.parse(saved)
      selectedItems.value = parsed.items || []
      orderType.value = parsed.orderType || 'CART'
    } else {
      // 데이터 없음 → 경고/리다이렉트 처리
      alert('선택한 상품 정보가 없습니다.')
      router.push('/cart') // 장바구니로 돌아가기
      return
    }
  }

  try {
    const [userData, userAddressData] = await Promise.all([
      orderApi.userInfo(),
      orderApi.userAddress(),
    ])

    if (userData && userData.results) {
      user.value = userData.results
    }

    if (userAddressData[0]) {
      userAddress.value = userAddressData[0]
      postalCode.value = userAddressData[0].postalCode
      roadAddress.value = userAddressData[0].roadAddress
      detailAddress.value = userAddressData[0].detailAddress
    }
  } catch (error) {
    console.error('유저 정보 가져오기 실패', error)
  }
})

const handleSaveShippingInfo = (data) => {
  shippingInfo.value = data
}

// 결제 요청
const onSubmitPayment = async () => {
  if (!shippingInfo.value) {
    alert('배송 정보를 입력해주세요.')
    return
  } else if (!isPaymentEnabled.value) {
    alert('결제 동의란에 체크해주세요.')
  }

  try {
    // 백엔드에서 uuid(payment_id) 생성 요청
    const { paymentId } = await orderApi.startPayment(
      totalPrice.value,
      selectedItems.value,
      orderType.value,
      shippingInfo.value,
      user.value,
      postalCode.value,
      roadAddress.value,
      detailAddress.value,
    )
    const idxs = selectedItems.value.map((item) => item.idx)

    const payment = await PortOne.requestPayment({
      storeId: import.meta.env.VITE_PORTONE_STOREID,
      channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
      paymentId: paymentId,
      orderName: orderNameSummary.value,
      totalAmount: totalPrice.value,
      currency: 'KRW',
      payMethod: 'CARD',
      customData: { items: idxs },
      mode: 'redirect',
      redirectUrl: `${window.location.origin}/payment/complete`,
    })

    if (payment?.paymentId) {
      const result = await orderApi.validatePayment(payment.paymentId)

      if (result?.status === 'PAID') {
        const orderId = result?.order_id
        router.replace(`/payment/complete/${orderId}`)
      } else {
        alert(`결제 실패`)
        router.push('/payment')
      }
    }
  } catch (err) {
    console.error(err)
    alert('결제 중 오류가 발생했습니다.')
    router.push('/payment')
  }
}

// 버튼 활성화 여부
const isPaymentEnabled = computed(() => {
  return isAgreeChecked.value && shippingInfo.value && selectedItems.value.length > 0
})
</script>

<template>
  <div class="payment-body">
    <div class="payment-order-sheet-container">
      <h3>주문서</h3>

      <!-- 주문 상품 -->
      <PaymentLayout title="주문 상품">
        <div class="payment-order-items-container">
          <div class="payment-order-items-list">
            <div v-for="item in selectedItems" :key="item.idx" class="payment-order-item-card">
              <img :src="item.main_image_url" alt="상품 이미지" />
              <div>
                <span class="payment-order-item-name">{{ item.name }}</span>
                <div class="payment-order-item-price-info-container">
                  <span class="payment-order-item-price"
                    >{{ (discountedPrice(item) * item.quantity).toLocaleString() }}원</span
                  >
                  <div v-if="item.discount_rate > 0" class="payment-order-item-discount-rate-info">
                    <span class="payment-order-item-original-price"
                      >{{ (item.original_price * item.quantity).toLocaleString() }}원</span
                    >
                    <span>|</span>
                  </div>
                  <span class="payment-order-item-quantity">{{ item.quantity }} 개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PaymentLayout>

      <!-- 주문자 정보 -->
      <PaymentLayout title="주문자 정보">
        <div class="payment-order-user-info-out-container">
          <div class="payment-order-user-info-container">
            <span>보내는 분</span>
            <span>휴대폰</span>
            <span>이메일</span>
          </div>
          <div class="payment-order-user-info-as-container">
            <span>{{ user.name }}</span>
            <span>{{ user.phone }}</span>
            <span>{{ user.email }}</span>
          </div>
        </div>
      </PaymentLayout>

      <!-- 배송 정보 -->
      <PaymentLayout title="배송 정보">
        <div class="payment-order-items-shipping-info-container">
          <div class="payment-order-items-shipping-info-title-container">배송지</div>
          <div class="payment-order-items-shipping-lnfo-as-container">
            <p>
              {{ userAddress.fullAddress ? userAddress.fullAddress : '배송지를 입력해주세요.' }}
            </p>
            <button id="shipping-destination-button" @click="openSelectShippingRegionModal">
              변경
            </button>
          </div>
        </div>
        <div class="payment-order-items-shipping-info-container">
          <div class="payment-order-items-shipping-info-title-container">배송 요청사항</div>
          <div class="payment-order-items-shipping-lnfo-as-container">
            <div v-if="shippingInfo" class="user-shipping-request-message">
              <div>
                <span>{{ shippingInfo.deliveryPlace }}</span> |
                <span>{{ shippingInfo.requestMessage }}</span>
              </div>
              <div>{{ shippingInfo.receiverName }}, {{ shippingInfo.receiverPhone }}</div>
            </div>
            <p v-else class="red-font-color">배송 요청사항을 입력해주세요.</p>
            <button id="shipping-destination-button" @click="openShippingRequestModal">입력</button>
          </div>
        </div>
      </PaymentLayout>
      <SelectAddressModal
        v-if="isSelectShippingRegionModalOpen"
        @close="closeSelectShippingRegionModal"
      />
      <ShippingRequestModal
        v-if="isShippingRequestModalOpen"
        @close="closeShippingRequestModal"
        @save="handleSaveShippingInfo"
        :user="user"
      />

      <!-- 결제 수단 -->
      <!-- <PaymentLayout title="결제 수단"> </PaymentLayout> -->

      <!-- 개인정보 및 결제 동의 -->
      <PaymentLayout title="개인정보 및 결제 동의">
        <div class="personal-info-container">
          <p>개인정보 수집•이용 및 처리 동의</p>
          <span @click="openPrivacyUsageConsentModal">보기</span>
        </div>
        <div class="personal-info-container">
          <p>개인정보 제3자 제공 동의</p>
          <span @click="openPrivacyThirdPartyConsentModal">보기</span>
        </div>

        <div class="payment-agree-checkbox-container">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="isAgreeChecked" />
            <span class="checkmark"></span>
          </label>
          <p>위 내용을 확인 하였으며 결제에 동의합니다.</p>
        </div>

        <div class="payment-sub-notice-container">
          [주문완료], [배송준비중] 상태일 경우에만 주문 취소가 가능하며, 상품 미배송 시 결제하신
          수단으로 환불 됩니다.
        </div>
      </PaymentLayout>
      <PrivacyUsageConsentModal
        v-if="isPrivacyUsageConsentModalOpen"
        @close="closePrivacyUsageConsentModal"
      />
      <PrivacyThirdPartyConsentModal
        v-if="isPrivacyThirdPartyConsentModalOpen"
        @close="closePrivacyThirdPartyConsentModal"
      />

      <!-- 결제 금액 -->
      <PaymentLayout title="결제금액">
        <div class="payment-cost-partition-box-container">
          <div class="payment-cost-partition-box">
            <div class="payment-cost-info-text-box">
              <span>주문금액</span>
              <span class="payment-big-cost">{{ totalPrice.toLocaleString() }}원</span>
            </div>
            <div class="payment-cost-info-text-box light-gray-text-color">
              <span>ㄴ 상품금액</span>
              <span>{{ totalProductPrice.toLocaleString() }}원</span>
            </div>
            <div class="payment-cost-info-text-box light-gray-text-color">
              <span>ㄴ 상품할인금액</span>
              <span>- {{ totalDiscount.toLocaleString() }}원</span>
            </div>
            <div class="margin-box"></div>
            <div class="payment-cost-info-text-box shipping-cost-container">
              <span>배송비</span>
              <span class="payment-big-cost">0원</span>
            </div>
          </div>
          <div class="payment-cost-partition-box second-box">
            <div class="payment-cost-info-text-box final-payment-cost-container">
              <span>최종 결제금액</span>
              <span
                ><span class="final-cost-big-font-size">{{ totalPrice.toLocaleString() }}</span
                >원</span
              >
            </div>
            <button :disabled="!isPaymentEnabled" @click="onSubmitPayment" class="payment-button">
              결제하기
            </button>
          </div>
        </div>
      </PaymentLayout>
    </div>
  </div>
</template>

<style scoped>
.payment-body {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 0 80px;
}

.payment-order-sheet-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 38px 20px 0;
  max-width: 800px;
  width: 100%;
}

.payment-order-sheet-container > h3 {
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 30px;
}

.payment-order-items-container {
  padding: 16px 25px 0;
}

.payment-order-items-shipping-info {
  font-size: 15px;
  padding-left: 6px;
  padding-bottom: 6px;
  border-bottom: 0.5px solid var(--color-light-gray);
}

.payment-order-items-list {
  padding: 15px 6px;
}

.payment-order-item-card {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 15px;
}

.payment-order-item-card > img {
  width: 72px;
  height: 72px;
  border-radius: 15px;
  object-fit: cover;
}

.payment-order-item-card > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.payment-order-item-name {
  font-size: 14px;
  cursor: pointer;
}

.payment-order-item-price-info-container {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.payment-order-item-price {
  font-size: 16px;
  font-weight: 700;
}

.payment-order-item-original-price {
  font-size: 14px;
  color: var(--color-gray);
  text-decoration: line-through;
  margin-left: -4px;
  margin-top: 2px;
}

.payment-order-item-discount-rate-info {
  display: flex;
  gap: 5px;
  margin-left: 8px;
}

.payment-order-item-discount-rate-info > span:last-child {
  color: var(--color-light-gray);
  margin-bottom: 2px;
}

.payment-order-item-quantity,
.payment-order-item-discount-rate-info > span:first-child {
  color: var(--color-gray);
  font-size: 14px;
}

.payment-order-user-info-out-container {
  display: flex;
  gap: 20px;
}

.payment-order-user-info-container,
.payment-order-user-info-as-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 25px 30px 30px;
}

.payment-order-user-info-container > span,
.payment-order-user-info-as-container > span {
  font-size: 14px;
}

.payment-order-user-info-container > span {
  color: var(--color-dark-strong);
  font-weight: 500;
}

.payment-order-items-shipping-info-container {
  padding: 45px 30px 35px;
  display: flex;
  gap: 50px;
}

.payment-order-items-shipping-info-container:first-child {
  border-bottom: 0.5px solid var(--color-light-gray);
  gap: 98px;
}

.payment-order-items-shipping-info-title-container {
  font-size: 14px;
  color: var(--color-dark-strong);
  font-weight: 500;
}

.payment-order-items-shipping-lnfo-as-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.payment-order-items-shipping-lnfo-as-container > p,
.payment-order-user-info-as-container > span {
  font-size: 14px;
  color: var(--color-dark-strong);
}

.payment-order-items-shipping-info-container:last-child p {
  font-size: 14px;
  color: #f42e2e;
  margin-top: 2px;
}

.payment-order-items-shipping-lnfo-as-container > button {
  width: 70px;
  height: 35px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #ececec;
  background-color: white;
  font-size: 13px;
  cursor: pointer;
}

.payment-order-items-shipping-lnfo-as-container > button:hover {
  background-color: #f8f8f8;
}

.personal-info-container:first-child {
  margin-top: 10px;
}

.personal-info-container {
  padding: 18px 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.personal-info-container:nth-child(2) {
  margin-top: -10px;
  margin-bottom: 23px;
}

.personal-info-container > p {
  font-size: 14px;
  color: var(--color-dark-strong);
}

.personal-info-container > span {
  font-size: 12px;
  text-decoration: underline;
  color: var(--color-dark-strong);
  cursor: pointer;
}

.payment-agree-checkbox-container {
  padding: 0 30px 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 0.5px solid var(--color-light-gray);
}

.payment-agree-checkbox-container > p {
  font-size: 15px;
  margin-bottom: 3px;
}

.payment-sub-notice-container {
  font-size: 12px;
  color: var(--color-dark-strong);
  padding: 20px 30px 30px;
}

.payment-cost-partition-box-container {
  display: flex;
}

.payment-cost-partition-box {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 25px 30px 30px;
  gap: 8px;
}

.payment-cost-info-text-box {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}

.margin-box {
  height: 20px;
}

.light-gray-text-color {
  color: var(--color-gray);
}

.payment-big-cost {
  font-size: 16px;
}

.second-box {
  border-left: 0.5px solid var(--color-light-gray);
}

.final-payment-cost-container > span:first-child {
  margin-bottom: 25px;
}

.final-payment-cost-container > span:last-child {
  margin-top: -4px;
}

.final-cost-big-font-size {
  font-size: 22px;
  font-weight: 700;
}

.second-box > button {
  height: 40px;
  border-radius: 5px;
  border: none;
  background-color: var(--color-primary);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.second-box > button:hover {
  background-color: var(--color-primary-dark);
}

.payment-layout-body:last-child {
  margin-bottom: 45px;
}

.user-shipping-request-message {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-shipping-request-message > div:first-child {
  color: var(--color-light-gray);
}

.user-shipping-request-message span {
  color: var(--color-dark-strong);
}

.user-shipping-request-message div {
  color: var(--color-dark-strong);
  font-size: 14px;
  display: flex;
  gap: 8px;
}

.payment-button:disabled,
.payment-button:disabled:hover {
  background-color: #ccc;
  cursor: default;
}
</style>
