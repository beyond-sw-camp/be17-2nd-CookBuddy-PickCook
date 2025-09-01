<script setup>
import OrderProductItemCard from '../components/OderProductItemCard.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const isOrderProductListOpen = ref(true)
const customerCenterBoxOpen = ref(false)
const router = useRouter()

function goBack() { router.back() }

const orders = ref([])
// 서버에서 주문 내역 받아오기 (테스트용)
const fetchOrders = async () => {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          orderNumber: '20240706-0000001',
          orderDate: '2024.07.06',
          status: '상품준비중',
          products: [
            {
              id: 1,
              name: '프렌치 토스트 밀키트',
              quantityText: '2인분 / 1개',
              image:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo4Jinz57LhP8UclbLg255t0uVGnnKyQVprA&s',
              price: 8900,
            },
            {
              id: 2,
              name: '핫도그 세트',
              quantityText: '1인분 / 2세트',
              image:
                'https://static.wtable.co.kr/image/production/service/recipe/1793/78e41de9-7045-41e0-8a44-6cbbcd65ddd5.jpg?size=800x800',
              price: 12000,
            },
          ],
        },
      ])
    }, 500) // 0.5초 딜레이로 비동기 흉내
  })

  orders.value = response
}

// 화면 로딩 시 주문 데이터 불러오기
onMounted(() => fetchOrders())
</script>

<template>
  <div class="order-detail-info-body">
    <div class="order-detail-info-container">
      <div class="order-detail-info-header">
        <img src="/assets/icons/ic-arrow-left.png" alt="뒤로 가기" id="no-rotate" @click="goBack"/>
        <span>주문 상세조회</span>
        <div></div>
      </div>

      <div class="order-detail-info-first-container order-detail-page-container-section">
        <h3>주문번호 8fc531b3-9899-4233-b9c2-95a150977099</h3>
        <div>
          <p>2025-08-29 17:21</p>
          <span>|</span>
          <p>김아영</p>
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
            v-for="order in orders"
            :key="order.orderNumber"
            :order="order"
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
                  ><h4>45,600</h4>
                  원</span
                >
              </div>
              <div class="order-detail-discount-info-container">
                <div class="order-detail-space-between order-detail-payment-info">
                  <p>총 할인 혜택</p>
                  <span
                    ><h4>-2,200</h4>
                    원</span
                  >
                </div>

                <div class="product-discount-detail-list">
                  <div class="order-detail-space-between discount-detail-gray-font-color">
                    <span>ㄴ 상품 할인</span>
                    <span>-4,000원</span>
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
                    ><h4>45,600</h4>
                    원</span
                  >
                </div>

                <div class="product-discount-detail-list">
                  <div class="order-detail-space-between discount-detail-gray-font-color">
                    <span>ㄴ 결제 수단</span>
                    <span>카카오페이</span>
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
            <p>김아영</p>
            <p>010-2222-2222</p>
          </div>
        </div>

        <div class="order-delivery-place-info-box">
          <div class="order-delivery-place-info-box-left">
            <span>우편번호</span>
            <span>주소</span>
            <span>상세 주소</span>
          </div>
          <div class="order-delivery-place-info-box-rigth">
            <p>12345</p>
            <p>경남 양산시 양양양 산산산 123</p>
            <p>보라매아파트 111동 111호</p>
          </div>
        </div>

        <div class="order-delivery-place-info-box">
          <div class="order-delivery-place-info-box-left">
            <span>요청사항</span>
          </div>
          <div class="order-delivery-place-info-box-rigth">
            <p>문 앞에 놓아주세요.</p>
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
          <button class="order-detail-send-mail">
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

.order-detail-info-header > span {
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
