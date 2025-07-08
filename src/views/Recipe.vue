<script setup>
import api from '@/api/recipe'
import { onMounted, reactive } from 'vue'
import RecipeCard from '@/components/RecipeCard.vue'

const recipeList = reactive([])
const getRecipeList = async () => {
  const data = await api.recipeList()
  if (data && data.success) {
    if (data.results) {
      recipeList.push(...data.results)
    }
  } else {
    recipeList.splice(0)
  }
}

onMounted(() => {
  getRecipeList()
})
</script>

<template>
  <!-- 필터 섹션 -->
  <div class="filter-section">
    <div class="filter-container">
      <span class="filter-tag">정렬 &nbsp;▼</span>
      <span class="filter-tag">요리시간 &nbsp;▼</span>
      <span class="filter-tag">난이도 &nbsp;▼</span>
      <span class="filter-tag">종류 &nbsp;▼</span>
      <span class="filter-tag">재료 &nbsp;▼</span>
      <span class="filter-tag">조리방법 &nbsp;▼</span>
      <span class="filter-tag">칼로리 &nbsp;▼</span>
      <span class="filter-tag">인분 &nbsp;▼</span>
    </div>
  </div>

  <!-- 컨텐츠 섹션 -->
  <div class="content-section">
    <div class="content-header">
      <p class="result-count">전체 14,596</p>
    </div>

    <!-- 레시피 그리드 -->
    <div class="content-grid">
      <RecipeCard v-for="(recipe, index) in recipeList" :key="index" :recipe="recipe" />
    </div>
  </div>
</template>

<style scoped>
/* 필터 바 */
.filter-section {
  background-color: white;
  padding: 10px 0;
  border-bottom: 1px solid #eaedef;
}

.filter-container {
  max-width: 1256px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 6px 14px;
  border: 1px solid #dadce0;
  border-radius: 20px;
  background-color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tag:hover {
  background-color: #f5f5f5;
}

.content-section {
  margin-top: 38px;
}

.content-grid {
  margin-top: 8px;
}

/* 반응형 */
@media (max-width: 1024px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .search-bar {
    width: auto;
    flex: 1;
  }

  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
