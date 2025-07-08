<script setup>
defineProps({
  stepNumber: Number,
  text: String,
  image: String,
})
</script>

<template>
  <div class="step">
    <div class="step-number">{{ stepNumber }}</div>
    <div class="step-content">
      <p>{{ text }}</p>
    </div>
    <img :src="image" alt="요리 이미지" />
  </div>
</template>

<style scoped>
.recipe-steps .step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.step-number {
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
  border-radius: 10px;
  margin-right: 20px;
}
.step-content {
  flex: 1;
}
.step img {
  width: 120px;
  margin-left: 20px;
  border-radius: 6px;
}
</style>
