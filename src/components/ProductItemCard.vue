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
const inCart = ref(props.product.isInCart)
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
    // 실패 시 상태 롤백
    inCart.value = !inCart.value
  }
}

// 평균 별점 - 백엔드에서 받은 실제 데이터 사용
const averageRating = computed(() => {
  if (!props.product.average_rating || props.product.average_rating === 0) {
    return '0.0'
  }
  return Number(props.product.average_rating).toFixed(1)
})

// 리뷰 개수 - 백엔드에서 받은 실제 데이터 사용
const reviewCount = computed(() => {
  return props.product.review_count || 0
})

// 별점이 있는지 확인 (0보다 큰 경우에만 별 아이콘 표시)
const hasRating = computed(() => {
  return props.product.average_rating && props.product.average_rating > 0
})
</script>

<template>
  <router-link :to="`/products/detail/${props.product.id}`">
    <div class="ingredients-card content-card">
      <div class="card-image">
        <<img
          :src="props.product.main_image_url || '/assets/images/no-image.png'"
          alt="상품 이미지"
        />
      </div>
      <div class="card-content">
        <div class="ingredients-title-container">
          <h3 class="card-title">{{ props.product.title }}</h3>
          <img class="shopping-cart-js" :src="cartSrc" alt="장바구니" @click="toggleCart" />
        </div>
        <div class="card-price">
          <span class="card-discount">{{ props.product.discount_rate }}%</span>
          <span>{{ price.toLocaleString() }}원</span>
          <div class="card-original-price">
            {{ props.product.original_price.toLocaleString() }}원
          </div>
        </div>
        <div class="ingredients-stats card-stats">
          <!-- 별점이 있을 때만 표시 -->
          <span v-if="hasRating">
            <img src="/assets/icons/ic-stars.png" alt="평점" />
            {{ averageRating }}
          </span>
          <!-- 별점이 없을 때는 대체 텍스트 -->
          <span v-else class="no-rating">
            <img src="/assets/icons/ic-stars.png" alt="평점" style="opacity: 0.3" />
            평점 없음
          </span>

          <span>
            <img src="/assets/icons/ic-review.png" alt="리뷰" />
            {{ reviewCount }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.no-rating {
  color: #999;
  font-size: 12px;
}
</style>
