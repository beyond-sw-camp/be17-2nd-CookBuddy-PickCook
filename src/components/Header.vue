<script setup>
import { useUserStore } from '@/store/useUserStore'
import { RouterLink, useRoute } from 'vue-router'
import ProfileModal from './ProfileModal.vue'
import { ref } from 'vue'

const route = useRoute()
const user = useUserStore()
const showProfileModal = ref(false)

// 경로 확인
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  } else {
    return route.path.startsWith(path)
  }
}

const profileModalToggle = () => {
  showProfileModal.value = !showProfileModal.value
}
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
        <input type="text" placeholder="통합검색" />
        <span>🔍</span>
      </div>
      <!-- 로그인 했을 경우 -->
      <div v-if="user.isLogin" class="header-right">
        <RouterLink to="/">
          <img class="header-icon" src="/assets/icons/ic-scrap-header.png" />
        </RouterLink>
        <RouterLink to="/">
          <img class="header-icon" src="/assets/icons/ic-notification-header.png" />
        </RouterLink>
        <RouterLink to="/">
          <img class="header-icon" src="/assets/icons/ic-cart-header.png" />
        </RouterLink>
        <img
          @click="profileModalToggle"
          id="header-profile-image"
          src="/public/assets/icons/ic-default-profile-image.png"
          alt="profile image"
        />
        <ProfileModal v-if="showProfileModal" class="profile-modal" />
        <a href="#" class="write-btn">글쓰기 &nbsp;&nbsp;▼</a>
      </div>
      <!-- 로그인 안 했을 경우 -->
      <div v-else class="header-right">
        <RouterLink to="/login">로그인</RouterLink>
        <RouterLink to="/signup">회원가입</RouterLink>
        <a href="#">고객센터</a>
        <a href="#" class="write-btn">글쓰기 &nbsp;&nbsp;▼</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: white;
  border-bottom: 1px solid #eaedef;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  max-width: 1256px;
  margin: 0 auto;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary-strong);
  text-decoration: none;
  margin-right: 30px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
  flex: 1;
}

.nav-menu a {
  text-decoration: none;
  color: var(--color-gray);
  font-size: 16px;
  font-weight: 500;
}

.nav-menu a.active {
  color: var(--color-primary-strong);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px 16px;
  width: 300px;
  margin-right: 20px;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-dark-strong);
}

.header-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

.header-right > a {
  text-decoration: none;
  color: var(--color-gray);
  font-size: 14px;
  font-weight: 400;
}

a:hover {
  color: var(--color-primary-strong);
}

.write-btn {
  background-color: var(--color-primary);
  color: white !important;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.write-btn:hover {
  background-color: var(--color-primary-dark);
}
</style>
