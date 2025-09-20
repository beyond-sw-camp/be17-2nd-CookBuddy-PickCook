<script setup>
import refrigeratorApi from '@/api/refrigerator'
import { ref, computed, onMounted, reactive, onUnmounted } from 'vue'
import IngredientCard from '@/components/IngredientCard.vue'
import AddIngredientModal from '@/components/AddIngredientModal.vue'
import EditIngredientModal from '@/components/EditIngredientModal.vue'

// =================================================================
// 반응형 상태 관리
// =================================================================

const selectedIngredientIndex = ref(null)
const selectedIngredient = ref(null)
const showSnackbar = ref(false)
const lastDeletedItem = ref(null)
const undoTimer = ref(null)

const searchQuery = ref('')
const searchedKeyword = ref('')

const showAddModal = ref(false)
const showEditModal = ref(false)

const items = ref([])
const loading = ref(false)
const categories = ref([])

const showSyncModal = ref(false)
const syncPromptData = ref(null)

const filters = reactive({
  keyword: null,
  categoryId: null,
  expirationStatus: null,
  sortType: 'EXPIRATION_DATE',
  sortDirection: 'ASC',
})

// 드롭다운 상태 (열림/닫힘)
const dropdownStates = reactive({
  sort: false,
  category: false,
  expiration: false,
})

// =================================================================
// 필터 옵션 정의
// =================================================================

const sortOptions = [
  { label: '유통기한 빠른순', sortType: 'EXPIRATION_DATE', sortDirection: 'ASC' },
  { label: '유통기한 늦은순', sortType: 'EXPIRATION_DATE', sortDirection: 'DESC' },
  { label: '등록일 최신순', sortType: 'CREATED_DATE', sortDirection: 'DESC' },
  { label: '등록일 오래된순', sortType: 'CREATED_DATE', sortDirection: 'ASC' },
]

const categoryOptions = computed(() => [
  { label: '카테고리', id: null },
  ...categories.value.map((cat) => ({ label: cat.name, id: cat.id })),
])

const expirationOptions = [
  { label: '유통기한', status: null },
  { label: '신선함', status: 'FRESH' },
  { label: '임박(2-3일)', status: 'EXPIRING_SOON' },
  { label: '긴급(1일이내)', status: 'URGENT' },
  { label: '만료됨', status: 'EXPIRED' },
]

// =================================================================
// 카테고리별 이미지 매핑
// =================================================================

const categoryImageMap = {
  채소: 'ic-ingredient-category-vegetable',
  '정육·가공육·달걀': 'ic-ingredient-category-meat',
  '수산·해산·건어물': 'ic-ingredient-category-fish',
  '과일·견과·쌀': 'ic-ingredient-category-fruit',
  간편식: 'ic-ingredient-category-conveniencefood',
  냉동식품: 'ic-ingredient-category-ice',
  베이커리: 'ic-ingredient-category-dessert',
  유제품: 'ic-ingredient-category-milk',
  '면·양념·오일': 'ic-ingredient-category-etc',
  기타: 'ic-ingredient-category-etc',

  // 기존 호환성 유지
  육류: 'ic-ingredient-category-meat',
  해산물: 'ic-ingredient-category-fish',
  과일: 'ic-ingredient-category-fruit',
  디저트: 'ic-ingredient-category-dessert',
}

// =================================================================
// 데이터 변환 함수들
// =================================================================

/**
 * 백엔드 응답을 프론트엔드 형식으로 변환
 */
const transformBackendData = (backendItem) => {
  console.log('백엔드 데이터:', backendItem) // ✅ 임시 추가
  console.log('expirationStatus:', backendItem.expirationStatus) // ✅ 임시 추가

  const imageFileName = categoryImageMap[backendItem.category?.name] || 'ic-ingredient-category-etc'

  return {
    id: backendItem.id,
    name: backendItem.ingredientName,
    qnt: backendItem.quantity, // 단위는 임시로 "개" 사용
    rawDate: backendItem.expirationDate,
    exDate: getDaysLeft(backendItem.expirationDate),
    category: backendItem.category?.name || '기타',
    imageUrl: `/assets/icons/${imageFileName}.png`,
    location: backendItem.location,
    expirationStatus: backendItem.expirationStatus,

    // 원본 데이터 보존 (수정 시 필요)
    originalData: backendItem,
  }
}

/**
 * 남은 유통기한 계산
 */
const getDaysLeft = (dateStr) => {
  if (!dateStr) return '유통기한 미설정'

  const today = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))

  if (diff > 0) return `${diff}일 남음`
  else if (diff === 0) return `오늘까지`
  else return `${Math.abs(diff)}일 지남`
}

