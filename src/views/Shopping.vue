<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import api from '@/api/shopping'
import ProductItemCard from '@/components/ProductItemCard.vue'
import Pagination from '@/components/Pagination.vue'

const products = reactive([])
const originalProducts = ref([])
const selectedCategoryId = ref(null)
const isFiltering = ref(false)

const pageResponse = reactive({
  content: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 10,
})

const filterState = reactive({
  openDropdown: null,
  currentSort: { field: 'id', direction: 'ASC', label: '기본 정렬' }, // 기본 정렬로 변경
})

const loadPage = (newPage) => {
  if (selectedCategoryId.value) {
    // 카테고리가 선택된 상태에서 페이지 이동
    loadCategoryPage(newPage, selectedCategoryId.value)
  } else {
    // 전체 상품에서 페이지 이동 (현재 정렬 유지)
    getProductListWithSort(newPage)
  }
}

// 정렬이 적용된 전체 상품 페이지 로드
const getProductListWithSort = async (page = 0) => {
  const data = await api.getAllProducts(
    page,
    pageResponse.size,
    filterState.currentSort.field,
    filterState.currentSort.direction,
  )

  if (data && data.content) {
    Object.assign(products, data.content)
    Object.assign(pageResponse, {
      content: data.content,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      size: data.size,
    })
  }
}

// 새로 추가할 함수
const loadCategoryPage = async (page, categoryId) => {
  try {
    const data = await api.getProductsByCategory(
      categoryId,
      page,
      pageResponse.size,
      filterState.currentSort.field,
      filterState.currentSort.direction,
    )

    products.splice(0)
    const productList = data.content || data
    Object.assign(products, productList)

    Object.assign(pageResponse, {
      content: data.content || data,
      currentPage: page,
      totalPages: data.totalPages || 1,
      totalElements: data.totalElements || productList.length,
      size: data.size || 10,
    })
  } catch (error) {
    console.error('카테고리 페이지 로드 실패:', error)
  }
}

const getProductList = async (page = 0) => {
  // 기본 정렬이지만 실제로는 신제품순으로 로드
  const data = await api.getAllProducts(page, pageResponse.size, 'createdAt', 'DESC')
  if (data && data.content) {
    Object.assign(products, data.content)
    originalProducts.value = data.content
    Object.assign(pageResponse, {
      content: data.content,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      size: data.size,
    })
  } else {
    products.splice(0)
    Object.assign(pageResponse, {
      content: [],
      totalPages: 0,
      totalElements: 0,
    })
  }
}

const filterByCategory = async (categoryId) => {
  isFiltering.value = true
  selectedCategoryId.value = categoryId

  try {
    const data = await api.getProductsByCategory(categoryId)
    products.splice(0)

    const productList = data.content || data
    Object.assign(products, productList)

    // 페이지네이션 완전 초기화
    pageResponse.content = data.content || data
    pageResponse.currentPage = 0 // 첫 페이지로 강제 리셋
    pageResponse.totalPages = data.totalPages || 1
    pageResponse.totalElements = data.totalElements || productList.length
    pageResponse.size = data.size || 10
  } catch (error) {
    console.error('카테고리 필터링 실패:', error)
  } finally {
    isFiltering.value = false
  }
}

const showAllProducts = async () => {
  selectedCategoryId.value = null
  await getProductList(0) // 첫 페이지부터 시작
}

const filterOptions = reactive({
  sales: {
    label: '판매량',
    options: [
      { field: 'review_count', direction: 'DESC', label: '판매량 높은순' },
      { field: 'review_count', direction: 'ASC', label: '판매량 낮은순' },
      { field: 'id', direction: 'ASC', label: '기본 정렬' },
    ],
  },
  rating: {
    label: '상품평',
    options: [
      { field: 'title', direction: 'ASC', label: '평점 높은순' }, // 다른 필드 사용
      { field: 'title', direction: 'DESC', label: '평점 낮은순' },
      { field: 'id', direction: 'ASC', label: '기본 정렬' },
    ],
  },
  newest: {
    label: '등록일',
    options: [
      { field: 'createdAt', direction: 'DESC', label: '최신 등록순' },
      { field: 'createdAt', direction: 'ASC', label: '오래된 순' },
      { field: 'id', direction: 'ASC', label: '기본 정렬' },
    ],
  },
  price: {
    label: '가격',
    options: [
      { field: 'original_price', direction: 'DESC', label: '가격 높은순' }, // original_price 사용
      { field: 'original_price', direction: 'ASC', label: '가격 낮은순' },
      { field: 'id', direction: 'ASC', label: '기본 정렬' },
    ],
  },
})

// 드롭다운 토글
const toggleDropdown = (filterKey) => {
  filterState.openDropdown = filterState.openDropdown === filterKey ? null : filterKey
}

