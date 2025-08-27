<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  item: Object,
  isChecked: Boolean,
})
const router = useRouter()

// 부모에게 알릴 요소들
const emit = defineEmits(['update:quantity', 'toggle-check', 'delete-item']) 

//체크 여부 로컬 상태
const isChecked = ref(props.isChecked)

// 외부 prop이 변경되면 동기화 
watch(
  () => props.isChecked,
  (val) => {
    isChecked.value = val
  },
)

const decreaseQty = () => {
  if (!canDecrease.value) return
  emit('update:quantity', {
    idx: props.item.idx,
    quantity: quantity.value - 1
  })
}

const increaseQty = () => {
  if (!canIncrease.value) return
  emit('update:quantity', {
    idx: props.item.idx,
    quantity: quantity.value + 1
  })
}

// 할인된 가격 계산
const discountedPrice = computed(() => {
  return Math.round((props.item.original_price * (100 - props.item.discount_rate)) / 100)
})

// 체크박스 변경 시 부모에게 알림
watch(isChecked, (val) => {
  emit('toggle-check', {
    checked: val,
    idx: props.item.idx,
    product_id: props.item.product_id,
  })
})

// 장바구니 아이템 삭제 클릭 시 부모에게 알림
const handleDelete = () => {
  emit('delete-item', {
    productId: props.item.product_id,
    idx: props.item.idx,
  }) 
}

// 현재 수량
const quantity = computed(() => props.item.quantity)

// 최소/최대 제한
const minQty = 1
const maxQty = 10

// 버튼 활성화 상태
const canDecrease = computed(() => quantity.value > minQty)
const canIncrease = computed(() => quantity.value < maxQty)

const goToShopping = (productId) => {
  router.push({ name: 'shoppingdetail', params: { id: productId } })
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
        @click="goToShopping(props.item.product_id)"
        :src="props.item.main_image_url"
        alt="상품 이미지"
      />
      <div class="my-cart-in-item-product-info">
        <div class="my-cart-product-cost-info">
          <h4>{{ (discountedPrice * quantity).toLocaleString() }}</h4>
          <span>{{ (props.item.original_price * quantity).toLocaleString() }}</span>
        </div>

        <div class="my-cart-item-card-quantity-edit-button">
          <img 
    @click="decreaseQty" 
    :src="canDecrease ? '/assets/icons/ic-black-sub.png' : '/assets/icons/ic-gray-sub.png'" 
    :style="{ cursor: canDecrease ? 'pointer' : 'default' }" 
    alt="빼기" 
  />
          <span>{{ quantity }}</span>
          <img 
    @click="increaseQty" 
    :src="canIncrease ? '/assets/icons/ic-black-plus.png' : '/assets/icons/ic-gray-plus.png'" 
    :style="{ cursor: canIncrease ? 'pointer' : 'default' }" 
    alt="추가" 
  />
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
  width: 111px;
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
