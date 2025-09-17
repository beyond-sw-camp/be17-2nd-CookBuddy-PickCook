<script setup>
import api from '@/api/recipe'
import { onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecipeCard from '@/components/RecipeCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()

const recipeList = reactive([])

// 필터 옵션 정의
const filterOptions = reactive({
  sortOptions: [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
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

// 필터 상태 관리
const filterState = reactive({
  sortType: 'latest',
  difficulty: '',
  category: '',
  cookingMethod: '',
})

// 페이지 응답 데이터 관리
const pageResponse = reactive({
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  size: 20,
})

// 필터 적용 여부 확인 함수
const isFilterApplied = reactive({
  get hasFilter() {
    return (
      filterState.sortType !== 'latest' ||
      filterState.difficulty !== '' ||
      filterState.category !== '' ||
      filterState.cookingMethod !== ''
    )
  },
})

// UI 상태 관리
const uiState = reactive({
  dropdownOpen: {
    sort: false,
    difficulty: false,
    category: false,
    cookingMethod: false,
  },
})

// 페이지 이동 시 실행
const loadPage = (newPage) => {
  const keyword = route.query.keyword || ''
  router.replace({ query: { ...route.query, page: newPage } })
  getRecipeList(newPage, keyword)
}

// 레시피 목록 가져오기
const getRecipeList = async () => {
  const params = reactive({
    page: 0,
    size: 20,
    sortType: filterState.sortType,
  })

  if (filterState.difficulty) params.difficulty = filterState.difficulty
  if (filterState.category) params.category = filterState.category
  if (filterState.cookingMethod) params.cookingMethod = filterState.cookingMethod

  const queryString = new URLSearchParams(params).toString()

  try {
    const data = await api.recipeListWithFilter(queryString)

    if (data && data.success) {
      if (data.results && Array.isArray(data.results.content)) {
        // 레시피 목록 업데이트
        recipeList.splice(0)
        recipeList.push(...data.results.content)

        // 페이지 정보 업데이트
        pageResponse.totalElements = data.results.totalElements || 0
        pageResponse.totalPages = data.results.totalPages || 0
        pageResponse.currentPage = data.results.currentPage || 0
        pageResponse.size = data.results.size || 20
      } else {
        console.error('예상하지 못한 응답 구조:', data)
        recipeList.splice(0)
        pageResponse.totalElements = 0
      }
    } else {
      console.error('API 호출 실패:', data)
      recipeList.splice(0)
      pageResponse.totalElements = 0
    }
  } catch (error) {
    console.error('API 호출 중 오류:', error)
    recipeList.splice(0)
    pageResponse.totalElements = 0
  }
}

// 필터 관련 함수들
const filterActions = reactive({
  toggleDropdown: (filterType) => {
    // 다른 드롭다운은 모두 닫기
    Object.keys(uiState.dropdownOpen).forEach((key) => {
      uiState.dropdownOpen[key] = key === filterType ? !uiState.dropdownOpen[key] : false
    })
  },

  selectFilter: (filterType, value) => {
    filterState[filterType] = value

    // 드롭다운 닫기 - 키 매핑 수정
    const dropdownKey = filterType === 'sortType' ? 'sort' : filterType
    uiState.dropdownOpen[dropdownKey] = false
  },

  getFilterLabel: (filterType) => {
    switch (filterType) {
      case 'sortType':
        return (
          filterOptions.sortOptions.find((opt) => opt.value === filterState.sortType)?.label ||
          '정렬'
        )
      case 'difficulty':
        return filterState.difficulty
          ? filterOptions.difficultyOptions.find((opt) => opt.value === filterState.difficulty)
              ?.label
          : '난이도'
      case 'category':
        return filterState.category
          ? filterOptions.categoryOptions.find((opt) => opt.value === filterState.category)?.label
          : '종류'
      case 'cookingMethod':
        return filterState.cookingMethod
          ? filterOptions.cookingMethodOptions.find(
              (opt) => opt.value === filterState.cookingMethod,
            )?.label
          : '조리방법'
      default:
        return '필터'
    }
  },
})

// 필터 변경 감지
watch(
  filterState,
  () => {
    getRecipeList()
  },
  { deep: true },
)

onMounted(() => {
  getRecipeList()
})

watch(
  () => route.query.keyword,
  (newKeyword) => {
    const page = parseInt(route.query.page || '0')
    getRecipeList(page, newKeyword || '')
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
      <p v-show="isFilterApplied.hasFilter" class="result-count">
        검색결과 {{ pageResponse.totalElements.toLocaleString() }}개
      </p>
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
