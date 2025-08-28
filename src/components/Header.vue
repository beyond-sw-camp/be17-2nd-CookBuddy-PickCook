<script setup>
import { useUserStore } from '@/store/useUserStore'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ProfileModal from './ProfileModal.vue'
import { ref, computed, defineEmits } from 'vue'
import { useBreakpoints } from '@/composables/useBreakpoints.js'

const router = useRouter()
const route = useRoute()
const auth = useUserStore()
const showProfileModal = ref(false)
const { isDesktop, isMobileOrTablet } = useBreakpoints()
const emit = defineEmits(['open-menu'])
const keyword = ref('')

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

const search = () => {
  if (!keyword.value.trim()) return

  // 기존 쿼리 유지하면서 keyword만 변경
  router.push({
    name: route.name,
    query: {
      ...route.query, // 기존 page, size, dir 유지
      keyword: keyword.value.trim(),
      page: 0, // 검색 시 1페이지로 초기화
    },
  })
}

// 경로에 따른 검색창 placeholder 변경
const searchPlaceholder = computed(() => {
  if (route.path === '/') return '통합검색'
  if (route.path.startsWith('/refrigerator')) return '재료로 레시피 검색'
  if (route.path.startsWith('/recipe')) return '음식이름으로 레시피 검색'
  if (route.path.startsWith('/products')) return '상품 검색'
  if (route.path.startsWith('/community')) return '커뮤니티 검색'
  return '통합검색' // 기본값
})

// 태블릿, 모바일 환경에서 메뉴 열기
function openMenu() {
  emit('open-menu')
}

function openSearchSlide() {
  emit('open-search-slide')
}
</script>

<template>
  <header class="header">
    <div v-if="isMobileOrTablet" class="header-mobile-and-tablet">
      <img src="/assets/icons/ic-header-more-button.png" alt="더보기" @click="openMenu" />
      <RouterLink to="/" class="logo">PickCook</RouterLink>
      <img src="/assets/icons/ic-search-header.png" alt="검색" @click="openSearchSlide" />
    </div>
    <div v-else class="header-top">
      <RouterLink to="/" class="logo">PickCook</RouterLink>
      <nav class="nav-menu">
        <RouterLink to="/" :class="{ active: isActive('/') }">홈</RouterLink>
        <RouterLink to="/refrigerator" :class="{ active: isActive('/refrigerator') }"
          >냉장고</RouterLink
        >
        <RouterLink to="/recipe" :class="{ active: isActive('/recipe') }">레시피</RouterLink>
        <RouterLink to="/products" :class="{ active: isActive('/products') }">쇼핑</RouterLink>
        <RouterLink to="/community" :class="{ active: isActive('/community') }"
          >커뮤니티</RouterLink
        >
      </nav>
      <div class="search-bar">
        <input
          v-model="keyword"
          @keyup.enter="search"
          type="text"
          :placeholder="searchPlaceholder"
        />
        <span
          ><img
            @click="search"
            class="header-search-icon"
            src="/assets/icons/ic-search-header.png"
            alt="검색"
        /></span>
      </div>
      <!-- 로그인 했을 경우 -->
      <div v-if="auth.state.isLogin" class="header-right">
        <RouterLink to="/mypage/scrap_list">
          <img class="header-icon" src="/assets/icons/ic-scrap-header.png" />
        </RouterLink>
        <RouterLink to="#">
          <img class="header-icon" src="/assets/icons/ic-notification-header.png" />
        </RouterLink>
        <RouterLink to="/mypage/cart">
          <img class="header-icon" src="/assets/icons/ic-cart-header.png" />
        </RouterLink>
        <div id="header-profile-img-container">
          <img
            @click="profileModalToggle"
            id="header-profile-image"
            src="/assets/icons/ic-default-profile-image.png"
            alt="profile image"
          />
          <ProfileModal v-if="showProfileModal" @click="profileModalToggle" class="profile-modal" />
        </div>
        <RouterLink to="/community/write" class="write-btn">글쓰기 &nbsp;&nbsp;▼</RouterLink>
      </div>
      <!-- 로그인 안 했을 경우 -->
      <div v-else class="header-right">
        <RouterLink to="/login">로그인</RouterLink>
        <RouterLink to="/user/signup">회원가입</RouterLink>
        <a href="#">고객센터</a>
        <RouterLink to="/community/write" class="write-btn">글쓰기 &nbsp;&nbsp;▼</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
