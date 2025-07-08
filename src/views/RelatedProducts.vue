<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MiniProductCard from '@/components/MiniProductCard.vue'

const props = defineProps({
  title: String,
})

const showLeftButton = ref(false)
const showRightButton = ref(false)
const carousel = ref(null)

const scrollLeft = () => {
  carousel.value.scrollLeft -= 200
  checkScroll()
}
const scrollRight = () => {
  carousel.value.scrollLeft += 200
  checkScroll()
}
const checkScroll = () => {
  const el = carousel.value
  if (!el) return
  showLeftButton.value = el.scrollLeft > 0
  showRightButton.value = el.scrollLeft + el.clientWidth < el.scrollWidth
}

onMounted(() => {
  checkScroll()
  window.addEventListener('resize', checkScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScroll)
})
</script>
<template>
  <section class="related-products">
    <h3>
      <span class="highlight">{{ title }}</span> 관련 상품
    </h3>

    <div class="carousel-wrapper">
      <button class="nav-button left" v-if="showLeftButton" @click="scrollLeft">‹</button>

      <div class="product-carousel" ref="carousel" @scroll="checkScroll">
        <MiniProductCard v-for="n in 10" :key="n" :index="n" />
      </div>

      <button class="nav-button right" v-if="showRightButton" @click="scrollRight">›</button>
    </div>
  </section>
</template>

<style scoped>
.related-products {
  margin-bottom: 40px;
}
.related-products h3 .highlight {
  color: var(--color-primary);
  font-weight: bold;
}
.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.product-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;
  width: 100%;
}
.product-carousel::-webkit-scrollbar {
  display: none;
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
}
.nav-button.left {
  left: -18px;
}
.nav-button.right {
  right: -18px;
}
</style>
