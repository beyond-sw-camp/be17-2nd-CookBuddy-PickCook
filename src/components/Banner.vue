<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BannerApi from '@/api/banner/index'

const props = defineProps({
    autoPlay: {
        type: Boolean,
        default: true
    },
    autoPlayInterval: {
        type: Number,
        default: 3000
    }
})

const banners = ref([])
const currentSlide = ref(0)
const loading = ref(true)
let autoPlayTimer = null

// 배너 데이터 로드
onMounted(async () => {
  try {
    banners.value = await BannerApi.getBanners()
    console.log('배너 데이터 로드:', banners.value)
  } catch (error) {
    console.error('배너 로딩 실패:', error)
    // 실패 시 기본 배너 데이터 사용
    banners.value = [
      { 
        id: 1, 
        image: '/assets/banners/pickcook_banner01.png',
        title: '오늘의 밥, PickCook으로',
        subtitle: '똑똑하게 장보기'
      }
    ]
  } finally {
    loading.value = false
    startAutoPlay()
  }
})

// 메서드
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? banners.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const startAutoPlay = () => {
  if (props.autoPlay && banners.value.length > 1) {
    autoPlayTimer = setInterval(() => {
      nextSlide()
    }, props.autoPlayInterval)
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 라이프사이클
onUnmounted(() => {
  stopAutoPlay()
})

// 마우스 호버 시 자동 재생 중지/재개
const handleMouseEnter = () => {
  stopAutoPlay()
}

const handleMouseLeave = () => {
  startAutoPlay()
}
</script>

<template>
<div class="banner-section">
    <div class="banner-container">
      <div class="banner-slider">
        <div 
          v-for="(banner, index) in banners" 
          :key="index"
          class="banner-slide"
          :class="{ active: currentSlide === index }"
          :style="{
            backgroundImage: `url('${banner.image}')`,
            backgroundColor: banner.backgroundColor || 'transparent'
          }"
        >
          <span class="slide-number">{{ index + 1 }} / {{ banners.length }}</span>
        </div>
      </div>
      
      <button class="banner-nav banner-prev" @click="prevSlide">
        <img src="/assets/icons/ic-banner-left.png" alt="왼쪽">
      </button>
      
      <button class="banner-nav banner-next" @click="nextSlide">
        <img src="/assets/icons/ic-banner-right.png" alt="오른쪽">
      </button>
      
      <div class="banner-dots">
        <span 
          v-for="(banner, index) in banners"
          :key="`dot-${index}`"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>