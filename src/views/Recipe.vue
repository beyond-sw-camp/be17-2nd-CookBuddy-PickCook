<script setup>
import api from '@/api/recipe'
import { onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecipeCard from '@/components/RecipeCard.vue'
import Pagination from '@/components/Pagination.vue'
import { cleanQuery } from '../../utils/queryHelper'

const route = useRoute()
const router = useRouter()

// 레시피 목록
const recipeList = reactive([])

// 페이지 응답 데이터
const pageResponse = reactive({
  content: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 12,
})

// 필터 옵션
const filterOptions = reactive({
  sortOptions: [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'likes', label: '좋아요순' },
    { value: 'scraps', label: '스크랩순' },
  ],
  difficultyOptions: [
    { value: '', label: '전체' },
    { value: '쉬움', label: '쉬움' },
    { value: '보통', label: '보통' },
    { value: '어려움', label: '어려움' },
  ],
  categoryOptions: [
    { value: '', label: '전체' },
    { value: '반찬', label: '반찬' },
    { value: '국&찌개', label: '국&찌개' },
    { value: '일품', label: '일품' },
    { value: '밥', label: '밥' },
    { value: '후식', label: '후식' },
    { value: '기타', label: '기타' },
  ],
  cookingMethodOptions: [
    { value: '', label: '전체' },
    { value: '끓이기', label: '끓이기' },
    { value: '굽기', label: '굽기' },
    { value: '볶기', label: '볶기' },
    { value: '찌기', label: '찌기' },
    { value: '튀기기', label: '튀기기' },
    { value: '기타', label: '기타' },
  ],
})

// 필터 상태
const filterState = reactive({
  sortType: 'latest',
  difficulty: '',
  category: '',
  cookingMethod: '',
})

// UI 상태 (드롭다운 열림 여부)
const uiState = reactive({
  dropdownOpen: {
    sort: false,
    difficulty: false,
    category: false,
    cookingMethod: false,
  },
})

// 필터 관련 액션
const filterActions = {
  toggleDropdown(type) {
    uiState.dropdownOpen[type] = !uiState.dropdownOpen[type]
  },
  getFilterLabel(type) {
    switch (type) {
      case 'sortType':
        return (
          filterOptions.sortOptions.find((o) => o.value === filterState.sortType)?.label || '정렬'
        )
      case 'difficulty':
        return (
          filterOptions.difficultyOptions.find((o) => o.value === filterState.difficulty)?.label ||
          '난이도'
        )
      case 'category':
        return (
          filterOptions.categoryOptions.find((o) => o.value === filterState.category)?.label ||
          '카테고리'
        )
      case 'cookingMethod':
        return (
          filterOptions.cookingMethodOptions.find((o) => o.value === filterState.cookingMethod)
            ?.label || '조리방법'
        )
      default:
        return ''
    }
  },
  selectFilter(type, value) {
    filterState[type] = value
    uiState.dropdownOpen[type] = false
    applyFilters() // 선택 후 바로 목록 갱신
  },
}

