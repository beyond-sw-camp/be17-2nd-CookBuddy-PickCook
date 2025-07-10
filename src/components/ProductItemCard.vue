<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const isSelected = ref(false)
const selectAnimationg = ref(false)

const cartSrc = computed(() => 
    isSelected.value ? '/assets/icons/ic-full-shopping-cart.png' : '/assets/icons/ic-empty-shopping-cart.png',
)

const toggleCart = () => {
    isSelected.value = !isSelected.value

    selectAnimationg.value = true
    setTimeout(() => {
        selectAnimationg.value = false
    }, 300)
}
</script>

<template>
  <router-link :to="`/shopping/detail/${product.id}`">
    <div class="ingredients-card content-card">
      <div class="card-image">
        <img :src="product.image" :alt="product.title" />
      </div>
      <div class="card-content">
        <div class="ingredients-title-container">
          <h3 class="card-title">{{ product.title }}</h3>
          <img
            class="shopping-cart-js"
            :src="cartSrc"
            alt="장바구니"
            @click="toggleCart"
          />
        </div>
        <div class="card-price">
          <span class="card-discount">{{ product.discount }}%</span>
          <span>{{ product.price }}원</span>
          <div class="card-original-price">{{ product.originalPrice }}원</div>
        </div>
        <div class="ingredients-stats card-stats">
          <span><img src="/assets/icons/ic-stars.png" alt="평점" />{{ product.rating }}</span>
          <span><img src="/assets/icons/ic-review.png" alt="리뷰" />{{ product.reviewCount }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
