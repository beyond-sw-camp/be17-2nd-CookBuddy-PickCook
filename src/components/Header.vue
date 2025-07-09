<script setup>
import { useUserStore } from '@/store/useUserStore'
import { RouterLink, useRoute } from 'vue-router'
import ProfileModal from './ProfileModal.vue'
import { ref, computed } from 'vue'

const route = useRoute()
const user = useUserStore()
const showProfileModal = ref(false)

// 경로 확인 (기존)
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  } else {
    return route.path.startsWith(path)
  }
}

// 프로필 모달 토글 (기존)
const profileModalToggle = () => {
  showProfileModal.value = !showProfileModal.value
}

// 경로에 따른 검색창 placeholder 변경
const searchPlaceholder = computed(() => {
  if (route.path === '/') return '통합검색'
  if (route.path.startsWith('/refrigerator')) return '재료로 레시피 검색'
  if (route.path.startsWith('/recipe')) return '음식이름으로 레시피 검색'
  if (route.path.startsWith('/shopping')) return '상품 검색'
  if (route.path.startsWith('/community')) return '커뮤니티 검색'
  return '통합검색' // 기본값
})
</script>

<template>
  <header class="header">
    <div class="header-top">
      <RouterLink to="/" class="logo">PickCook</RouterLink>
      <nav class="nav-menu">
        <RouterLink to="/" :class="{ active: isActive('/') }">홈</RouterLink>
        <RouterLink to="/refrigerator" :class="{ active: isActive('/refrigerator') }"
          >냉장고</RouterLink
        >
        <RouterLink to="/recipe" :class="{ active: isActive('/recipe') }">레시피</RouterLink>
        <RouterLink to="/shopping" :class="{ active: isActive('/shopping') }">쇼핑</RouterLink>
        <RouterLink to="/community" :class="{ active: isActive('/community') }"
          >커뮤니티</RouterLink
        >
      </nav>
      <div class="search-bar">
        <input type="text" :placeholder="searchPlaceholder" />
        <span>🔍</span>
      </div>
      <!-- 로그인 했을 경우 -->
      <div v-if="user.isLogin" class="header-right">
        <RouterLink to="/mypage/scrap_list">
          <img class="header-icon" src="/assets/icons/ic-scrap-header.png" />
        </RouterLink>
        <RouterLink to="#">
          <img class="header-icon" src="/assets/icons/ic-notification-header.png" />
        </RouterLink>
        <RouterLink to="/mypage/order_list">
          <img class="header-icon" src="/assets/icons/ic-cart-header.png" />
        </RouterLink>
        <div id="header-profile-img-container">
          <img
            @click="profileModalToggle"
            id="header-profile-image"
            src="/public/assets/icons/ic-default-profile-image.png"
            alt="profile image"
          />
          <ProfileModal v-if="showProfileModal" @click="profileModalToggle" class="profile-modal" />
        </div>
        <RouterLink to="/community/write" class="write-btn">글쓰기 &nbsp;&nbsp;▼</RouterLink>
      </div>
      <!-- 로그인 안 했을 경우 -->
      <div v-else class="header-right">
        <RouterLink to="/login">로그인</RouterLink>
        <RouterLink to="/signup">회원가입</RouterLink>
        <a href="#">고객센터</a>
        <RouterLink to="/community/write" class="write-btn">글쓰기 &nbsp;&nbsp;▼</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
