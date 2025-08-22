<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

    checkedItems.value = Object.fromEntries(data.map((item) => [item.idx, false]))
  } catch (e) {
    console.error('장바구니 불러오기 중 오류 발생: ', e)
  }
})

// 개별 수량 변경 핸들러 + 서버에 반영
const handleQtyChange = async (id, newQty) => {
  const item = cartItems.value.find((i) => i.idx === id)
  if (!item) return

  item.quantity = newQty

  try {
    await axios.patch(`/api/cart/${id}`, { quantity: newQty })
  } catch (e) {
    console.error('수량 변경 실패: ', e)
  }
}

// 체크 상태 변경 핸들러
const handleCheck = ({ checked, idx, product_id }) => {
  checkedItems.value[idx] = checked
}

// 장바구니 아이템 전체 선택하기
const isAllSelected = computed({
  get() {
    // 모든 장바구니 아이템이 체크된 상태라면 전체선택 체크박스도 체크됨
    return (
      cartItems.value.length > 0 && cartItems.value.every((item) => checkedItems.value[item.idx])
    )
  },
  set(val) {
    // 전체선택 체크박스를 클릭했을 때 -> 모든 항목을 체크/해제
    cartItems.value.forEach((item) => {
      checkedItems.value[item.idx] = val
    })
  },
})

// 선택된 장바구니 아이템 개수
const selectedCount = computed(() => Object.values(checkedItems.value).filter(Boolean).length)

// 선택된 장바구니 아이템 삭제
const deleteSelected = async () => {
  // 체크된 idx 목록
  const selectedIdxs = Object.entries(checkedItems.value)
    .filter(([_, checked]) => checked)
    .map(([idx]) => Number(idx))

  // idx -> product_id 변환
  const selectedProductIds = selectedIdxs
    .map((idx) => {
      const item = cartItems.value.find((i) => i.idx === idx)
      return item?.product_id
    })
    .filter(Boolean) // 혹시 null/undefined 제거

  try {
    // product_id 배열을 API에 전송
    await api.toggleInCart(selectedProductIds)

    // 삭제 후 프론트에서도 제거
    cartItems.value = cartItems.value.filter(
      (item) => !selectedProductIds.includes(item.product_id),
    )

    // 체크 상태도 정리
    for (const idx of selectedIdxs) {
      delete checkedItems.value[idx]
    }
  } catch (e) {
    console.error('삭제 실패: ', e)
  }
}

// 개별 아이템 삭제
const deleteItem = async ({ productId, idx }) => {
  try {
    await api.toggleInCart([productId])

    // 프론트에서도 제거
    cartItems.value = cartItems.value.filter((item) => item.idx !== idx)

    // 체크박스 상태도 같이 제거
    delete checkedItems.value[idx]
  } catch (e) {
    console.error('삭제 실패: ', e)
  }
}

// 선택된 장바구니 아이템 총 가격
const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    // 체크되지 않은 상품은 제외
    if (!checkedItems.value[item.idx]) {
      return sum
    }

    // 할인된 가격 계산
    const discounted = Math.round((item.original_price * (100 - item.discount_rate)) / 100)
    // 수량까지 곱하기
    return sum + discounted * item.quantity
  }, 0)
})

const router = useRouter()

// 결제 페이지로 이동
const goToPayment = () => {
  router.push('/payment')
}

// 쇼핑 페이지로 이동
const goToShopping = () => {
  router.push('/shopping')
}
</script>

<template>
  <div class="mypage-my-cart-items-list-container" v-if="cartItems.length > 0">
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
          @update:quantity="(newQty) => handleQtyChange(item.idx, newQty)"
          @toggle-check="handleCheck"
          @delete-item="deleteItem"
        />
      </div>

      <div class="mypage-cart-in-items-total-price-container">
        <p>상품 {{ totalPrice.toLocaleString() }}원 + 배송비 무료</p>
        <span>{{ totalPrice.toLocaleString() }}원</span>
      </div>
    </div>

    <button @click="goToPayment" class="cart-in-products-order-go">주문하러 가기</button>
  </div>
  <div v-else class="empty-cart-message">
    장바구니에 담긴 상품이 없습니다.
    <button @click="goToShopping">상품 담으러 가기</button>
    </div>
</template>

<style scoped>
.mypage-cart-in-items-total-price-container {
  background-color: #f8f8f8;
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
