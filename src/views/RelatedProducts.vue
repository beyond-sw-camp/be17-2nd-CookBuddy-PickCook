<script setup>
import { reactive, onMounted, watch, computed } from 'vue'
import MiniProductCard from '@/components/MiniProductCard.vue'
import shoppingAPI from '@/api/shopping'

const props = defineProps({
  recipeId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const state = reactive({
  products: [],
  loading: false,
  error: null,
  currentPage: 0, // 0부터 시작 (0페이지, 1페이지)
  itemsPerPage: 8,
})

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(state.products.length / state.itemsPerPage)
})

// 현재 페이지 상품들
const currentProducts = computed(() => {
  const startIndex = state.currentPage * state.itemsPerPage
  const endIndex = startIndex + state.itemsPerPage
  return state.products.slice(startIndex, endIndex)
})

// 페이지 버튼 표시 여부
const showLeftButton = computed(() => state.currentPage > 0)
const showRightButton = computed(() => state.currentPage < totalPages.value - 1)

const fetchRelatedProducts = async () => {
  if (!props.recipeId) return

  state.loading = true
  state.error = null

  try {
    const data = await shoppingAPI.getRelatedProductsByRecipe(props.recipeId)
    state.products = data
    state.currentPage = 0 // 첫 페이지로 리셋
    console.log('🔍 총 상품 개수:', state.products.length)
    console.log('🔍 총 페이지 수:', totalPages.value)
  } catch (err) {
    console.error('연관 상품 조회 실패:', err)
    state.error = '상품을 불러오는데 실패했습니다.'
    state.products = []
  } finally {
    state.loading = false
  }
}

const goToPreviousPage = () => {
  if (state.currentPage > 0) {
    state.currentPage--
    console.log('🔍 이전 페이지:', state.currentPage + 1)
  }
}

const goToNextPage = () => {
  if (state.currentPage < totalPages.value - 1) {
    state.currentPage++
    console.log('🔍 다음 페이지:', state.currentPage + 1)
  }
}

watch(
  () => props.recipeId,
  (newId) => {
    if (newId) {
      fetchRelatedProducts()
    }
  },
)

onMounted(() => {
  fetchRelatedProducts()
})
</script>

<template>
  <section class="related-products">
    <h3>
      <span class="highlight">{{ title }}</span> 관련 상품
      <span class="page-info" v-if="!state.loading && state.products.length > 0">
        ({{ state.currentPage + 1 }}/{{ totalPages }})
      </span>
    </h3>

    <div v-if="state.loading" class="loading-message">상품을 불러오는 중...</div>

    <div v-else-if="state.error" class="error-message">
      {{ state.error }}
    </div>

    <div v-else-if="state.products.length === 0" class="empty-message">추천할 상품이 없습니다.</div>

    <div v-else class="carousel-wrapper">
      <button
        class="nav-button left"
        v-if="showLeftButton"
        @click="goToPreviousPage"
        :disabled="!showLeftButton"
      >
        <img src="/assets/icons/ic-arrow-left.png" alt="왼쪽"/>
      </button>

      <div class="product-grid">
        <MiniProductCard
          v-for="product in currentProducts"
          :key="product.productId"
          :product-id="product.productId"
          :title="product.title"
          :original-price="product.originalPrice"
          :discount-rate="product.discountRate"
          :main-image-url="product.mainImageUrl"
          :match-type="product.matchType"
          :matched-ingredient="product.matchedIngredient"
        />
      </div>

      <button
        class="nav-button right"
        v-if="showRightButton"
        @click="goToNextPage"
        :disabled="!showRightButton"
      >
        <img src="/assets/icons/ic-arrow-right.png" alt="오른쪽"/>
      </button>
    </div>

    <!-- 페이지 인디케이터 (점 표시) -->
    <div v-if="totalPages > 1" class="page-indicators">
      <span
        v-for="page in totalPages"
        :key="page"
        :class="['indicator', { active: page - 1 === state.currentPage }]"
        @click="state.currentPage = page - 1"
      ></span>
    </div>
  </section>
</template>

<style scoped>
.related-products {
  margin-bottom: 40px;
}

.related-products h3 {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
  font-size: 18px;
}

.related-products h3 .highlight {
  color: var(--color-primary);
  font-weight: bold;
}

.page-info {
  font-size: 14px;
  color: var(--color-gray);
  font-weight: normal;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 140px; /* 카드 높이 고정 */
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4열 그리드 */
  grid-template-rows: repeat(2, 1fr); /* 2행 그리드 */
  gap: 25px 16px;
  width: 100%;
  padding: 20px 40px; /* 좌우 버튼 공간 확보 */
  min-height: 120px;
}

/* 반응형: 작은 화면에서는 2x4 그리드 */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    padding: 10px 30px;
  }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-button:hover:not(:disabled) {
  background: #f5f5f5;
  transform: translateY(-50%) scale(1.1);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-button.left {
  left: 0;
}

.nav-button.right {
  right: 0;
}

.page-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.indicator.active {
  background-color: var(--color-primary);
  transform: scale(1.2);
}

.indicator:hover {
  background-color: var(--color-primary);
  opacity: 0.7;
}

.loading-message,
.error-message,
.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-gray);
}

.debug-info {
  font-size: 12px;
  color: var(--color-gray);
  text-align: center;
  margin-top: 10px;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.nav-button > img {
  width: 20px;
}
</style>