// =================================================================
// API 함수들
// =================================================================

/**
 * 냉장고 아이템 목록 불러오기
 */
const getIngredients = async () => {
  try {
    loading.value = true
    const backendItems = await refrigeratorApi.getIngredients()

    // 백엔드 데이터를 프론트엔드 형식으로 변환
    items.value = backendItems.map(transformBackendData)
  } catch (error) {
    console.error('냉장고 아이템 조회 실패:', error)
    alert('냉장고 데이터를 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

/**
 * 카테고리 목록 불러오기
 */
const loadCategories = async () => {
  try {
    categories.value = await refrigeratorApi.getCategories()
  } catch (error) {
    console.error('카테고리 조회 실패:', error)
  }
}

// =================================================================
// 검색 기능
// =================================================================

/**
 * 검색 결과 업데이트
 */
const updateSearch = () => {
  searchedKeyword.value = searchQuery.value.trim()
}

/**
 * 검색 입력값 초기화
 */
const clearSearch = () => {
  searchQuery.value = ''
  searchedKeyword.value = ''
}

/**
 * 키보드 입력 -> 검색 결과 업데이트
 */
const onInput = (event) => {
  searchQuery.value = event.target.value
  updateSearch()
}

// =================================================================
// 계산된 속성들 (필터 관련)
// =================================================================

const selectedLabels = computed(() => ({
  sort:
    sortOptions.find(
      (opt) => opt.sortType === filters.sortType && opt.sortDirection === filters.sortDirection,
    )?.label || '정렬',

  category: categoryOptions.value.find((opt) => opt.id === filters.categoryId)?.label || '카테고리',

  expiration:
    expirationOptions.find((opt) => opt.status === filters.expirationStatus)?.label || '유통기한',
}))

// =================================================================
// 한글 초성 검색 (기존 코드 유지)
// =================================================================

const CHOSEONG = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
]

const decomposeString = (str) => {
  const result = []
  for (const char of str) {
    const code = char.charCodeAt(0)
    if (code >= 0xac00 && code <= 0xd7a3) {
      const index = code - 0xac00
      const choseong = Math.floor(index / 588)
      const jungseong = Math.floor((index % 588) / 28)
      const jongseong = index % 28
      result.push(CHOSEONG[choseong])
      if (jungseong !== 0) result.push(String.fromCharCode(0x314f + jungseong))
      if (jongseong !== 0) result.push(String.fromCharCode(0x3130 + jongseong - 1))
    } else {
      result.push(char)
    }
  }
  return result
}

const isPartialMatch = (keyArr, textArr) => {
  let keyIndex = 0
  for (const textChar of textArr) {
    if (keyIndex < keyArr.length && textChar === keyArr[keyIndex]) {
      keyIndex++
    }
  }
  return keyIndex === keyArr.length
}

const moveFinalConsonantForward = (keyword) => {
  if (keyword.length === 0) return null
  const lastChar = keyword[keyword.length - 1]
  const code = lastChar.charCodeAt(0)
  if (code >= 0xac00 && code <= 0xd7a3) {
    const index = code - 0xac00
    const jongseong = index % 28
    if (jongseong > 0) {
      const withoutFinal = String.fromCharCode(code - jongseong)
      const consonant = String.fromCharCode(0x3130 + jongseong - 1)
      return keyword.slice(0, -1) + withoutFinal + consonant
    }
  }
  return null
}

const hangulMatch = (text, keyword) => {
  const textArr = decomposeString(text)
  const keyArr = decomposeString(keyword)
  if (isPartialMatch(keyArr, textArr)) return true

  const movedKeyword = moveFinalConsonantForward(keyword)
  if (movedKeyword) {
    const movedKeyArr = decomposeString(movedKeyword)
    return isPartialMatch(movedKeyArr, textArr)
  }
  return false
}

/**
 * 검색 결과 필터링
 */
const filteredItems = computed(() => {
  const keyword = searchedKeyword.value.trim().toLowerCase()
  if (!keyword) return items.value
  return items.value.filter((item) => hangulMatch(item.name.toLowerCase(), keyword))
})

// =================================================================
// 필터링 관련 함수들
// =================================================================

/**
 * 외부 클릭 시 드롭다운 닫기 (먼저 정의)
 */
const closeAllDropdowns = () => {
  Object.keys(dropdownStates).forEach((key) => {
    dropdownStates[key] = false
  })
}

/**
 * 드롭다운 토글
 */
const toggleDropdown = (type) => {
  Object.keys(dropdownStates).forEach((key) => {
    dropdownStates[key] = key === type ? !dropdownStates[type] : false
  })
}

/**
 * 정렬 옵션 선택
 */
const selectSortOption = (option) => {
  filters.sortType = option.sortType
  filters.sortDirection = option.sortDirection
  dropdownStates.sort = false
  applyFilters()
}

/**
 * 카테고리 선택
 */
const selectCategory = (option) => {
  filters.categoryId = option.id
  dropdownStates.category = false
  applyFilters()
}

/**
 * 유통기한 상태 선택
 */
const selectExpirationStatus = (option) => {
  filters.expirationStatus = option.status
  dropdownStates.expiration = false
  applyFilters()
}

/**
 * 필터 적용 (API 호출)
 */
const applyFilters = async () => {
  loading.value = true

  try {
    const result = await refrigeratorApi.filterIngredients(filters)
    items.value = result.map(transformBackendData)
  } catch (error) {
    console.error('필터링 실패:', error)
    alert('필터링 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// =================================================================
// CRUD 작업
// =================================================================

/**
 * 재료 추가 처리
 */
const handleAddIngredient = async (newItem) => {
  try {
    // 모달에서 이미 API 호출이 완료되었으므로, 목록 새로고침
    await getIngredients()
  } catch (error) {
    console.error('목록 새로고침 실패:', error)
  }
}

/**
 * 재료 편집 모달 열기
 */
const openEditModal = (index) => {
  const item = filteredItems.value[index]
  if (!item) return

  // 원본 데이터에서 실제 인덱스 찾기
  const originalIndex = items.value.findIndex((original) => original.id === item.id)
  selectedIngredientIndex.value = originalIndex
  selectedIngredient.value = item.originalData || item
  showEditModal.value = true
}

/**
 * 재료 편집 모달 닫기
 */
const closeEditModal = () => {
  showEditModal.value = false
  selectedIngredientIndex.value = null
  selectedIngredient.value = null
}

/**
 * 재료 편집 완료 처리
 */
const submitEdit = async () => {
  try {
    // 모달에서 이미 API 호출이 완료되었으므로, 목록 새로고침
    await getIngredients()
    closeEditModal()
  } catch (error) {
    console.error('목록 새로고침 실패:', error)
  }
}

/**
 * 재료 삭제 처리
 */
const deleteIngredient = async (itemId) => {
  try {
    // 서버 삭제 요청
    await refrigeratorApi.deleteIngredient(itemId)

    // UI 반응성 업데이트
    const deletedItem = items.value.find((item) => item.id === itemId)
    if (deletedItem) lastDeletedItem.value = deletedItem

    items.value = items.value.filter((item) => item.id !== itemId)
    showSnackbar.value = true

    if (undoTimer.value) clearTimeout(undoTimer.value)
    undoTimer.value = setTimeout(() => {
      showSnackbar.value = false
      lastDeletedItem.value = null
    }, 5000)

    closeEditModal()
  } catch (error) {
    console.error('삭제 처리 실패:', error)
    await getIngredients()  // 실패하면 목록 다시 불러오기
  }
}

/**
 * 재료 삭제 되돌리기
 */
const undoDelete = async () => {
  if (!lastDeletedItem.value) return

  try {
    await refrigeratorApi.undoDeleteIngredient(lastDeletedItem.value.id)

    // 목록 새로고침
    await getIngredients()

    // 스낵바 숨김
    showSnackbar.value = false
    lastDeletedItem.value = null

    if (undoTimer.value) {
      clearTimeout(undoTimer.value)
      undoTimer.value = null
    }
  } catch (error) {
    console.error('삭제 취소 실패:', error)
    alert('삭제 취소에 실패했습니다.')
  }
}

/**
 * 아이템 인덱스 찾기 (기존 호환성)
 */
function getItemIndex(item) {
  return items.value.findIndex((it) => it.id === item.id)
}

// =================================================================
// 동기화 모달 관련 함수들
// =================================================================

const loadInitialData = async () => {
  try {
    // 1. 동기화 메시지 먼저 조회
    const syncPrompt = await refrigeratorApi.getSyncPrompt()
    syncPromptData.value = syncPrompt
    showSyncModal.value = true

    // 2. 기존 데이터 로드
    await Promise.all([getIngredients(), loadCategories()])
  } catch (error) {
    console.error('초기 데이터 로드 실패:', error)
    // 동기화 메시지 실패해도 기본 데이터는 로드
    await Promise.all([getIngredients(), loadCategories()])
  }
}

const getMessageLines = () => {
  if (!syncPromptData.value?.contextMessage) return []
  return syncPromptData.value.contextMessage.split('\n')
}

const getLineClass = (line) => {
  if (line.includes('만료된')) return 'message-expired'
  if (line.includes('긴급')) return 'message-urgent'
  if (line.includes('2-3일')) return 'message-expiring'
  return 'message-info'
}

const closeSyncModal = () => {
  showSyncModal.value = false
}

const handleSyncAction = () => {
  const action = syncPromptData.value?.recommendedAction

  // 🆕 빈 상태일 때 식재료 추가 모달 열기
  if (action?.includes('첫 식재료 등록하기')) {
    showAddModal.value = true // 식재료 추가 모달 열기
    closeSyncModal() // 동기화 모달 닫기
    return
  }

  if (action?.includes('만료')) {
    // 만료된 아이템 (0일 미만)
    filters.expirationStatus = 'EXPIRED'
    applyFilters()
  } else if (action?.includes('긴급') || action?.includes('1일')) {
    // 긴급 아이템 (1일 이하)
    filters.expirationStatus = 'URGENT'
    applyFilters()
  } else if (action?.includes('임박') || action?.includes('3일')) {
    // 임박 아이템 (2-3일)
    filters.expirationStatus = 'EXPIRING_SOON'
    applyFilters()
  }

  closeSyncModal()
}

// =================================================================
// 라이프사이클
// =================================================================

onMounted(async () => {
  await loadInitialData()
  document.addEventListener('click', closeAllDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeAllDropdowns)
})
</script>

<template>
  <!-- 동기화 프롬프트 모달 -->
  <div v-if="showSyncModal" class="modal-overlay" @click="closeSyncModal">
    <div class="modal-content" @click.stop>
      <h2>{{ syncPromptData?.baseMessage }}</h2>
      <div
        v-for="(line, index) in getMessageLines()"
        :key="index"
        :class="getLineClass(line)"
        class="message-line"
      >
        {{ line }}
      </div>

      <div class="ingredient-edit-modal-button-container">
        <button
          v-if="syncPromptData?.recommendedAction"
          @click="handleSyncAction"
          class="ingredient-add-btn"
        >
          {{ syncPromptData.recommendedAction }}
        </button>
        <button @click="closeSyncModal" class="ingredient-add-btn secondary-btn">
          나중에 하기
        </button>
      </div>
    </div>
  </div>

  <!-- 검색 필터 영역 -->
  <div class="filter-section">
    <div class="refrigerator-search-help-section">
      <div class="refrigerator-filter-container">
        <!-- 정렬 드롭다운 -->
        <div class="dropdown" @click.stop="toggleDropdown('sort')">
          <span class="refrigerator-filter-items"> {{ selectedLabels.sort }} &nbsp;▼ </span>
          <div v-if="dropdownStates.sort" class="dropdown-menu">
            <div
              v-for="option in sortOptions"
              :key="`${option.sortType}-${option.sortDirection}`"
              class="dropdown-item"
              @click.stop="selectSortOption(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <!-- 카테고리 드롭다운 -->
        <div class="dropdown" @click.stop="toggleDropdown('category')">
          <span class="refrigerator-filter-items"> {{ selectedLabels.category }} &nbsp;▼ </span>
          <div v-if="dropdownStates.category" class="dropdown-menu">
            <div
              v-for="option in categoryOptions"
              :key="option.id || 'all'"
              class="dropdown-item"
              @click.stop="selectCategory(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>

        <!-- 유통기한 상태 드롭다운 -->
        <div class="dropdown" @click.stop="toggleDropdown('expiration')">
          <span class="refrigerator-filter-items"> {{ selectedLabels.expiration }} &nbsp;▼ </span>
          <div v-if="dropdownStates.expiration" class="dropdown-menu">
            <div
              v-for="option in expirationOptions"
              :key="option.status || 'all'"
              class="dropdown-item"
              @click.stop="selectExpirationStatus(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="search-bar-container">
        <div class="search-input-wrapper">
          <input
            id="refrigerator-item-search"
            type="text"
            v-model="searchQuery"
            @input="onInput"
            placeholder="재료명을 입력하세요"
          />
          <button
            v-if="searchQuery"
            class="input-clear-btn"
            @click="clearSearch"
            aria-label="입력 초기화"
          >
            ×
          </button>
        </div>
        <div id="refrigerator-item-search-button">
          <img src="/assets/icons/ic-white-bold-search.png" alt="찾보기" />
        </div>
      </div>
    </div>
  </div>

  <!-- 검색 결과 표시 -->
  <div v-if="searchedKeyword" class="user-search-keyword">
    <span>'{{ searchedKeyword }}'</span>에 대한 검색 결과({{ filteredItems.length }})
  </div>

  <!-- 로딩 상태 -->
  <div v-if="loading" class="loading-container">
    <p>냉장고 데이터를 불러오는 중...</p>
  </div>

  <!-- 냉장고 섹션 -->
  <div v-else class="refrigerator-section-container refrigerator-content-section">
    <!-- 실외 저장소 -->
    <div id="outdoor-storage-container" class="refrigerator-sections">
      <span class="refrigerator-section-name">실외 저장소</span>
      <div class="refrigerator-item-save-boxes">
        <div class="refrigerator-item-save-scroll-boxes">
          <IngredientCard
            v-for="(item, i) in filteredItems.filter((item) => item.location === '실외저장소')"
            :key="item.id"
            :name="item.name"
            :qnt="item.qnt"
            :ex-date="item.exDate"
            :category="item.category"
            :image-url="item.imageUrl"
            :location="item.location"
            :expiration-status="item.expirationStatus"
            @click="openEditModal(filteredItems.indexOf(item))"
          />
        </div>
      </div>
    </div>

    <!-- 냉장실 -->
    <div id="refrigerator-room-container" class="refrigerator-sections">
      <span class="refrigerator-section-name">냉장고</span>
      <div class="refrigerator-item-save-boxes">
        <div class="refrigerator-item-save-scroll-boxes">
          <IngredientCard
            v-for="(item, i) in filteredItems.filter((item) => item.location === '냉장실')"
            :key="item.id"
            :name="item.name"
            :qnt="item.qnt"
            :ex-date="item.exDate"
            :category="item.category"
            :image-url="item.imageUrl"
            :location="item.location"
            :expiration-status="item.expirationStatus"
            @click="openEditModal(filteredItems.indexOf(item))"
          />
        </div>
      </div>
    </div>

    <!-- 냉동실 -->
    <div id="freezer-room-container" class="refrigerator-sections">
      <span class="refrigerator-section-name">냉동고</span>
      <div class="refrigerator-item-save-boxes">
        <div class="refrigerator-item-save-scroll-boxes">
          <IngredientCard
            v-for="(item, i) in filteredItems.filter((item) => item.location === '냉동실')"
            :key="item.id"
            :name="item.name"
            :qnt="item.qnt"
            :ex-date="item.exDate"
            :category="item.category"
            :image-url="item.imageUrl"
            :location="item.location"
            :expiration-status="item.expirationStatus"
            @click="openEditModal(filteredItems.indexOf(item))"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 추가 버튼 -->
  <div class="add-refrigerator-items-button" @click="showAddModal = true">
    <img src="/assets/icons/ic-edit.png" alt="재료 추가" />
  </div>

  <!-- 재료 추가 모달 -->
  <AddIngredientModal
    :visible="showAddModal"
    @close="showAddModal = false"
    @submit="handleAddIngredient"
  />

  <!-- 수정 모달 -->
  <EditIngredientModal
    :visible="showEditModal"
    :ingredient="selectedIngredient"
    @close="closeEditModal"
    @submit="submitEdit"
    @delete="deleteIngredient"
  />

  <!-- 삭제 취소 스낵바 -->
  <div id="snackbar" v-if="showSnackbar">
    삭제되었습니다.
    <button id="undoDeleteBtn" @click="undoDelete">되돌리기</button>
  </div>
</template>

<style scoped>
/* 기존 CSS는 모두 유지하고, 아래 내용만 추가 */

/* 드롭다운 관련 스타일 */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 25px;
  left: 0;
  background-color: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  margin-top: 4px;
}

.dropdown-item {
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}

/* 🔥 멀티라인 메시지 스타일 */
.message-line {
  padding: 8px 0;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
}

.message-expired {
  color: #dc3545; /* 빨간색 - 가장 긴급 */
}

.message-urgent {
  color: #ff6b00; /* 주황색 - 긴급 */
}

.message-expiring {
  color: #ffc107; /* 노란색 - 주의 */
}

.message-info {
  color: #495057; /* 회색 - 정보성 */
}

/* 보조 버튼 색상 */
.secondary-btn {
  background-color: var(--color-gray) !important;
}
.secondary-btn:hover {
  background-color: #7c7c7c !important;
}
</style>
