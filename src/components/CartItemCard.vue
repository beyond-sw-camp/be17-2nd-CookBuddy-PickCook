<script setup>
import { ref, watch } from 'vue'

// 부모로부터 받아올 정보
const props = defineProps({
  item: Object,
  isChecked: Boolean,
})

const emit = defineEmits(['update:quantity', 'toggle-check']) // 부모로 수량/체크박스 상태 변경 알림

// 아이템 수량 로컬 상태
const qty = ref(props.item.quantity) // 내부에서 변경할 수 있도록 복사
watch(qty, (newVal) => {
  emit('update:quantity', newVal)
})

//체크 여부 로컬 상태
const isChecked = ref(props.isChecked)

// 외부 prop이 변경되면 동기화 (전체선택 시 필요한 코드)
watch(
  () => props.isChecked,
  (val) => {
    isChecked.value = val
  },
)

// 체크 상태가 변경되면 부모 컴포넌트에게 알림 (개별선택 시 필요한 코드)
watch(isChecked, (val) => {
  emit('toggle-check', val)
})

// 수량 증가 함수
const increaseQty = () => {
  qty.value++
}

// 수량 감소 함수
const decreaseQty = () => {
  if (qty.value > 1) {
    qty.value--
  }
}

// 체크박스 변경 시 부모에게 알림
watch(isChecked, (val) => {
  emit('toggle-check', val)
})
</script>

<template>
  <div class="my-cart-items-container">
    <div class="my-cart-items-container-left">
      <label class="custom-checkbox">
        <input type="checkbox" v-model="isChecked" />
        <span class="checkmark"></span>
      </label>
      <!-- 장바구니에 들어간 상품 정보 컨테이너 -->
      <div class="my-cart-items-product-info-container">
        <img :src="item.product_image" alt="장바구니 상품 이미지" />
        <div class="my-cart-items-content-box">
          <h3>{{ item.product_name }}</h3>
          <p>{{ item.description }}</p>
          <div class="my-cart-items-prices-info">
            <span v-if="item.beforePrice" class="discount-bf-price"
              >{{ item.unit_price.toLocaleString() }}원</span
            >
            <p>{{ item.total_price.toLocaleString() }}원</p>
          </div>
        </div>
      </div>
    </div>
    <div class="my-cart-items-container-right">
      <button
        class="cart-items-sub-button"
        :class="qty > 1 ? 'activate-button' : 'deactivate-button'"
        @click="decreaseQty"
        :disabled="qty <= 1"
      >
        <span>-</span>
      </button>
      <span class="cart-items-qnt">{{ qty }}</span>
      <button class="cart-items-add-button activate-button" @click="increaseQty">
        <span>+</span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