// 정렬 옵션 선택
const selectSortOption = async (option) => {
  // 깊은 복사로 객체 참조 분리
  Object.assign(filterState.currentSort, {
    field: option.field,
    direction: option.direction,
    label: option.label,
  })

  filterState.openDropdown = null

  if (selectedCategoryId.value) {
    await applySortToCategory(selectedCategoryId.value)
  } else {
    await applySortToAllProducts()
  }
}

// 전체 상품에 정렬 적용
const applySortToAllProducts = async () => {
  const data = await api.getAllProducts(
    0,
    pageResponse.size,
    filterState.currentSort.field,
    filterState.currentSort.direction,
  )
  updateProductsAndPagination(data)
}

// 카테고리 상품에 정렬 적용
const applySortToCategory = async (categoryId) => {
  const data = await api.getProductsByCategory(
    categoryId,
    0,
    pageResponse.size,
    filterState.currentSort.field,
    filterState.currentSort.direction,
  )
  updateProductsAndPagination(data)
}

// 상품 목록과 페이지네이션 업데이트
const updateProductsAndPagination = (data) => {
  products.splice(0)
  const productList = data.content || data
  Object.assign(products, productList)

  Object.assign(pageResponse, {
    content: data.content || data,
    currentPage: 0,
    totalPages: data.totalPages || 1,
    totalElements: data.totalElements || productList.length,
    size: data.size || 10,
  })
}

// 외부 클릭 시 드롭다운 닫기
const closeAllDropdowns = () => {
  filterState.openDropdown = null
}

const isCurrentFilter = (filterKey) => {
  // "기본 정렬"일 때는 어떤 필터도 활성화하지 않음
  if (filterState.currentSort.label === '기본 정렬') {
    return false
  }

  const currentField = filterState.currentSort.field
  const currentDirection = filterState.currentSort.direction
  const currentLabel = filterState.currentSort.label
  const options = filterOptions[filterKey].options

  return options.some(
    (option) =>
      option.field === currentField &&
      option.direction === currentDirection &&
      option.label === currentLabel &&
      option.label !== '기본 정렬',
  )
}

// 현재 필터 라벨 반환
const getCurrentFilterLabel = (filterKey) => {
  // 현재 선택된 정렬이 해당 필터 옵션과 정확히 일치하는지 확인
  const currentField = filterState.currentSort.field
  const currentDirection = filterState.currentSort.direction
  const currentLabel = filterState.currentSort.label
  const options = filterOptions[filterKey].options

  const matchedOption = options.find(
    (option) =>
      option.field === currentField &&
      option.direction === currentDirection &&
      option.label === currentLabel, // 라벨까지 정확히 일치해야 함
  )

  if (matchedOption && matchedOption.label !== '기본 정렬') {
    return matchedOption.label
  }

  return filterOptions[filterKey].label
}

onMounted(() => {
  getProductList()

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', closeAllDropdowns)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('click', closeAllDropdowns)
})
</script>

