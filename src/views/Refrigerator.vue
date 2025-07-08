<script setup>
import api from '@/api/refrigerator'
import { ref, computed, onMounted } from 'vue'
import IngredientCard from '@/components/IngredientCard.vue'
import AddIngredientModal from '@/components/AddIngredientModal.vue'
import EditIngredientModal from '@/components/EditIngredientModal.vue'

const selectedIngredientIndex = ref(null)
const showSnackbar = ref(false)
const lastDeletedItem = ref(null)
const lastDeletedIndex = ref(null)

const searchQuery = ref('')
const searchedKeyword = ref('')

const showAddModal = ref(false)
const showEditModal = ref(false)

const items = ref([])

function getItemIndex(item) {
  return items.value.findIndex((it) => it === item)
}

// 카테고리별 이미지 파일명
const categoryImageMap = {
  유제품: 'ic-ingredient-category-milk',
  육류: 'ic-ingredient-category-meat',
  채소: 'ic-ingredient-category-vegetable',
  과일: 'ic-ingredient-category-fruit',
  디저트: 'ic-ingredient-category-dessert',
  간편식: 'ic-ingredient-category-conveniencefood',
  해산물: 'ic-ingredient-category-fish',
  냉동식품: 'ic-ingredient-category-ice',
  기타: 'ic-ingredient-category-etc',
}

// 재료 목록 불러오기
const getIngredients = async () => {
  const data = await api.getIngredients()

  if (data && data.ingredients) {
    items.value = data.ingredients.map((item) => {
      const imageFileName = categoryImageMap[item.category] || 'ic-ingredient-category-etc'
      return {
        name: item.ingredient_name,
        rawDate: item.expiration_date,
        exDate: getDaysLeft(item.expiration_date),
        category: item.category,
        qnt: `${item.quantity} ${item.unit}`,
        imageUrl: `/assets/icons/${imageFileName}.png`,
        location: item.location,
      }
    })
  }
}

// 검색 결과 업데이트
const updateSearch = () => {
  searchedKeyword.value = searchQuery.value.trim()
}

// 검색 입력값 초기화
const clearSearch = () => {
  searchQuery.value = ''
  searchedKeyword.value = ''
}

// 키보드 입력 -> 검색 결과 업데이트
const onInput = (event) => {
  searchQuery.value = event.target.value
  updateSearch()
}

// 한글 초성
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

// 한글 중성
const JUNGSEONG = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
]

// 한글 종성
const JONGSEONG = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
]

const BASE = 0xac00, // 한글 음절표 시작값
  JUNG_COUNT = 21, // 중성 개수
  JONG_COUNT = 28 // 종성 개수

// 한글 분해
const decomposeHangul = (char) => {
  const code = char.charCodeAt(0)
  if (code < BASE || code > 0xd7a3) return { ch: char, jo: '', jong: '' }
  const i = code - BASE
  return {
    ch: CHOSEONG[Math.floor(i / (JUNG_COUNT * JONG_COUNT))],
    jo: JUNGSEONG[Math.floor((i % (JUNG_COUNT * JONG_COUNT)) / JONG_COUNT)],
    jong: JONGSEONG[i % JONG_COUNT],
  }
}

const decomposeString = (str) => {
  return [...str].map(decomposeHangul)
}

// 종성 → 초성 이동
const moveFinalConsonantForward = (str) => {
  if (str.length < 1) return str
  const last = str[str.length - 1]
  const d = decomposeHangul(last)
  if (!d.jong) return null

  const code = last.charCodeAt(0)
  const i = code - BASE
  const base = Math.floor(i / JONG_COUNT) * JONG_COUNT
  const newChar = String.fromCharCode(BASE + base)
  return str.slice(0, -1) + newChar + d.jong
}

// 부분 포함 검사
const isPartialMatch = (patternArr, textArr) => {
  const lenP = patternArr.length,
    lenT = textArr.length
  for (let i = 0; i <= lenT - lenP; i++) {
    let matched = true
    for (let j = 0; j < lenP; j++) {
      const p = patternArr[j],
        t = textArr[i + j]
      if (p.ch && p.ch !== t.ch) {
        matched = false
        break
      }
      if (p.jo && p.jo !== t.jo) {
        matched = false
        break
      }
    }
    if (matched) return true
  }
  return false
}

// 최종 매칭 함수
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

