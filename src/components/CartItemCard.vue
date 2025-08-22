<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  item: Object,
  isChecked: Boolean,
})

// 부모에게 알릴 요소들
const emit = defineEmits(['update:quantity', 'toggle-check', 'delete-item']) 

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

// 체크 상태가 변경되면 부모 컴포넌트에게 알림
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

// 원래 가격과 할인율
const originalPrice = ref(props.item.original_price)
const discountRate = ref(props.item.discount_rate)

// 할인된 가격 계산
const discountedPrice = computed(() => {
  return Math.round((originalPrice.value * (100 - discountRate.value)) / 100)
})

// 체크박스 변경 시 부모에게 알림
watch(isChecked, (val) => {
  emit('toggle-check', val)
})

// 장바구니 아이템 삭제 클릭 시 부모에게 알림
const handleDelete = () => {
  emit('delete-item', {
    productId: props.item.product_id,
    idx: props.item.idx,
  }) 
}
</script>

<template>
  <div class="my-cart-item-card-container">
    <div class="my-cart-item-card-top">
      <label class="custom-checkbox">
        <input type="checkbox" v-model="isChecked" />
        <span class="checkmark"></span>
      </label>
      <span>{{props.item.name}}</span>
      <div class="bubble"></div>
      <img src="/assets/icons/ic-delete.png" alt="삭제" @click="handleDelete"/>
    </div>

    <div class="my-cart-item-card-bottom">
      <img
        :src="props.item.main_image_url"
        alt="상품 이미지"
      />
      <div class="my-cart-in-item-product-info">
        <div class="my-cart-product-cost-info">
          <h4>{{ discountedPrice.toLocaleString() }}</h4>
          <span>{{ props.item.original_price.toLocaleString() }}</span>
        </div>

        <div class="my-cart-item-card-quantity-edit-button">
          <img @click="decreaseQty" src="/assets/icons/ic-black-sub.png" alt="빼기" />
          <span>{{ qty }}</span>
          <img @click="increaseQty" src="/assets/icons/ic-black-plus.png" alt="추가" />
        </div>
      </div>
    </div>
  </div>
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
