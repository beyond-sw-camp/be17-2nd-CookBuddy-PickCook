<script setup>
import { reactive, watch, defineEmits, defineProps } from 'vue'

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
  육류: 'ic-ingredient-category-meat',
  채소: 'ic-ingredient-category-vegetable',
  과일: 'ic-ingredient-category-fruit',
  디저트: 'ic-ingredient-category-dessert',
  간편식: 'ic-ingredient-category-conveniencefood',
  해산물: 'ic-ingredient-category-fish',
  냉동식품: 'ic-ingredient-category-ice',
  기타: 'ic-ingredient-category-etc',
}

watch(
  () => props.ingredient,
  (newIngredient) => {
    if (newIngredient) {
      form.name = newIngredient.name || ''
      form.qnt = newIngredient.qnt || ''
      form.rawDate = newIngredient.rawDate || ''
      form.category = newIngredient.category || ''
      form.location = newIngredient.location || ''
    }
  },
  { immediate: true },
)

function closeModal() {
  emit('close')
}

function submitForm() {
  if (!form.name || !form.qnt || !form.rawDate || !form.category || !form.location) {
    alert('모든 항목을 입력해주세요.')
    return
  }
  const imageUrl = `/assets/icons/${categoryImageMap[form.category] || 'etc'}.png`
  console.log('이미지 경로:', imageUrl)

  emit('submit', { ...form, imageUrl })
  closeModal()
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
            <option>육류</option>
            <option>해산물</option>
            <option>과일</option>
            <option>간편식</option>
            <option>냉동식품</option>
            <option>디저트</option>
            <option>유제품</option>
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