// 레시피 조회
const getRecipeList = async (page = 0) => {
  const params = cleanQuery({
    page,
    size: pageResponse.size,
    keyword: route.query.keyword || '',
    sortType: filterState.sortType,
    difficulty: filterState.difficulty,
    category: filterState.category,
    cookingMethod: filterState.cookingMethod,
  })

  const data = await api.recipeList(params)

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

// 페이지 이동
const loadPage = (newPage) => {
  const query = cleanQuery({
    ...route.query,
    page: newPage,
    keyword: route.query.keyword || '',
    sortType: filterState.sortType,
    difficulty: filterState.difficulty,
    category: filterState.category,
    cookingMethod: filterState.cookingMethod,
  })
  router.replace({ query })
  getRecipeList(newPage)
}

// 필터 적용
const applyFilters = () => {
  const query = cleanQuery({
    ...route.query,
    page: 0, // 필터 바꾸면 첫 페이지로 이동
    keyword: route.query.keyword || '',
    sortType: filterState.sortType,
    difficulty: filterState.difficulty,
    category: filterState.category,
    cookingMethod: filterState.cookingMethod,
  })
  router.replace({ query })
  getRecipeList(0)
}

// 초기 로딩
onMounted(() => {
  const page = parseInt(route.query.page || '0')
  filterState.sortType = route.query.sortType || 'latest'
  filterState.difficulty = route.query.difficulty || ''
  filterState.category = route.query.category || ''
  filterState.cookingMethod = route.query.cookingMethod || ''
  getRecipeList(page)
})

// 키워드 변경 감지
watch(
  () => route.query.keyword,
  () => {
    const page = parseInt(route.query.page || '0')
    getRecipeList(page)
  },
)
</script>

<template>
  <!-- 필터 섹션 -->

  <div class="filter-container">
    <!-- 정렬 드롭다운 -->
    <div class="filter-dropdown">
      <span
        class="filter-tag"
        :class="{ active: filterState.sortType !== 'latest' }"
        @click="filterActions.toggleDropdown('sort')"
      >
        {{ filterActions.getFilterLabel('sortType') }} &nbsp;▼
      </span>
      <div v-show="uiState.dropdownOpen.sort" class="dropdown-menu">
        <div
          v-for="option in filterOptions.sortOptions"
          :key="option.value"
          @click="filterActions.selectFilter('sortType', option.value)"
          class="dropdown-item"
          :class="{ active: filterState.sortType === option.value }"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 난이도 드롭다운 -->
    <div class="filter-dropdown">
      <span
        class="filter-tag"
        :class="{ active: filterState.difficulty !== '' }"
        @click="filterActions.toggleDropdown('difficulty')"
      >
        {{ filterActions.getFilterLabel('difficulty') }} &nbsp;▼
      </span>
      <div v-show="uiState.dropdownOpen.difficulty" class="dropdown-menu">
        <div
          v-for="option in filterOptions.difficultyOptions"
          :key="option.value"
          @click="filterActions.selectFilter('difficulty', option.value)"
          class="dropdown-item"
          :class="{ active: filterState.difficulty === option.value }"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 카테고리 드롭다운 -->
    <div class="filter-dropdown">
      <span
        class="filter-tag"
        :class="{ active: filterState.category !== '' }"
        @click="filterActions.toggleDropdown('category')"
      >
        {{ filterActions.getFilterLabel('category') }} &nbsp;▼
      </span>
      <div v-show="uiState.dropdownOpen.category" class="dropdown-menu">
        <div
          v-for="option in filterOptions.categoryOptions"
          :key="option.value"
          @click="filterActions.selectFilter('category', option.value)"
          class="dropdown-item"
          :class="{ active: filterState.category === option.value }"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <!-- 조리방법 드롭다운 -->
    <div class="filter-dropdown">
      <span
        class="filter-tag"
        :class="{ active: filterState.cookingMethod !== '' }"
        @click="filterActions.toggleDropdown('cookingMethod')"
      >
        {{ filterActions.getFilterLabel('cookingMethod') }} &nbsp;▼
      </span>
      <div v-show="uiState.dropdownOpen.cookingMethod" class="dropdown-menu">
        <div
          v-for="option in filterOptions.cookingMethodOptions"
          :key="option.value"
          @click="filterActions.selectFilter('cookingMethod', option.value)"
          class="dropdown-item"
          :class="{ active: filterState.cookingMethod === option.value }"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>

  <!-- 컨텐츠 섹션 -->
  <div class="content-section">
    <div class="content-header">
      <!-- 키워드가 있을 때만 h2 보여주기 -->
      <h2 v-if="route.query.keyword">
        <span>'{{ route.query.keyword }}'</span>에 대한 검색 결과
      </h2>
      <p class="result-count">검색결과 {{ pageResponse.totalElements.toLocaleString() }}개</p>
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
  margin-top: 10px;
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
  font-size: 21px;
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

/* 기존 스타일 아래에 추가 */

/* 드롭다운 관련 스타일 */
.filter-dropdown {
  position: relative;
  display: inline-block;
}

.filter-tag.active {
  background-color: #4285f4;
  color: white;
  border-color: #4285f4;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 120px;
  background-color: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  border-bottom: 1px solid #f1f3f4;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}
</style>
