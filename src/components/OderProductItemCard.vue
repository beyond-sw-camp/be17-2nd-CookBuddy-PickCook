<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  order: Object,
  showHeader: {        
    type: Boolean,
    default: true
  }
})

// 총 가격 계산
const totalPrice = props.order.products.reduce((acc, cur) => acc + cur.price, 0)

function statusClass(status) {
  switch (status) {
    case '상품준비중':
      return 'preparing-product'
    case '배송중':
      return 'in-delivery-product'
    case '배송완료':
      return 'delivery-completed-product'
    default:
      return ''
  }
}

function goDetailInfo() { router.push('/order/details') }
</script>

<template>
  <div class="mypage-main-my-order-boards">
    <div v-if="showHeader" class="mypage-my-order-boards-top">
      <div class="mypage-my-order-boards-top-left">
        <p>{{ order.orderDate }}</p>
      </div>
      <div class="mypage-my-order-boards-top-right">
        <img src="/assets/icons/ic-arrow-right.png" alt="주문 상세보기" @click="goDetailInfo"/>
      </div>
    </div>

    <div class="mypage-my-order-boards-mid">
      <div class="mypage-my-order-boards-el" v-for="product in order.products" :key="product.id">
        <div class="mypage-my-order-boards-el-left">
          <img :src="product.image" alt="상품 이미지" />
          <div class="mypage-my-order-boards-product-content">
            <div class="mypage-my-order-boards-product-name-and-status">
              <p>{{ product.name }}</p>

              <!-- 태그 종류는 3개, 상품준비중(preparing-product, in-delivery-product, delivery-completed-product) -->
              <div :class="['order-status-code-tag', statusClass(order.status)]">
                <span>{{ order.status }}</span>
              </div>
            </div>
            <span>{{ product.quantityText }}</span>
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