// 검색 결과 필터링
const filteredItems = computed(() => {
  const keyword = searchedKeyword.value.trim().toLowerCase()
  if (!keyword) return items.value
  return items.value.filter((item) => hangulMatch(item.name.toLowerCase(), keyword))
})

// 남은 소비기한 계산
const getDaysLeft = (dateStr) => {
  const today = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
  if (diff > 0) return `${diff}일 남음`
  else if (diff === 0) return `오늘까지`
  else return `${Math.abs(diff)}일 지남`
}

// 재료 추가
const handleAddIngredient = ({ name, qnt, rawDate, category, location }) => {
  const imageFileName = categoryImageMap[category] || 'ic-ingredient-category-etc'
  const imageUrl = `/assets/icons/${imageFileName}.png`
  const exDate = getDaysLeft(rawDate)

  const newItem = { name, qnt, rawDate, exDate, category, imageUrl, location }
  items.value.push(newItem)
}

// 재료 편집 모달 열기
const openEditModal = (index) => {
  selectedIngredientIndex.value = index
  showEditModal.value = true
}

// 재료 편집 모달 닫기
const closeEditModal = () => {
  showEditModal.value = false
  selectedIngredientIndex.value = null
}

// 재료 편집 반영
const submitEdit = (editedData) => {
  if (selectedIngredientIndex.value !== null) {
    items.value[selectedIngredientIndex.value] = {
      ...items.value[selectedIngredientIndex.value],
      ...editedData,
      exDate: getDaysLeft(editedData.rawDate),
    }
  }
  closeEditModal()
}

// 재료 삭제
const deleteIngredient = () => {
  if (selectedIngredientIndex.value !== null && items.value[selectedIngredientIndex.value]) {
    lastDeletedItem.value = items.value[selectedIngredientIndex.value]
    lastDeletedIndex.value = selectedIngredientIndex.value
    items.value.splice(selectedIngredientIndex.value, 1)
  }
  closeEditModal()
  showSnackbar.value = true
  setTimeout(() => (showSnackbar.value = false), 5000)
}

// 재료 삭제 되돌리기
const undoDelete = () => {
  if (lastDeletedItem.value && lastDeletedIndex.value !== null) {
    items.value.splice(lastDeletedIndex.value, 0, lastDeletedItem.value)
    lastDeletedItem.value = null
    lastDeletedIndex.value = null
    showSnackbar.value = false
  }
}

onMounted(() => {
  getIngredients()
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
  <div v-if="searchedKeyword" class="user-search-keyword">
    <span>'{{ searchedKeyword }}'</span>에 대한 검색 결과({{ filteredItems.length }})
  </div>

  <!-- 냉장고 섹션 -->
  <div class="refrigerator-section-container refrigerator-content-section">
    <!-- 실외 저장소 -->
    <div id="outdoor-storage-container" class="refrigerator-sections">
      <span class="refrigerator-section-name">실외 저장소</span>
      <div class="refrigerator-item-save-boxes">
        <div class="refrigerator-item-save-scroll-boxes">
          <IngredientCard
            v-for="(item, i) in filteredItems.filter((item) => item.location === '실외 저장소')"
            :key="item.ingredient_id || item.name + '-' + i"
            :image-url="item.imageUrl"
            v-bind="item"
            @click="openEditModal(getItemIndex(item))"
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
            :key="item.ingredient_id || item.name + '-' + i"
            :image-url="item.imageUrl"
            v-bind="item"
            @click="openEditModal(getItemIndex(item))"
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
            :key="item.ingredient_id || item.name + '-' + i"
            :image-url="item.imageUrl"
            v-bind="item"
            @click="openEditModal(getItemIndex(item))"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 추가 버튼 -->
  <div class="add-refrigerator-items-button" id="openModalBtn">
    <img src="/assets/icons/ic-edit.png" alt="재료 추가" />
  </div>

  <!-- 재료 추가 모달 -->
  <div class="add-refrigerator-items-button" @click="showAddModal = true">
    <img src="/assets/icons/ic-edit.png" alt="재료 추가" />
  </div>

  <AddIngredientModal
    :visible="showAddModal"
    @close="showAddModal = false"
    @submit="handleAddIngredient"
  />

  <!-- 수정 모달 -->
  <EditIngredientModal
    :visible="showEditModal"
    :ingredient="
      selectedIngredientIndex !== null && items[selectedIngredientIndex]
        ? items[selectedIngredientIndex]
        : null
    "
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
<style scoped></style>
