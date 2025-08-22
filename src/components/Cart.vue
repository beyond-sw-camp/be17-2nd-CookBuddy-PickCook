<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/cart'
import CartItemCard from './CartItemCard.vue'

// 장바구니 항목 데이터
const cartItems = ref([])

// 체크 상태를 별도로 관리: { [item.id]: true/false }
const checkedItems = ref({})

// 서버에서 장바구니 데이터를 가져온다고 가정
onMounted(async () => {
  try {
    const data = await api.cartList()
    cartItems.value = data

    checkedItems.value = Object.fromEntries(data.map((item) => [item.cart_item_id, false]))
  } catch (e) {
    console.error('장바구니 불러오기 중 오류 발생: ', e)
  }
})

// 개별 수량 변경 핸들러 + 서버에 반영
const handleQtyChange = async (id, newQty) => {
  const item = cartItems.value.find((i) => i.cart_item_id === id)
  if (!item) return

  item.quantity = newQty

  try {
    await axios.patch(`/api/cart/${id}`, { quantity: newQty })
  } catch (e) {
    console.error('수량 변경 실패: ', e)
  }
}

// 체크 상태 변경 핸들러
const handleCheck = (id, checked) => {
  checkedItems.value[id] = checked
}

// 장바구니 아이템 전체 선택하기
const isAllSelected = computed({
  get() {
    // 모든 장바구니 아이템이 체크된 상태라면 전체선택 체크박스도 체크됨
    return (
      cartItems.value.length > 0 &&
      cartItems.value.every((item) => checkedItems.value[item.cart_item_id])
    )
  },
  set(val) {
    // 전체선택 체크박스를 클릭했을 때 -> 모든 항목을 체크/해제
    cartItems.value.forEach((item) => {
      checkedItems.value[item.cart_item_id] = val
    })
  },
})

// 선택된 장바구니 아이템 개수
const selectedCount = computed(() => Object.values(checkedItems.value).filter(Boolean).length)

// 선택된 장바구니 아이템 삭제
const deleteSelected = async () => {
  const selectedIds = Object.entries(checkedItems.value)
    .filter(([_, checked]) => checked)
    .map(([id]) => parseInt(id))

  try {
    await axios.post('/api/cart/delete', { ids: selectedIds })

    // 삭제 후 프론트에서도 제거
    cartItems.value = cartItems.value.filter((item) => !selectedIds.includes(item.cart_item_id))

    // 체크 상태도 정리
    for (const id of selectedIds) {
      delete checkedItems.value[id]
    }
  } catch (e) {
    console.error('삭제 실패: ', e)
  }
}
</script>

<template>
  <div class="mypage-my-cart-items-list-container">
    <!-- 전체 선택 체크박스 -->
    <div class="mypage-header-box">
      <div class="mypage-header-box-child">
        <div class="my-cart-all-select-box-container-left">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="isAllSelected" />
            <span class="checkmark"></span>
          </label>
          <p>
            전체선택 <span>({{ selectedCount }}/{{ cartItems.length }})</span>
          </p>
        </div>
        <div class="my-cart-all-select-box-container-right" @click="deleteSelected">
          <p>선택삭제</p>
        </div>
      </div>
    </div>

    <div class="mypage-body-box">
      <!-- 장바구니 아이템 리스트 -->
      <div class="mypage-main-content-scroll">
        <CartItemCard
          v-for="item in cartItems"
          :key="item.idx"
          :productId="item.product_id"
          :item="item"
          :is-checked="checkedItems[item.idx]"
          @update:quantity="(newQty) => handleQtyChange(item.cart_item_id, newQty)"
          @toggle-check="(checked) => handleCheck(item.cart_item_id, checked)"
        />
      </div>

      <div class="mypage-cart-in-items-total-price-container">
        <p>상품 16,206원 + 배송비 무료</p>
        <span>16,206원</span>
      </div>
    </div>

    <button class="cart-in-products-order-go">주문하러 가기</button>
  </div>
</template>

<style scoped>
.mypage-cart-in-items-total-price-container {
  background-color: #F8F8F8;
  margin: 30px 15px 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.mypage-cart-in-items-total-price-container > p {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-gray);
}

.mypage-cart-in-items-total-price-container > span {
  font-size: 18px;
  font-weight: bold;
}
</style>
