<script setup>
import refrigeratorApi from '@/api/refrigerator'
import { ref, computed, onMounted } from 'vue'
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
  const imageFileName = categoryImageMap[backendItem.category?.name] || 'ic-ingredient-category-etc'

  return {
    id: backendItem.id,
    name: backendItem.ingredientName,
    qnt: `${backendItem.quantity}개`, // 단위는 임시로 "개" 사용
    rawDate: backendItem.expirationDate,
    exDate: getDaysLeft(backendItem.expirationDate),
    category: backendItem.category?.name || '기타',
    imageUrl: `/assets/icons/${imageFileName}.png`,
    location: backendItem.location,

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
    // 삭제된 아이템 정보 저장 (실행 취소용)
    const deletedItem = items.value.find((item) => item.id === itemId)
    if (deletedItem) {
      lastDeletedItem.value = deletedItem
    }

    // 목록에서 즉시 제거 (UI 반응성)
    items.value = items.value.filter((item) => item.id !== itemId)

    // 실행 취소 스낵바 표시
    showSnackbar.value = true

    // 5초 후 자동으로 스낵바 숨김
    if (undoTimer.value) {
      clearTimeout(undoTimer.value)
    }
    undoTimer.value = setTimeout(() => {
      showSnackbar.value = false
      lastDeletedItem.value = null
    }, 5000)

    closeEditModal()
  } catch (error) {
    console.error('삭제 처리 실패:', error)
    // 삭제 실패 시 목록 다시 불러오기
    await getIngredients()
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
// 라이프사이클
// =================================================================

onMounted(async () => {
  await Promise.all([getIngredients(), loadCategories()])
})
</script>

<template>
  <!-- 검색 필터 영역 -->
  <div class="refrigerator-search-help-section-container filter-section">
    <div class="refrigerator-search-help-section">
      <div class="refrigerator-filter-container">
        <span class="refrigerator-filter-items">정렬 &nbsp;▼</span>
        <span class="refrigerator-filter-items">카테고리 &nbsp;▼</span>
        <span class="refrigerator-filter-items">재고위치 &nbsp;▼</span>
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
          <img src="/assets/icons/ic-white-bold-search.png" alt="돋보기" />
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
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
}

.filter-section {
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.refrigerator-search-help-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.refrigerator-filter-container {
  display: flex;
  gap: 16px;
}

.refrigerator-filter-items {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.refrigerator-filter-items:hover {
  background: #f0f0f0;
}

.search-bar-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.input-clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
}

#refrigerator-item-search-button {
  background: #007bff;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}

#refrigerator-item-search-button img {
  width: 20px;
  height: 20px;
}

.user-search-keyword {
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 500;
}

.refrigerator-section-container {
  padding: 20px;
}

.refrigerator-sections {
  margin-bottom: 32px;
}

.refrigerator-section-name {
  display: block;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.refrigerator-item-save-boxes {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  min-height: 120px;
}

.refrigerator-item-save-scroll-boxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-refrigerator-items-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.2s;
}

.add-refrigerator-items-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.add-refrigerator-items-button img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

#snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

#undoDeleteBtn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

#undoDeleteBtn:hover {
  background: #0056b3;
}
</style>
