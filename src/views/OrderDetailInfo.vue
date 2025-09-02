<script setup>
import OrderProductItemCard from '../components/OderProductItemCard.vue'
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/payment'

const isOrderProductListOpen = ref(true)
const customerCenterBoxOpen = ref(false)
const orderDetail = ref({})
const router = useRouter()
const route = useRoute()
const customerEmail = import.meta.env.VITE_CUSTOMER_EMAIL || 'support@example.com'

function goBack() {
  router.back()
}

const sendMail = () => {
  if (!orderDetail) return

  const subject = encodeURIComponent('주문 문의')
  const body = encodeURIComponent(`안녕하세요.\n주문 번호: ${orderDetail.value.orderNumber}\n주문 관련 문의드립니다.`)

  // Gmail 새 메일 작성 창으로 열기
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${customerEmail}&su=${subject}&body=${body}`
  window.open(gmailUrl, '_blank')
}

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}  ${hours}:${minutes}`;
}

const fetchOrderDetail = async (orderId) => {
  if (!orderId) return
  try {
    const res = await api.orderDetail(orderId)
    orderDetail.value = res.results
  } catch (err) {
    console.error('주문 상세 조회 실패:', err)
  }
}

watch(
  () => route.params.orderId,
  (newOrderId) => {
    fetchOrderDetail(newOrderId)
  },
  { immediate: true }, // 페이지 로드 시 바로 호출
)

// 총 상품 금액
const totalOriginalPrice = computed(
  () =>
    orderDetail.value?.orderItems?.reduce(
      (sum, item) => sum + item.original_price * item.quantity,
      0,
    ) || 0,
)

// 총 할인 금액
const totalDiscount = computed(
  () =>
    orderDetail.value?.orderItems?.reduce(
      (sum, item) =>
        sum + Math.round(item.original_price * (item.discount_rate / 100) * item.quantity),
      0,
    ) || 0,
)
</script>

<template>
  <div class="order-detail-info-body">
    <div class="order-detail-info-container">
      <div class="order-detail-info-header">
        <img src="/assets/icons/ic-arrow-left.png" alt="뒤로 가기" id="no-rotate" @click="goBack" />
        <span>주문 상세조회</span>
        <div></div>
      </div>

      <div class="order-detail-info-first-container order-detail-page-container-section">
        <h3>주문번호 {{ orderDetail.orderNumber }}</h3>
        <div>
          <p>{{ formatDateTime(orderDetail.approvedAt) }}</p>
          <span>|</span>
          <p>{{ orderDetail.orderDelivery.receiverName }}</p>
        </div>
      </div>

      <div class="order-detail-info-second-container order-detail-page-container-section">
        <div
          class="order-detail-info-header"
          @click="isOrderProductListOpen = !isOrderProductListOpen"
        >
          <span>주문 상품</span>
          <img
            src="/assets/icons/ic-arrow-bottom.png"
            alt="주문 상품 보기"
            :class="{ rotated: isOrderProductListOpen }"
          />
        </div>
        <div v-show="isOrderProductListOpen" class="order-detail-info-contents">
          <OrderProductItemCard
            :order="orderDetail"
            :showHeader="false"
          />
        </div>
      </div>

      <div class="order-detail-info-third-container order-detail-page-container-section">
        <div class="order-detail-info-header">
          <span>결제 정보</span>
        </div>
        <div class="order-detail-info-contents">
          <div class="order-detail-gray-info-box">
            <div class="order-detail-gray-info-box-top">
              <div class="order-detail-space-between order-detail-payment-info">
                <p>총 상품 금액</p>
                <span
                  ><h4>{{ totalOriginalPrice.toLocaleString() }}</h4>
                  원</span
                >
              </div>
              <div class="order-detail-discount-info-container">
                <div class="order-detail-space-between order-detail-payment-info">
                  <p>총 할인 혜택</p>
                  <span
                    ><h4>-{{ totalDiscount.toLocaleString() }}</h4>
                    원</span
                  >
                </div>

                <div class="product-discount-detail-list">
                  <div
                    v-for="item in orderDetail.orderItems"
                    :key="item.product_id"
                  >
                    <div v-if="item.discount_rate > 0" class="order-detail-space-between discount-detail-gray-font-color">
                      <span>ㄴ 상품 할인</span>
                      <span>
                        - {{
                          Math.round(
                            ((item.original_price * item.discount_rate) / 100) * item.quantity,
                          ).toLocaleString()
                        }}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-detail-space-between order-detail-payment-info">
                <p>배달비</p>
                <div>
                  <h5>모든 상품 무료 배송</h5>
                  <span
                    ><h4>0</h4>
                    원</span
                  >
                </div>
              </div>
            </div>
            <div class="order-detail-gray-info-box-bottom">
              <div class="order-detail-discount-info-container">
                <div class="order-detail-space-between order-detail-payment-info">
                  <h2>결제 금액</h2>
                  <span
                    ><h4>{{ orderDetail.total_price.toLocaleString() }}</h4>
                    원</span
                  >
                </div>

                <div class="product-discount-detail-list">
                  <div class="order-detail-space-between discount-detail-gray-font-color">
                    <span>ㄴ 결제 수단</span>
                    <span>{{ orderDetail.paymentMethod }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-detail-info-third-container order-detail-page-container-section">
        <div class="order-detail-info-header">
          <span>배송지 정보</span>
        </div>

        <div class="order-delivery-place-info-box">
          <div class="order-delivery-place-info-box-left">
            <span>수령인</span>
            <span>연락처</span>
          </div>
          <div class="order-delivery-place-info-box-rigth">
            <p>{{ orderDetail.orderDelivery.receiverName }}</p>
            <p>{{ orderDetail.orderDelivery.receiverPhone }}</p>
          </div>
        </div>

        <div class="order-delivery-place-info-box">
          <div class="order-delivery-place-info-box-left">
            <span>우편번호</span>
            <span>주소</span>
            <span>상세 주소</span>
          </div>
          <div class="order-delivery-place-info-box-rigth">
            <p>{{ orderDetail.orderDelivery.zipCode }}</p>
            <p>{{ orderDetail.orderDelivery.address }}</p>
            <p>{{ orderDetail.orderDelivery.detailAddress }}</p>
          </div>
        </div>

        <div class="order-delivery-place-info-box">
          <div class="order-delivery-place-info-box-left">
            <span>요청사항</span>
          </div>
          <div class="order-delivery-place-info-box-rigth">
            <p>{{ orderDetail.orderDelivery.requestMessage }}</p>
          </div>
        </div>
      </div>

      <div class="order-detail-info-four-container order-detail-page-container-section">
        <div
          class="order-detail-info-header"
          @click="customerCenterBoxOpen = !customerCenterBoxOpen"
        >
          <span>고객센터</span>
          <img
            src="/assets/icons/ic-arrow-bottom.png"
            alt="고객센터 정보 보기"
            :class="{ rotated: customerCenterBoxOpen }"
          />
        </div>
        <div v-show="customerCenterBoxOpen" class="order-detail-page-customer-center-info">
          <p>이메일 문의 <span>(평일 10:00 ~ 17:00)</span></p>
          <button class="order-detail-send-mail" @click="sendMail">
            <img src="/assets/icons/ic-mail.png" alt="메일 보내기" />
            <span>메일 문의</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail-info-body {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px;
}

.order-detail-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  max-width: 800px;
  width: 100%;
  padding-bottom: 25px;
}

