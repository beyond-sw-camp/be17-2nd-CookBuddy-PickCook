<script setup>
import api from '@/api/recipe'
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import RecipeCard from '@/components/RecipeCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()

const recipeList = reactive([])
const pageResponse = reactive({
  content: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 12,
})

// 페이지 이동 시 실행
const loadPage = (newPage) => {
  const keyword = route.query.keyword || ''
  getRecipeList(newPage, keyword)
}

// 레시피 목록 가져오기
const getRecipeList = async (page = 0, keyword = '') => {
  let data = {}

  if (keyword) {
    data = await api.searchRecipe(keyword, page, pageResponse.size, 'DESC')
  } else {
    data = await api.recipeList(page, pageResponse.size)
  }

  if (data && data.success && data.results) {
    recipeList.splice(0, recipeList.length, ...data.results.content)
    pageResponse.content = data.results.content
    pageResponse.currentPage = data.results.currentPage
    pageResponse.totalPages = data.results.totalPages
    pageResponse.totalElements = data.results.totalElements
    pageResponse.size = data.results.size
  } else {
    recipeList.splice(0)
    pageResponse.content = []
    pageResponse.totalPages = 0
    pageResponse.totalElements = 0
  }
}

// URL query가 바뀔 때마다 자동으로 반영
watch(
  () => route.query.keyword,
  (newKeyword) => {
    getRecipeList(0, newKeyword || '')
  }
)

// 초기 마운트 시 실행
onMounted(() => {
  const keyword = route.query.keyword || ''
  getRecipeList(0, keyword)
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
    <!-- 키워드가 있을 때만 h2 보여주기 -->
    <h2 v-if="route.query.keyword"><span>'{{ route.query.keyword }}'</span>에 대한 검색 결과</h2>
    <p class="result-count">전체 {{pageResponse.totalElements.toLocaleString()}}개</p>
  </div>

    <!-- 레시피 그리드 -->
    <div class="content-grid">
      <RecipeCard v-for="(recipe, index) in recipeList" :key="index" :recipe="recipe" />
    </div>
  </div>

  <Pagination
    :currentPage="pageResponse.currentPage"
    :totalPages="pageResponse.totalPages"
    @changePage="loadPage"
  />
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

.content-header > h2 {
  margin-bottom: 15px;
  font-weight: 400;
}

.content-header span {
  font-weight: 600;
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
