<script setup>
defineProps({
  index: Number,
})
</script>
<template>
  <div class="product">
    <img
      src="https://oasisprodproduct.edge.naverncp.com/83235/detail/1_3bd41c27-77ff-47a2-a207-d41012a70c70.jpg"
      alt="상품"
    />
    <p>양배추</p>
    <p>5,800원</p>
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
