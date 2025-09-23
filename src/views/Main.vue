<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HomeBanner from '@/components/HomeBanner.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import api from '@/api/main'
import HomeCommunityCard from '@/components/HomeCommunityCard.vue'
import ProductItemCard from '@/components/ProductItemCard.vue'
import { useUserStore } from '@/store/useUserStore'
import { useBreakpoints } from '@/composables/useBreakpoints'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { isTablet } = useBreakpoints()

const state = reactive({
  recipes: [],
  communities: [],
  specialDeals: [], // 신선 식재료 특가
  bestSellers: [], // 베스트 셀러
})

// 화면 크기에 따라 보여줄 개수 결정
const visibleCount = computed(() => (isTablet.value ? 6 : 4))

const getHomeData = async () => {
  let recipeData = []

  if (userStore.state.isLogin) {
    // 로그인: 냉장고 재료 기반 추천
    const res = await api.recommendedRecipeList()
    recipeData = res || []
  } else {
    // 비로그인: 인기 레시피
    const res = await api.popularRecipeList()
    recipeData = res || []
  }

  // 커뮤니티 / 상품 데이터
  const [communityData, specialDeals, bestSellers] = await Promise.all([
    api.communityList(),
    api.specialDealsProductList(), // 특가 API
    api.bestSellerList(), // 베스트셀러 API
  ])

  if (recipeData.length) state.recipes.push(...recipeData)
  if (communityData.length) state.communities.push(...communityData)
  if (specialDeals.length) state.specialDeals.push(...specialDeals)
  if (bestSellers.length) state.bestSellers.push(...bestSellers)
}

// 토스트 메시지 함수
const showToast = (message) => {
  const toast = document.createElement('div')
  toast.innerHTML = message
  toast.style.cssText = `
    position: fixed;
    top: 60px;
    right: 60px;
    background: #E14345;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
  }, 100)

  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 2000)
}

// OAuth2 로그인 성공 처리
const handleLoginSuccess = async () => {
  if (route.query.loginSuccess === 'true') {
    const nickname = route.query.nickname
    const loginType = route.query.loginType

    if (!userStore.state.user) {
      try {
        await userStore.restore()
      } catch (error) {
        console.error('사용자 정보 복원 실패:', error)
      }
    }

    if (nickname) {
      const decodedNickname = decodeURIComponent(nickname)
      let message = `🎉 ${decodedNickname}님, 환영합니다!`
      showToast(message)
    }

    router.replace({ query: {} })
  }
}

onMounted(async () => {
  await handleLoginSuccess()
  getHomeData()
})
</script>

<template>
  <!-- 배너 섹션 -->
  <HomeBanner />

  <!-- 레시피 추천 -->
  <div class="content-section">
    <div class="section-header">
      <h2 v-if="userStore.state.isLogin" class="section-title">
        🍳 냉장고 재료로 만들 수 있는 레시피
      </h2>
      <h2 v-else class="section-title">🍳 인기 레시피</h2>
      <RouterLink to="/recipe" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <RecipeCard
        v-for="(item, idx) in state.recipes.slice(0, visibleCount)"
        :key="idx"
        :recipe="item"
      />
    </div>
  </div>

  <!-- 커뮤니티 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">👥 실시간 인기 커뮤니티</h2>
      <RouterLink to="/community" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <HomeCommunityCard
        v-for="(item, idx) in state.communities.slice(0, visibleCount)"
        :key="idx"
        :community="item"
      />
    </div>
  </div>

  <!-- 신선 식재료 특가 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🛒 신선 식재료 특가</h2>
      <RouterLink to="/products" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <ProductItemCard
        v-for="(item, idx) in state.specialDeals.slice(0, visibleCount)"
        :key="idx"
        :product="item"
      />
    </div>
  </div>

  <!-- 베스트 셀러 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🔥 베스트 상품</h2>
      <RouterLink to="/products" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <ProductItemCard
        v-for="(item, idx) in state.bestSellers.slice(0, visibleCount)"
        :key="idx"
        :product="item"
      />
    </div>
  </div>
</template>
