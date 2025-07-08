<script setup>
import { reactive, defineEmits, defineProps, watch } from 'vue'

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
  visible: Boolean,
})

const form = reactive({
  name: '',
  qnt: '',
  rawDate: '',
  category: '',
  location: '',
})

watch(
  () => props.visible,
  (newVal) => {
    if (newVal === true) {
      // reset form
      form.name = ''
      form.qnt = ''
      form.rawDate = ''
      form.category = ''
      form.location = ''
    }
  },
)

function closeModal() {
  emit('close')
}

function submitForm() {
  if (!form.name || !form.qnt || !form.rawDate || !form.category || !form.location) {
    alert('모든 항목을 입력해주세요.')
    return
  }
  emit('submit', { ...form })
  closeModal()
}
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
        <button type="submit" class="ingredient-add-btn">추가하기</button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
