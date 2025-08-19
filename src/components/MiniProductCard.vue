<!-- 레시피 페이지에서 상품 추천할 때 사용하는 상품 컴포넌트 -->

<script setup>
defineProps({
  name: String,
  price: String,
  image: String,
})
</script>

<template>
  <div class="product">
    <img :src="image" :alt="name" />
    <p>{{ name }}</p>
    <p>{{ price }}</p>
  </div>
</template>

<style scoped>
.product {
  text-align: center;
  min-width: 100px;
}
.product img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
