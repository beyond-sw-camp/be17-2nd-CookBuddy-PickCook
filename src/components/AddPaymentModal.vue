<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const cardNameOptions = [
  '신한카드',
  '국민카드',
  '삼성카드',
  '현대카드',
  '롯데카드',
  '하나카드',
  '비씨카드',
  '우리카드',
]

const cardName = ref(cardNameOptions[0])
const cardNumber = ref('')
const expiry = ref('')
const setAsDefault = ref(false)

function close() {
  emit('close')
}

function submit() {
  emit('submit', {
    cardName: cardName.value,
    cardNumber: cardNumber.value.replace(/\s/g, ''),
    expiry: expiry.value,
    isDefault: setAsDefault.value,
  })
  close()
}
</script>
<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="pg-add-modal">
      <h3>새 결제 수단 추가</h3>

      <form @submit.prevent="submit">
        <label>
          카드 이름
          <select v-model="cardName" class="pm-add-select" required>
            <option v-for="name in cardNameOptions" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </label>

        <label>
          카드 번호
          <input
            type="text"
            v-model="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            required
          />
        </label>

        <label>
          유효기간 (MM/YY)
          <input type="text" v-model="expiry" placeholder="MM/YY" maxlength="5" required />
        </label>

        <label class="checkbox">
          <input type="checkbox" v-model="setAsDefault" />
          기본 결제 수단으로 설정
        </label>

        <div class="actions">
          <button type="submit">등록</button>
          <button type="button" @click="close">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pg-add-modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.pg-add-modal label {
  display: block;
  margin-top: 1rem;
  font-size: 14px;
}

.pg-add-modal input[type='text'] {
  margin-top: 0.25rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.checkbox {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.actions button:last-child {
  background: #aaa;
}

.pm-add-select {
  margin-top: 0.25rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

[type='checkbox'] {
  accent-color: var(--color-primary);
}
</style>
