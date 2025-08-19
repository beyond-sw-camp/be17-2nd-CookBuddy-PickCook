<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeBanner from '@/components/HomeBanner.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import api from '@/api/main'
import HomeCommunityCard from '@/components/HomeCommunityCard.vue'
import ProductItemCard from '@/components/ProductItemCard.vue'

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

  console.log('레시피 데이터:', recipeData)

  if (recipeData.length) {
    state.recipes.push(...recipeData)
    console.log('실행 왜 안돼', state.recipes)
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

onMounted(() => {
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
    <div class="content-grid" v-if="state.recipes.length">
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
