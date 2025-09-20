<script setup>
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useUserStore } from './store/useUserStore'
import HeaderMenuSlider from './components/HeaderMenuSlider.vue'
import HeaderSearchSlider from './components/HeaderSearchSlider.vue'
import { ref } from 'vue'

const router = useRouter()

// 🔧 수정: restore 로직 완전 제거, 라우터 가드에서만 처리

// 메뉴 열림 상태
const isMenuOpen = ref(false)
const isSearchSlideOpen = ref(false)

function openMenu() {
  isMenuOpen.value = true
}

function closeMenu() {
  isMenuOpen.value = false
}

function openSearchSlide() {
  isSearchSlideOpen.value = true
}

function closeSearchSlide() {
  isSearchSlideOpen.value = false
}
</script>

<template>
  <Header
    v-if="!router.currentRoute.value.meta?.hideLayout"
    @open-menu="openMenu"
    @open-search-slide="openSearchSlide"
  />
  <HeaderMenuSlider v-if="isMenuOpen" @close="closeMenu" />
  <HeaderSearchSlider v-if="isSearchSlideOpen" @search-close="closeSearchSlide" />
  <RouterView :key="router.currentRoute.value.fullPath" />
  <Footer v-if="!router.currentRoute.value.meta?.hideLayout" />
</template>

<style scoped></style>
