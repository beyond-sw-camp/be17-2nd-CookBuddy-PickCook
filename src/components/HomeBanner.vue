<script setup>
import { ref, onMounted } from 'vue'

const slides = ref([])
const dots = ref([])
let currentSlide = ref(0)
let intervalId = null

onMounted(() => {
  slides.value = document.querySelectorAll('.banner-slide')
  dots.value = document.querySelectorAll('.dot')
  const prevBtn = document.querySelector('.banner-prev')
  const nextBtn = document.querySelector('.banner-next')

  function changeSlide(index) {
    slides.value[currentSlide.value].classList.remove('active')
    dots.value[currentSlide.value].classList.remove('active')

    currentSlide.value = index
    slides.value[currentSlide.value].classList.add('active')
    dots.value[currentSlide.value].classList.add('active')
  }

  function nextSlide() {
    const nextIndex = (currentSlide.value + 1) % slides.value.length
    changeSlide(nextIndex)
  }

  function prevSlide() {
    const prevIndex = (currentSlide.value - 1 + slides.value.length) % slides.value.length
    changeSlide(prevIndex)
  }

  nextBtn.addEventListener('click', nextSlide)
  prevBtn.addEventListener('click', prevSlide)

  dots.value.forEach((dot, index) => {
    dot.addEventListener('click', () => changeSlide(index))
  })

  intervalId = setInterval(nextSlide, 5000)
})
</script>

<template>
  <div class="banner-section">
    <div class="banner-container">
      <div class="banner-slider">
        <div
          class="banner-slide active"
          style="background-image: url('/assets/banners/banner1.png')"
        >
          <span class="slide-number">1 / 5</span>
        </div>

        <div class="banner-slide" style="background-image: url('/assets/banners/banner2.png')">
          <span class="slide-number">2 / 5</span>
        </div>

        <div class="banner-slide" style="background-image: url('/assets/banners/banner3.png')">
          <span class="slide-number">3 / 5</span>
        </div>

        <div class="banner-slide" style="background-image: url('/assets/banners/banner4.png')">
          <span class="slide-number">4 / 5</span>
        </div>

        <div class="banner-slide" style="background-image: url('/assets/banners/banner5.png')">
          <span class="slide-number">5 / 5</span>
        </div>
      </div>

      <button class="banner-nav banner-prev">
        <img src="/assets/icons/ic-banner-left.png" alt="왼쪽" />
      </button>
      <button class="banner-nav banner-next">
        <img src="/assets/icons/ic-banner-right.png" alt="오른쪽" />
      </button>

      <div class="banner-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
