<script setup>
import OderProductItemCard from './OderProductItemCard.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/payment'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close'])
const reason = ref('')
const route = useRoute()
const orderIdFromRoute = Number(route.params.orderId)

async function submitRefund() {
  if (!reason.value || reason.value.trim() === '') {
    alert('반품 사유를 입력해주세요.')
    return
  }

  try {
    // 백엔드가 요구하는 payload 생성
    const payload = {
      paymentId: props.paymentId,
      reason: reason.value,
      amount: props.cost,
      orderId: orderIdFromRoute,
      productId: props.order.product_id,
    }

    console.log('환불 요청 payload:', payload)

    // API 요청
    const res = await api.refundPayment(payload)

    if (res.success) {
      alert('환불 요청이 성공적으로 처리되었습니다!')
      emit('close')
      window.location.reload() // 페이지 새로고침
    } else {
      alert(res.message || '환불 요청에 실패했습니다.')
    }
  } catch (err) {
    console.error('환불 요청 중 오류 발생:', err)
    alert('환불 요청 중 오류가 발생했습니다.')
  }
}

</script>

<template>
  <!-- 전체 화면 덮는 배경 -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <!-- 모달 박스 -->
    <div class="refund-modal-container">
      <div class="refund-modal-header-container">
        <div></div>
        <h3>반품 요청</h3>
        <img src="/assets/icons/ic-delete.png" alt="닫기" @click="$emit('close')" />
      </div>

      <div class="refund-product-container">
        <OderProductItemCard
          :order="{ orderItems: [order] }"
          :showHeader="false"
          :showButtons="false"
        />
      </div>

      <div class="refund-reason-input-container">
        <span>반품 사유</span>
        <input v-model="reason" type="text" placeholder="반품 사유를 입력해주세요." />
      </div>

      <button @click="submitRefund">반품 요청</button>
    </div>
  </div>
</template>

<style scoped>
/* 화면 전체 덮는 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 반투명 검은 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; /* 위에 뜨도록 */
}

/* 모달 박스 */
.refund-modal-container {
  background: white;
  border-radius: 8px;
  padding: 15px 0;
  width: 550px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.refund-modal-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 10px;
  border-bottom: 1px solid var(--color-light-gray);
  margin-bottom: 10px;
}

.refund-modal-header-container > div {
  width: 15px;
}

.refund-modal-header-container > h3 {
  font-weight: 500;
  font-size: 16px;
}

.refund-modal-header-container > img {
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.refund-reason-input-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 18px;
  margin-top: -20px;
}

.refund-reason-input-container > span {
  padding-left: 2px;
  font-size: 14px;
}

.refund-reason-input-container > input {
  padding: 10px;
  height: 35px;
  border-radius: 5px;
  border: 0.5px solid var(--color-light-gray);
}

button {
  margin: 20px 18px;
  padding: 8px 10px;
  cursor: pointer;
  border: none;
  background-color: var(--color-primary);
  border-radius: 5px;
  color: white;
  font-size: 14px;
}
</style>
