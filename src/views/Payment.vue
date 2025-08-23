<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PortOne from '@portone/browser-sdk/v2'
import productApi from '@/api/shopping'
import PaymentLayout from '@/components/PaymentLayout.vue'
import SelectAddressModal from '@/components/SelectAddressModal.vue'
import ShippingRequestModal from '@/components/ShippingRequestModal.vue'
import PrivacyUsageConsentModal from '@/components/PrivacyUsageConsentModal.vue'
import PrivacyThirdPartyConsentModal from '@/components/PrivacyThirdPartyConsentModal.vue'


const route = useRoute()
const router = useRouter()
const selectedItems = ref([])

const isSelectShippingRegionModalOpen = ref(false) // 배송지 변경 모달
const isShippingRequestModalOpen = ref(false) // 배송요청 입력 모달
const isPrivacyUsageConsentModalOpen = ref(false) // 개인정보 수집/이용 및 처리 동의 모달
const isPrivacyThirdPartyConsentModalOpen = ref(false) // 개인정보 제 3자 제공 동의 모달

const openSelectShippingRegionModal = () => {
  isSelectShippingRegionModalOpen.value = true
}
const closeSelectShippingRegionModal = () => {
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

// 랜덤 paymentId 생성
const randomId = () => {
  return [...crypto.getRandomValues(new Uint32Array(2))]
    .map((word) => word.toString(16).padStart(8, '0'))
    .join('')
}

// 상품명 요약
const orderNameSummary = () => {
  const names = productList.map((p) => p.name)
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  return `${names[0]} 외 ${names.length - 1}개`
}

// 상품 idx 배열
const idxArray = () => productList.map((p) => p.idx)

// 결제 요청
const onSubmitPayment = async () => {
  const paymentId = randomId()
  const totalPrice = productList.reduce((sum, product) => sum + product.price, 0)
  const orderName = orderNameSummary()
  const idxs = idxArray()

  try {
    const payment = await PortOne.requestPayment({
      storeId: 'store-018bff32-3d9e-4918-9f0a-add338f287cd',
      channelKey: 'channel-key-3ab0c7d6-f2af-48ab-b56e-fac3ff323759',
      paymentId,
      orderName,
      totalAmount: totalPrice,
      currency: 'KRW',
      payMethod: 'CARD',
      customData: { items: idxs },
    })

    if (payment && payment.paymentId) {
      // 결제 검증
      const url = 'http://localhost:8080/web02/order/validation'
      const data = { paymentId: payment.paymentId }
      await axios.post(url, data)
      alert('결제가 완료되었습니다!')
    }
  } catch (err) {
    console.error(err)
    alert('결제 실패')
  }
}

// 할인 적용 후 가격 계산
const discountedPrice = (item) => {
  return Math.round(item.original_price * (100 - item.discount_rate) / 100)
}

// 총 결제 금액 계산 (할인 적용)
const totalPrice = () => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + discountedPrice(item) * item.quantity
  }, 0)
}

onMounted(() => {
  // router state에서 결제할 상품 정보 받아오기
  if (route.state?.items) {
    selectedItems.value = route.state.items
    // localStorage에도 저장 (새로고침 대비)
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems.value))
  } else {
    // 만약 router state 없으면 localStorage에서 복구
    const saved = localStorage.getItem('checkoutItems')
    if (saved) {
      selectedItems.value = JSON.parse(saved)
    } else {
      // 데이터 없음 → 경고/리다이렉트 처리
      alert('선택한 상품 정보가 없습니다.')
      router.push('/cart') // 장바구니로 돌아가기
    }
  }
})
</script>

<template>
  <div class="payment-body">
    <div class="payment-order-sheet-container">
      <h3>주문서</h3>

      <!-- 주문 상품 -->
      <PaymentLayout title="주문 상품">
        <div class="payment-order-items-container">
          <div class="payment-order-items-shipping-info">샛별 배송</div>
          <div class="payment-order-items-list">
            <div v-for="item in selectedItems" :key="item.idx" class="payment-order-item-card">
              <img
                :src="item.main_image_url"
                alt="상품 이미지"
              />
              <div>
                <span class="payment-order-item-name">{{ item.name }}</span>
                <div class="payment-order-item-price-info-container">
                  <span class="payment-order-item-price">{{ discountedPrice(item).toLocaleString() }}</span>
                  <span class="payment-order-item-original-price">{{ item.original_price.toLocaleString() }}</span>
                  <span>|</span>
                  <span class="payment-order-item-quantity">{{item.quantity}} 개</span>
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
            <span>이름</span>
            <span>010-1234-5678</span>
            <span>test01@test.com</span>
          </div>
        </div>
      </PaymentLayout>

      <!-- 배송 정보 -->
      <PaymentLayout title="배송 정보">
        <div class="payment-order-items-shipping-info-container">
          <div class="payment-order-items-shipping-info-title-container">배송지</div>
          <div class="payment-order-items-shipping-lnfo-as-container">
            <p>경상남도 양사닛 양양양 123 보라매아파트 111동 222호</p>
            <button id="shipping-destination-button" @click="openSelectShippingRegionModal">
              변경
            </button>
          </div>
        </div>
        <div class="payment-order-items-shipping-info-container">
          <div class="payment-order-items-shipping-info-title-container">배송 요청사항</div>
          <div class="payment-order-items-shipping-lnfo-as-container">
            <p class="red-font-color">배송 요청사항을 입력해주세요.</p>
            <button id="shipping-destination-button" @click="openShippingRequestModal">입력</button>
          </div>
        </div>
      </PaymentLayout>
      <SelectAddressModal
        v-if="isSelectShippingRegionModalOpen"
        @close="closeSelectShippingRegionModal"
      />
      <ShippingRequestModal v-if="isShippingRequestModalOpen" @close="closeShippingRequestModal" />

      <!-- 결제 수단 -->
      <PaymentLayout title="결제 수단"> </PaymentLayout>

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
            <input type="checkbox" v-model="isAllSelected" />
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
              <span class="payment-big-cost">33,333원</span>
            </div>
            <div class="payment-cost-info-text-box light-gray-text-color">
              <span>ㄴ 상품금액</span>
              <span>33,333원</span>
            </div>
            <div class="payment-cost-info-text-box light-gray-text-color">
              <span>ㄴ 상품할인금액</span>
              <span>33,333원</span>
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
              <span><span class="final-cost-big-font-size">33,333</span>원</span>
            </div>
            <button @click="onSubmitPayment">결제하기</button>
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
  gap: 10px;
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

.payment-order-item-price-info-container span:nth-child(3) {
  color: var(--color-light-gray);
  font-weight: 200;
}

.payment-order-item-quantity {
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
  font-size: 15px;
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
  font-size: 15px;
  color: var(--color-dark-strong);
  font-weight: 500;
}

.payment-order-items-shipping-lnfo-as-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.payment-order-items-shipping-lnfo-as-container > p {
  font-size: 15px;
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

.personal-info-container {
  padding: 25px 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.personal-info-container:nth-child(2) {
  margin-top: -10px;
  margin-bottom: 23px;
}

.personal-info-container > p {
  font-size: 15px;
  font-weight: 500;
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
  gap: 10px;
  border-bottom: 0.5px solid var(--color-light-gray);
}

.payment-agree-checkbox-container > p {
  font-size: 15px;
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
</style>
