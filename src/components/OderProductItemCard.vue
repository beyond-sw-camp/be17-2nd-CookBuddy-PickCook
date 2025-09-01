<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  order: Object,
  showHeader: {
    type: Boolean,
    default: true,
  },
})

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

function goDetailInfo() {
  router.push('/order/details')
}
</script>

<template>
  <div class="mypage-main-my-order-boards">
    <div v-if="showHeader" class="mypage-my-order-boards-top">
      <div class="mypage-my-order-boards-top-left">
        <p>{{ order.orderDate }}</p>
      </div>
      <div class="mypage-my-order-boards-top-right">
        <img src="/assets/icons/ic-arrow-right.png" alt="주문 상세보기" @click="goDetailInfo" />
      </div>
    </div>

    <div class="mypage-my-order-boards-mid">
      <div class="mypage-my-order-boards-el" v-for="product in order.products" :key="product.id">
        <div class="mypage-my-order-boards-el-left">
          <img :src="product.image" alt="상품 이미지" />
          <div class="mypage-my-order-boards-product-content">
            <div class="mypage-my-order-boards-product-name-and-status">
              <p>{{ product.name }}</p>

              <div :class="['order-status-code-tag', statusClass(order.status)]">
                <span>{{ statusText(order.status) }}</span>
              </div>
            </div>
            <div class="mypage-my-order-boards-product-amount-and-quantity">
              <span>{{ product.amount }}</span>
              |
              <span>{{ product.quantityText }}</span>
            </div>
            <div class="mypage-my-order-boards-product-price">
              {{ product.price.toLocaleString() }}원
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
