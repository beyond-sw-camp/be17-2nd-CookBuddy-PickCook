<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HomeBanner from '@/components/HomeBanner.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import api from '@/api/main'
import HomeCommunityCard from '@/components/HomeCommunityCard.vue'
import ProductItemCard from '@/components/ProductItemCard.vue'

const router = useRouter()
const route = useRoute()

const state = reactive({
  recipes: [],
  communities: [],
  products1: [],
  products2: [],
})

const getHomeData = async () => {
  const [recipeData, communityData, productData1, productData2] = await Promise.all([
    api.recipeList(),
    api.communityList(),
    api.productList1(),
    api.productList2(),
  ])

  console.log('productData1:', productData1)

  if (recipeData?.success && recipeData.results) {
    state.recipes.push(...recipeData.results)
  }

  if (communityData?.success && communityData.results) {
    state.communities.push(...communityData.results)
  }

  if (productData1?.success && productData1.results) {
    state.products1 = productData1.results
    console.log(state.products1)
  }

  if (productData2?.success && productData2.results) {
    state.products2 = productData2.results
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
const handleOAuth2LoginSuccess = () => {
  console.log('현재 URL 쿼리:', route.query)
  
  if (route.query.loginSuccess === 'true' && route.query.loginType === 'social') {
    const nickname = route.query.nickname
    
    if (nickname) {
      const decodedNickname = decodeURIComponent(nickname)
      showToast(`🎉 ${decodedNickname}님, 환영합니다!`)
    }
    
    router.replace({ query: {} })
  }
}

onMounted(() => {
  // OAuth2 로그인 성공 처리 먼저 실행
  handleOAuth2LoginSuccess()
  
  // 그다음 홈 데이터 로드
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
        v-for="(item, idx) in Array.isArray(state.recipes) ? state.recipes.slice(0, 4) : []"
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
      <ProductItemCard v-for="(item, idx) in state.products1" :key="idx" :product="item" />
    </div>
  </div>

  <!-- 식재료 판매 추천 섹션 2 -->
  <div class="content-section">
    <div class="section-header">
      <h2 class="section-title">🥘 밀키트 & 간편식</h2>
      <RouterLink to="/shopping" class="section-more">더보기 &gt;</RouterLink>
    </div>
    <div class="content-grid">
      <ProductItemCard
        v-for="(item, idx) in Array.isArray(state.products2) ? state.products2.slice(0, 4) : []"
        :key="idx"
        :product="item"
      />
    </div>
  </div>
</template>

<style scoped></style>