.order-detail-info-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px;
  border-bottom: 0.5px solid #ebebeb;
}

.order-detail-info-header > img,
.order-detail-info-header > div {
  width: 20px;
}

.order-detail-info-header > img {
  cursor: pointer;
}

.order-detail-page-container-section {
  border-bottom: 8px solid #ebebeb;
  width: 100%;
}

.order-detail-info-header > span {
  font-size: 16px;
  font-weight: 500;
}

.order-detail-info-first-container {
  display: flex;
  flex-direction: column;
  padding: 25px 22px;
}

.order-detail-info-first-container > h3 {
  font-weight: 500;
  font-size: 16px;
}

.order-detail-info-first-container > div {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.order-detail-info-first-container p {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-gray);
}

.order-detail-info-first-container span {
  font-size: 14px;
  color: var(--color-light-gray);
}

.order-detail-info-second-container,
.order-detail-info-four-container {
  cursor: pointer;
}

/* 아이콘 기본 방향 = 위쪽 */
.order-detail-info-header img {
  transition: transform 0.1s ease;
  transform: rotate(180deg); /* 기본 위 방향 */
}

/* 열렸을 때 = 아래쪽 */
.order-detail-info-header img.rotated {
  transform: rotate(0deg);
}

.order-detail-info-contents {
  padding: 25px 22px;
}

.order-detail-gray-info-box {
  background-color: #f2f2f2;
  border-radius: 5px;
}

.order-detail-gray-info-box-top,
.order-detail-gray-info-box-bottom {
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-detail-gray-info-box-top {
  border-bottom: 0.5px solid #d3d3d3;
}

.order-detail-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.order-detail-space-between span {
  display: flex;
}

.order-detail-payment-info > p {
  color: #68686c;
}

.order-detail-payment-info h4 {
  font-size: 17px;
}

.product-discount-detail-list {
  margin-top: 12px;
  font-size: 15px;
  color: #8f8f8f;
}

.order-detail-payment-info > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-detail-payment-info h5 {
  font-weight: 500;
  font-size: 12px;
  color: var(--color-gray);
}

.order-detail-payment-info > h2 {
  font-size: 16px;
}

.order-delivery-place-info-box {
  padding: 18px 26px;
  display: flex;
  border-bottom: 0.5px solid #ebebeb;
}

.order-delivery-place-info-box:last-child {
  margin-bottom: 10px;
  border: none;
}

.order-delivery-place-info-box-left,
.order-delivery-place-info-box-rigth {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 15px;
}

.order-delivery-place-info-box-left {
  color: #7e7e7e;
  width: 180px;
}

.order-delivery-place-info-box-rigth {
  color: #292929;
}

.order-detail-page-customer-center-info {
  padding: 25px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-detail-page-customer-center-info > p {
  font-weight: 500;
  font-size: 15px;
}

.order-detail-page-customer-center-info span {
  color: #7e7e7e;
  font-weight: 400;
}

.order-detail-send-mail {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 2px;
  padding: 5px 12px;
  border: 1px solid #ebebeb;
  background-color: unset;
  cursor: pointer;
}

.order-detail-send-mail > img {
  width: 15px;
}

.order-detail-send-mail > span {
  color: black;
}

.order-detail-page-container-section:last-child {
  border: none;
}

#no-rotate {
  transform: none;
}
</style>
