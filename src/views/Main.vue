<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HomeBanner from '@/components/HomeBanner.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import api from '@/api/main'
import HomeCommunityCard from '@/components/HomeCommunityCard.vue'
import ProductItemCard from '@/components/ProductItemCard.vue'
import { useUserStore } from '@/store/useUserStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const state = reactive({
  recipes: [],
  communities: [],
  products: [],
})

const getHomeData = async () => {
  const [recipeData, communityData, productData] = await Promise.all([
    api.recipeList(),
    api.communityList(),
    api.productList(),
  ])

  if (recipeData.length) {
    state.recipes.push(...recipeData)
  }

  if (communityData?.success && communityData.results) {
    state.communities.push(...communityData.results)
  }

  if (productData.length) {
    state.products.push(...productData)
  }
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
  
  // 애니메이션으로 나타나기
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
  }, 100)
  
  // 2초 후 자동으로 사라지기
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 2000)
}

// OAuth2 로그인 성공 처리 함수
const handleLoginSuccess = async () => {
  console.log('현재 URL 쿼리:', route.query)
  
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
      
      let message
      if (loginType === 'social') {
        message = `🎉 ${decodedNickname}님, 환영합니다!`
      } else if (loginType === 'normal') {
        message = `🎉 ${decodedNickname}님, 환영합니다!`
      }
      showToast(message)
    }
    
    router.replace({ query: {} })
  }
}


onMounted(async () => {
  await handleLoginSuccess() // async 추가
  getHomeData()
})

</script>

<template>
  <!-- 배너 섹션 -->
  <HomeBanner />

  <!-- 레시피 추천 섹션 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🍳 냉장고 재료로 만들 수 있는 레시피</h2>
      <RouterLink to="/recipe" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <RecipeCard
        v-for="(item, idx) in state.recipes.slice(0, 4)"
        :key="idx"
        :recipe="item"
      />
    </div>
  </div>

  <!-- 커뮤니티 추천 섹션 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">👥 실시간 인기 커뮤니티</h2>
      <RouterLink to="/community" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <HomeCommunityCard
        v-for="(item, idx) in state.communities.slice(0, 4)"
        :key="idx"
        :community="item"
      />
    </div>
  </div>

  <!-- 식재료 판매 추천 섹션 1 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🛒 신선 식재료 특가</h2>
      <RouterLink to="/shopping" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <ProductItemCard v-for="(item, idx) in state.products.slice(0, 4)" :key="idx" :product="item" />
    </div>
  </div>

  <!-- 식재료 판매 추천 섹션 2 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🥘 밀키트 & 간편식</h2>
      <RouterLink to="/shopping" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
        <ProductItemCard v-for="(item, idx) in state.products.slice(0, 4)" :key="idx" :product="item" />
    </div>
  </div>
</template>

<style scoped></style>
