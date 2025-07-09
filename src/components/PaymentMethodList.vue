<script setup>
import { ref, onMounted } from 'vue'
import AddPaymentModal from './AddPaymentModal.vue'

const paymentMethods = ref([
  { id: 1, cardNumber: '1234123412341234', isDefault: true },
  { id: 2, cardNumber: '5678567856785678', isDefault: false },
])

const selectedId = ref(null)

onMounted(() => {
  const defaultMethod = paymentMethods.value.find((m) => m.isDefault)
  selectedId.value = defaultMethod ? defaultMethod.id : null
})

function maskCardNumber(number) {
  return '**** **** **** ' + number.slice(-4)
}

function removePayment(id) {
  const index = paymentMethods.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    if (selectedId.value === id) {
      selectedId.value =
        paymentMethods.value.length > 1 ? paymentMethods.value.find((m) => m.id !== id)?.id : null
    }
    paymentMethods.value.splice(index, 1)
  }
}

const showModal = ref(false)

function addPayment() {
  showModal.value = true
}

function handleSubmit(newCard) {
  const newId = Date.now()

  const card = {
    id: newId,
    cardNumber: newCard.cardNumber,
    isDefault: newCard.isDefault,
  }

  if (card.isDefault) {
    paymentMethods.value.forEach((m) => (m.isDefault = false))
    selectedId.value = newId
  }

  paymentMethods.value.push(card)
}
</script>

<template>
  <div class="payment-method-container">
    <h5>결제 수단</h5>
    <br />
    <hr />
    <div class="payment-list">
      <div v-for="(method, index) in paymentMethods" :key="method.id" class="payment-block">
        <div class="payment-item">
          <label class="payment-label">
            <input type="radio" name="selected" :value="method.id" v-model="selectedId" />
            <img class="card-icon" src="/assets/icons/ic-credit-card.png" alt="카드 아이콘" />
            <span>{{ maskCardNumber(method.cardNumber) }}</span>
          </label>
          <button class="delete-btn" @click="removePayment(method.id)">삭제</button>
        </div>
        <hr v-if="index < paymentMethods.length - 1" class="pm-item-divider" />
      </div>
    </div>

    <button @click="addPayment" class="pm-add-btn">계좌 추가</button>

    <AddPaymentModal v-if="showModal" @close="showModal = false" @submit="handleSubmit" />
  </div>
</template>

<style scoped>
.payment-method-container {
  border-radius: 8px;
  padding: 1rem;
  background: white;
  width: 572px;
}

.payment-block {
  display: flex;
  flex-direction: column;
}

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payment-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-icon {
  width: 36px;
  height: 24px;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  padding-right: 4px;
}

.delete-btn:hover {
  color: #ff4d4f;
}

.pm-item-divider {
  border: none;
  border-top: 1px solid #d9d8d8;
  margin-top: 1rem;
}

.pm-add-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #d9d8d8;
  border-radius: 6px;
  cursor: pointer;
}

[type='radio'] {
  accent-color: var(--color-primary);
}
</style>
