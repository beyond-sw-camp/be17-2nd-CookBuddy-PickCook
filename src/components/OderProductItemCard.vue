<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const orderId = route.params.orderId
const props = defineProps({
  order: Object,
  showHeader: {
    type: Boolean,
    default: true,
  },
  showButtons: {
    type: Boolean,
    default: true,
  },
})

console.log(props.order)

function statusClass(status) {
  switch (status) {
    case 'READY': // 배송 준비중
      return 'preparing-product'
    case 'IN_PROGRESS': // 배송중
      return 'in-delivery-product'
    case 'DELIVERED': // 배송완료
      return 'delivery-completed-product'
    case 'CANCELED': // 주문 취소
      return 'delivery-canceled-product'
    case 'REFUNDED': // 환불
      return 'delivery-refunded-product'
  }
}

function statusText(status) {
  switch (status) {
    case 'READY':
      return '상품 준비중'
    case 'IN_PROGRESS':
      return '배송중'
    case 'DELIVERED':
      return '배송완료'
    case 'CANCELED':
      return '주문 취소'
    case 'REFUNDED':
      return '환불'
    default:
      return ''
  }
}

function formatDateTime(isoString) {
  const date = new Date(isoString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const discountedPrice = (product) => {
  return Math.round((product.original_price * (100 - product.discount_rate)) / 100)
}

const goDetailInfo = () => {
  if (!props.order) return
  router.push({
    name: 'order-detail',
    params: { orderId: props.order.orderId },
  })
}

const goProductDetail = (productId) => {
  router.push(`/products/detail/${productId}`)
}

const goToReview = (productId) => {
  router.push(`/product/review/${productId}/${orderId}`)
}
</script>

<template>
  <div class="mypage-main-my-order-boards">
    <div v-if="showHeader" class="mypage-my-order-boards-top">
      <div class="mypage-my-order-boards-top-left">
        <p>{{ formatDateTime(order.date) }}</p>
      </div>
      <div class="mypage-my-order-boards-top-right">
        <img src="/assets/icons/ic-arrow-right.png" alt="주문 상세보기" @click="goDetailInfo" />
      </div>
    </div>

    <div class="mypage-my-order-boards-mid">
      <div
        class="mypage-my-order-boards-el"
        v-for="product in order.orderItems"
        :key="product.product_id"
      >
        <div class="mypage-my-order-boards-el-left">
          <img
            :src="product.product_image"
            alt="상품 이미지"
            @click="goProductDetail(product.product_id)"
          />
          <div class="mypage-my-order-boards-product-content">
            <div class="mypage-my-order-boards-product-name-and-status">
              <p @click="goProductDetail(product.product_id)">{{ product.product_name }}</p>

              <div :class="['order-status-code-tag', statusClass(order.status)]">
                <span>{{ statusText(order.status) }}</span>
              </div>
            </div>
            <div class="mypage-my-order-boards-product-amount-and-quantity">
              <span>{{ product.product_amount }}</span>
              |
              <span>{{ product.quantity }}개</span>
            </div>
            <div class="mypage-my-order-boards-product-price">
              {{ discountedPrice(product).toLocaleString() }}원
            </div>
          </div>
          <div v-if="showButtons" class="mypage-my-order-boards-buttons-container">
            <!-- hasReview가 false일 때만 리뷰 작성 버튼 표시 -->
            <button v-if="!product.hasReview" @click="goToReview(product.product_id)">
              리뷰작성
            </button>
            <button>반품신청</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mypage-my-order-boards-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mypage-my-order-boards-buttons-container > button {
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}

.mypage-my-order-boards-buttons-container > button:hover {
  background-color: #dcdcdc;
}
</style>
