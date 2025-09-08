<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountRate: {
    type: Number,
    default: 0,
  },
  mainImageUrl: {
    type: String,
    required: true,
  },
  matchType: {
    type: String,
    default: 'INGREDIENT_MATCH',
  },
  matchedIngredient: {
    type: String,
    default: '',
  },
})

const discountedPrice = computed(() => {
  return Math.floor(props.originalPrice * (1 - props.discountRate / 100))
})

const goToProductDetail = () => {
  router.push(`/products/detail/${props.productId}`)
}
</script>

<template>
  <div class="product" @click="goToProductDetail">
    <div class="product-image-container">
      <img :src="mainImageUrl" :alt="title" />
      <div v-if="matchType === 'INGREDIENT_MATCH'" class="match-badge ingredient">
        {{ matchedIngredient }}
      </div>
      <div v-else class="match-badge random">추천</div>
    </div>

    <div class="product-info">
      <p>{{ title }}</p>
      <p class="price-text">
        <span v-if="discountRate > 0" class="discount-rate">{{ discountRate }}%</span>
        {{ discountedPrice.toLocaleString() }}원
        <span v-if="discountRate > 0" class="original-price"
          >{{ originalPrice.toLocaleString() }}원</span
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.product {
  text-align: center;
  min-width: 100px;
  cursor: pointer;
}

.product img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-image-container {
  position: relative;
  display: inline-block;
}

.match-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
}

.match-badge.ingredient {
  background-color: var(--color-primary);
}

.match-badge.random {
  background-color: var(--color-gray);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 10px;
}

.product-info > p:first-child {
  font-size: 15px;
}

.product-info > p:last-child {
  font-size: 14px;
  color: var(--color-dark-strong);
}

.price-text {
  font-size: 12px;
  font-weight: bold;
}

.discount-rate {
  color: var(--color-primary);
  margin-right: 4px;
}

.original-price {
  text-decoration: line-through;
  color: var(--color-gray);
  font-size: 10px;
  margin-left: 4px;
}
</style>
