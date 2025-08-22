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
  <div class="my-cart-item-card-container">
    <div class="my-cart-item-card-top">
      <label class="custom-checkbox">
        <input type="checkbox" v-model="isChecked" />
        <span class="checkmark"></span>
      </label>
      <span>[조선호텔] 떡갈비 345g</span>
      <div class="bubble"></div>
      <img src="/assets/icons/ic-delete.png" alt="삭제" />
    </div>

    <div class="my-cart-item-card-bottom">
      <img src="https://cdn.iconsumer.or.kr/news/photo/202311/25849_31838_241.jpg" alt="상품 이미지" />
      <div class="my-cart-in-item-product-info">
        <div class="my-cart-product-cost-info">
          <h4>9,306원</h4>
          <span>9,900원</span>
        </div>

        <div class="my-cart-item-card-quantity-edit-button">
          <img src="/assets/icons/ic-black-sub.png" alt="빼기" />
          <span>1</span>
          <img src="/assets/icons/ic-black-plus.png" alt="추가" />
        </div>  
      </div>
    </div>
  </div>
  <!-- 체크박스 -->
  <!-- <label class="custom-checkbox">
        <input type="checkbox" v-model="isChecked" />
        <span class="checkmark"></span>
      </label>

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
      </button> -->
</template>

<style scoped>
.my-cart-item-card-container {
  display: flex;
  gap: 20px;
  flex-direction: column;
  padding: 0 0 30px;
}

.my-cart-item-card-top {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 15px 18px 0 13px;
}

.bubble {
  flex: 1;
}

.my-cart-item-card-top > span {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 2px;
}

.my-cart-item-card-top > img {
  width: 17px;
  height: 17px;
  margin-top: 5px;
  cursor: pointer;
}

.my-cart-item-card-bottom {
  display: flex;
  gap: 20px;
  padding: 0 48px;
}

.my-cart-item-card-bottom > img {
  width: 105px;
  height: 105px;
  border-radius: 15px;
  object-fit: cover;
  cursor: pointer;
}

.my-cart-product-cost-info {
  display: flex;
  gap: 8px;
}

.my-cart-product-cost-info > h4 {
  font-size: 18px;
  font-weight: bold;
}

.my-cart-product-cost-info > span {
  text-decoration: line-through;
  color: var(--color-gray);
  margin-top: 1px;
}

.my-cart-in-item-product-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0;
}

.my-cart-item-card-quantity-edit-button {
  background-color: #f4f4f4;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 9px 0;
}

.my-cart-item-card-quantity-edit-button > img {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.my-cart-item-card-quantity-edit-button > img:first-child {
  padding: 8.2px 0;
}
</style>
