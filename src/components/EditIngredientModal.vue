<script setup>
import { reactive, watch, defineEmits, defineProps } from 'vue'
import refrigeratorApi from '@/api/refrigerator'

const emit = defineEmits(['close', 'submit', 'delete'])

const props = defineProps({
  visible: Boolean,
  ingredient: {
    type: Object,
    default: null,
  },
})

const form = reactive({
  name: '',
  qnt: '',
  rawDate: '',
  category: '',
  location: '',
})

const categoryImageMap = {
  유제품: 'ic-ingredient-category-milk',
  '정육·가공육·달걀': 'ic-ingredient-category-meat',
  채소: 'ic-ingredient-category-vegetable',
  '과일·견과·쌀': 'ic-ingredient-category-fruit',
  베이커리: 'ic-ingredient-category-dessert',
  간편식: 'ic-ingredient-category-conveniencefood',
  '수산·해산·건어물': 'ic-ingredient-category-fish',
  냉동식품: 'ic-ingredient-category-ice',
  '면·양념·오일': 'ic-sauce-category-etc',
  기타: 'ic-ingredient-category-etc',
}

watch(
  () => props.ingredient,
  (newIngredient) => {
    if (newIngredient) {
      form.name = newIngredient.ingredientName || ''
      form.qnt = newIngredient.quantity?.toString() || '' // ✅ 스트링 처리
      form.rawDate = newIngredient.expirationDate || ''
      form.category = newIngredient.category?.name || ''
      form.location = newIngredient.location || ''
    }
  },
  { immediate: true },
)

function closeModal() {
  emit('close')
}

async function submitForm() {
  // 유효성 검증
  if (!form.name || !form.qnt || !form.rawDate || !form.category || !form.location) {
    alert('모든 항목을 입력해주세요.')
    return
  }

  // 백엔드 형식으로 데이터 변환
  const submitData = {
    ingredientName: form.name.trim(),
    quantity: parseInt(form.qnt.replace(/[^0-9]/g, '')) || 1, // 스트링에서 숫자 추출
    expirationDate: form.rawDate,
    categoryId: getCategoryIdByName(form.category), // 카테고리명 → ID 변환
    location: form.location,
  }

  try {
    // API 호출로 실제 수정
    const result = await refrigeratorApi.updateIngredient(props.ingredient.id, submitData)
    emit('submit', result) // 성공 시 부모에게 알림
    closeModal()
  } catch (error) {
    console.error('식재료 수정 실패:', error)
    alert('수정에 실패했습니다. 다시 시도해주세요.')
  }
}

// 카테고리명으로 ID 찾기 (임시 매핑)
function getCategoryIdByName(categoryName) {
  const categoryMap = {
    채소: 1,
    '정육·가공육·달걀': 2,
    '수산·해산·건어물': 3,
    '과일·견과·쌀': 4,
    간편식: 5,
    냉동식품: 6,
    베이커리: 7,
    유제품: 8,
    '면·양념·오일': 9,
    기타: 10,
  }
  return categoryMap[categoryName] || 10
}
</script>

<template>
  <div class="modal-overlay" v-show="visible" @click.self="closeModal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h2>식재료 수정</h2>
      <form class="add-refrigerator-items-form" @submit.prevent="submitForm">
        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">재료명</label>
          <input
            v-model="form.name"
            class="ingredient-input"
            type="text"
            placeholder="ex) 계란, 우유"
          />
        </div>
        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">수량</label>
          <input
            v-model="form.qnt"
            class="ingredient-input"
            type="text"
            placeholder="ex) 2개, 500g"
          />
        </div>
        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">유통기한</label>
          <input v-model="form.rawDate" class="ingredient-input" type="date" />
        </div>
        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">카테고리</label>
          <select v-model="form.category" class="ingredient-select">
            <option value="">선택</option>
            <option>채소</option>
            <option>정육·가공육·달걀</option>
            <option>수산·해산·건어물</option>
            <option>과일·견과·쌀</option>
            <option>간편식</option>
            <option>냉동식품</option>
            <option>베이커리</option>
            <option>유제품</option>
            <option>면·양념·오일</option>
            <option>기타</option>
          </select>
        </div>
        <div class="ingredient-info-input-boxes">
          <label class="ingredient-label">보관위치</label>
          <select v-model="form.location" class="ingredient-select">
            <option value="">선택</option>
            <option>실외 저장소</option>
            <option>냉장실</option>
            <option>냉동실</option>
          </select>
        </div>
        <div class="ingredient-edit-modal-button-container">
          <button type="button" id="deleteBtn" class="ingredient-add-btn" @click="$emit('delete')">
            삭제
          </button>
          <button type="submit" class="ingredient-add-btn">수정 완료</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
