<script setup>
import { computed, ref } from 'vue'
import api from '@/api/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

// 로컬 상태
const inCart = ref(props.product.inCart)
const cartAnimationg = ref(false)

const cartSrc = computed(() =>
  inCart.value
    ? '/assets/icons/ic-full-shopping-cart.png'
    : '/assets/icons/ic-empty-shopping-cart.png',
)

// 할인된 가격 계산
const price = computed(() => {
  const discount = props.product.original_price * (props.product.discount_rate / 100)
  return Math.floor(props.product.original_price - discount)
})

const toggleCart = async (event) => {
  event.stopPropagation()
  event.preventDefault()

  cartAnimationg.value = true
  setTimeout(() => {
    cartAnimationg.value = false
  }, 300)

  try {
    if (inCart.value) {
      // 현재 장바구니에 있음 → 삭제 호출
      await api.removeFromCart([props.product.id])
      inCart.value = false
    } else {
      // 장바구니에 없음 → 등록 호출
      await api.addToCart([props.product.id], 1)
      inCart.value = true
    }
  } catch (err) {
    console.error('장바구니 토글 실패', err)
    // 실패 시 상태 롤백
    inCart.value = !inCart.value
  }
}

</script>

<template>
  <router-link :to="`/shopping/detail/${props.product.id}`">
    <div class="ingredients-card content-card">
      <div class="card-image">
        <img :src="props.product.main_image_url" :alt="props.product.title" />
      </div>
      <div class="card-content">
        <div class="ingredients-title-container">
          <h3 class="card-title">{{ props.product.title }}</h3>
          <img class="shopping-cart-js" :src="cartSrc" alt="장바구니" @click="toggleCart" />
        </div>
        <div class="card-price">
          <span class="card-discount">{{ props.product.discount_rate }}%</span>
          <span>{{ price }}원</span>
          <div class="card-original-price">{{ props.product.original_price }}원</div>
        </div>
        <div class="ingredients-stats card-stats">
          <!-- TODO: 백엔드 리뷰 기능 완성 후 평점과 리뷰 수 받아와 적용하기 -->
          <!-- <span><img src="/assets/icons/ic-stars.png" alt="평점" />{{ product.rating }}</span>
          <span><img src="/assets/icons/ic-review.png" alt="리뷰" />{{ product.reviewCount }}</span> -->
          <span><img src="/assets/icons/ic-stars.png" alt="평점" />4.3</span>
          <span><img src="/assets/icons/ic-review.png" alt="리뷰" />32</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