<template>
  <div class="content-section">
    <div class="shopping-category-section">
      <div class="shopping-category-grid">
        <!-- 전체 상품 보기 - 첫 번째 위치에 고정 -->
        <span
          class="shopping-category c-hover-2"
          :class="{ 'category-active': selectedCategoryId === null }"
          @click="showAllProducts"
        >
          <div class="all-category-icon">All</div>
          <span class="padding">전체</span>
        </span>

        <span
          class="shopping-category c-hover-2"
          :class="{ 'category-active': selectedCategoryId === 1 }"
          @click="filterByCategory(1)"
        >
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-vegetable.png"
            alt=""
          />
          <span class="padding">채소</span>
        </span>

        <span
          class="shopping-category c-hover-2"
          :class="{ 'category-active': selectedCategoryId === 2 }"
          @click="filterByCategory(2)"
        >
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-meat.png"
            alt=""
          />
          <span class="padding">정육·가공육·달걀</span>
        </span>

        <span
          class="shopping-category c-hover-2"
          :class="{ 'category-active': selectedCategoryId === 3 }"
          @click="filterByCategory(3)"
        >
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-fish.png"
            alt=""
          />
          <span class="padding">수산·해산·건어물</span>
        </span>

        <span
          class="shopping-category c-hover-2"
          :class="{ 'category-active': selectedCategoryId === 7 }"
          @click="filterByCategory(7)"
        >
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-dessert.png"
            alt=""
          />
          <span class="padding">베이커리</span>
        </span>
      </div>
    </div>

    <!-- 기존 필터 섹션 그대로 -->
    <div class="shopping-filter-section" @click.stop>
      <div class="filter-container">
        <!-- 신제품 필터 -->
        <div class="filter-dropdown">
          <span
            class="filter-tag"
            :class="{ active: filterState.openDropdown === 'newest' || isCurrentFilter('newest') }"
            @click="toggleDropdown('newest')"
          >
            {{ getCurrentFilterLabel('newest') }} &nbsp;{{
              filterState.openDropdown === 'newest' ? '▲' : '▼'
            }}
          </span>
          <div v-if="filterState.openDropdown === 'newest'" class="dropdown-menu">
            <div
              v-for="option in filterOptions.newest.options"
              :key="option.label"
              class="dropdown-item"
              :class="{ selected: filterState.currentSort.label === option.label }"
              @click="selectSortOption(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <!-- 판매량 필터 -->
        <div class="filter-dropdown">
          <span
            class="filter-tag"
            :class="{ active: filterState.openDropdown === 'sales' || isCurrentFilter('sales') }"
            @click="toggleDropdown('sales')"
          >
            {{ getCurrentFilterLabel('sales') }} &nbsp;{{
              filterState.openDropdown === 'sales' ? '▲' : '▼'
            }}
          </span>
          <div v-if="filterState.openDropdown === 'sales'" class="dropdown-menu">
            <div
              v-for="option in filterOptions.sales.options"
              :key="option.label"
              class="dropdown-item"
              :class="{ selected: filterState.currentSort.label === option.label }"
              @click="selectSortOption(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <!-- 상품평 필터 -->
        <div class="filter-dropdown">
          <span
            class="filter-tag"
            :class="{ active: filterState.openDropdown === 'rating' || isCurrentFilter('rating') }"
            @click="toggleDropdown('rating')"
          >
            {{ getCurrentFilterLabel('rating') }} &nbsp;{{
              filterState.openDropdown === 'rating' ? '▲' : '▼'
            }}
          </span>
          <div v-if="filterState.openDropdown === 'rating'" class="dropdown-menu">
            <div
              v-for="option in filterOptions.rating.options"
              :key="option.label"
              class="dropdown-item"
              :class="{ selected: filterState.currentSort.label === option.label }"
              @click="selectSortOption(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <!-- 가격 필터 -->
        <div class="filter-dropdown">
          <span
            class="filter-tag"
            :class="{ active: filterState.openDropdown === 'price' || isCurrentFilter('price') }"
            @click="toggleDropdown('price')"
          >
            {{ getCurrentFilterLabel('price') }} &nbsp;{{
              filterState.openDropdown === 'price' ? '▲' : '▼'
            }}
          </span>
          <div v-if="filterState.openDropdown === 'price'" class="dropdown-menu">
            <div
              v-for="option in filterOptions.price.options"
              :key="option.label"
              class="dropdown-item"
              :class="{ selected: filterState.currentSort.label === option.label }"
              @click="selectSortOption(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 및 상품 목록 -->
    <div v-if="isFiltering" style="text-align: center; padding: 20px; color: #929596">
      <p>상품을 불러오는 중...</p>
    </div>

    <div class="content-grid">
      <ProductItemCard v-for="(product, index) in products" :key="index" :product="product" />
    </div>
  </div>
  <Pagination
    :currentPage="pageResponse.currentPage"
    :totalPages="pageResponse.totalPages"
    @changePage="loadPage"
  />
</template>

<style scoped>
.shopping-filter-section {
  padding-bottom: 10px;
}

.shopping-category-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 20px 0px 20px 0px;
  border: 2px solid #eaedef;
  border-radius: 10px;
  padding: 15px 0px 15px 0px;
  background-color: white;
}

.shopping-category-grid {
  display: grid;
  grid-template-columns: repeat(5, 115px);
  row-gap: 10px;
  column-gap: 100px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
}

.all-category-icon {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-color: #f8f9fa;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #495057;
}

.shopping-category-grid > span {
  cursor: pointer;
}

.shopping-category {
  font-weight: 450;
  color: #929596;
  /* padding: 5px; */
  text-align: center;
  display: flex;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

/* 활성 카테고리 스타일 - 기존 c-hover-2 색상 사용 */
.category-active {
  font-weight: 600 !important;
}

.c-hover-2:hover {
  font-weight: 500;
  color: #2e80cd;
}

/* 활성 상태일 때 hover 효과 무시 */
/* .category-active:hover {
  color: white !important;
  transform: translateY(-1.5px);
} */

.shopping-ingredient-item-image {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.padding {
  padding-top: 10px;
}

/* 기존 filter-tag 스타일 재사용 */
.filter-container {
  display: flex;
  margin-bottom: 10px;
  gap: 10px;
}

.filter-tag {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
}

.filter-tag:hover {
  background-color: #e9ecef;
}

/* 기존 스타일은 그대로 유지하고 아래 추가 */

.filter-dropdown {
  position: relative;
  display: inline-block;
}

.filter-tag.active {
  background-color: #2e80cd;
  color: white;
  border-color: #2e80cd;
  font-weight: 500;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 150px;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 2px;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  border-bottom: 1px solid #f8f9fa;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.selected {
  background-color: #e3f2fd;
  color: #2e80cd;
  font-weight: 500;
}

.current-filter {
  text-align: center;
  padding: 10px;
  background-color: #e3f2fd;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #2e80cd;
}
</style>
