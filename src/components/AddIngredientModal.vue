<script setup>
import { reactive, defineEmits, defineProps, watch, onMounted, ref } from 'vue'
import refrigeratorApi from '@/api/refrigerator'

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
  visible: Boolean,
})

const categories = ref([])
const loading = ref(false)

const form = reactive({
  ingredientName: '',
  quantity: '',
  expirationDate: '',
  categoryId: '',
  location: '',
})

// 카테고리 목록 조회
const loadCategories = async () => {
  try {
    categories.value = await refrigeratorApi.getCategories()
  } catch (error) {
    console.error('카테고리 로딩 실패:', error)
    // 기본 카테고리 fallback
    categories.value = [
      { id: 1, name: '채소' },
      { id: 2, name: '정육·가공육·달걀' },
      { id: 3, name: '수산·해산·건어물' },
      { id: 4, name: '과일·견과·쌀' },
      { id: 5, name: '간편식' },
      { id: 6, name: '냉동식품' },
      { id: 7, name: '베이커리' },
      { id: 8, name: '유제품' },
      { id: 9, name: '면·양념·오일' },
      { id: 10, name: '기타' },
    ]
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal === true) {
      // 폼 초기화
      resetForm()
    }
  },
)

function resetForm() {
  form.ingredientName = ''
  form.quantity = ''
  form.expirationDate = ''
  form.categoryId = ''
  form.location = ''
}

function closeModal() {
  emit('close')
}

async function submitForm() {
  // 유효성 검증
  if (!form.ingredientName.trim()) {
    alert('재료명을 입력해주세요.')
    return
  }
  if (!form.quantity.trim()) {
    alert('수량을 입력해주세요.')
    return
  }
  if (!form.expirationDate) {
    alert('유통기한을 선택해주세요.')
    return
  }
  if (!form.categoryId) {
    alert('카테고리를 선택해주세요.')
    return
  }
  if (!form.location) {
    alert('보관위치를 선택해주세요.')
    return
  }

  // 수량을 숫자로 변환 (예: "2개" → 2)
  const quantityNumber = parseInt(form.quantity.replace(/[^0-9]/g, '')) || 1

  const submitData = {
    ingredientName: form.ingredientName.trim(),
    quantity: quantityNumber,
    expirationDate: form.expirationDate,
    categoryId: parseInt(form.categoryId),
    location: form.location,
  }

  try {
    loading.value = true
    const result = await refrigeratorApi.addIngredient(submitData)
    emit('submit', result)
    closeModal()
  } catch (error) {
    console.error('식재료 추가 실패:', error)

    // 에러 메시지 표시
    if (error.response?.data?.message) {
      alert(`추가 실패: ${error.response.data.message}`)
    } else {
      alert('식재료 추가에 실패했습니다. 다시 시도해주세요.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="modal-overlay" v-show="visible" @click.self="closeModal">
    <div class="add-refrigerator-modal-content modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h2>식재료 추가</h2>
      <form class="add-refrigerator-items-form" @submit.prevent="submitForm">
        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">재료명</label>
          <input
            v-model="form.ingredientName"
            class="ingredient-input"
            type="text"
            placeholder="ex) 계란, 우유"
            :disabled="loading"
          />
        </div>

        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">수량</label>
          <input
            v-model="form.quantity"
            class="ingredient-input"
            type="text"
            placeholder="ex) 2개, 500g"
            :disabled="loading"
          />
        </div>

        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">유통기한</label>
          <input
            v-model="form.expirationDate"
            class="ingredient-input"
            type="date"
            :disabled="loading"
          />
        </div>

        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">카테고리</label>
          <select v-model="form.categoryId" class="ingredient-select" :disabled="loading">
            <option value="">선택</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">보관위치</label>
          <select v-model="form.location" class="ingredient-select" :disabled="loading">
            <option value="">선택</option>
            <option value="실외저장소">실외저장소</option>
            <option value="냉장실">냉장실</option>
            <option value="냉동실">냉동실</option>
          </select>
        </div>

        <button type="submit" class="ingredient-add-btn" :disabled="loading">
          {{ loading ? '추가 중...' : '추가하기' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.ingredient-add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ingredient-input:disabled,
.ingredient-select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
