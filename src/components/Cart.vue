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
  // 테스트용 가짜 데이터
  // const data = [
  //   {
  //     id: 1,
  //     image:
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT27Los4nLM2-D2RPgfiSLhyaOzVhpZWSE6UQ&s',
  //     title: '냠냠냠냠 맛있는 초코 쿠키',
  //     description: '촉촉한 초코칩 쿠키 / 5개입',
  //     beforePrice: 30000,
  //     price: 20000,
  //     qty: 2,
  //   },
  //   {
  //     id: 2,
  //     image:
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcfXxJjrXtm6banruS10jA-rl1SMgxjxWoxg&s',
  //     title: '내가 직접 만들어 더 맛있는 수제 쿠키',
  //     description: '초코맛 / 4인분',
  //     beforePrice: 50000,
  //     price: 40000,
  //     qty: 1,
  //   },
  // ]
  try {
    const data = await api.cartList()
    cartItems.value = data

    // 체크박스 초기 상태 설정 (모두 false)
    // Object.fromEntries() : 배열 -> 객체
    // Object.entries() : 객체 -> 배열
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
    <div class="my-cart-all-select-box-container">
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

    <!-- 장바구니 아이템 리스트 -->
    <div class="mypage-main-content-scroll">
      <CartItemCard
        v-for="item in cartItems"
        :key="item.cart_item_id"
        :item="item"
        :is-checked="checkedItems[item.cart_item_id]"
        @update:quantity="(newQty) => handleQtyChange(item.cart_item_id, newQty)"
        @toggle-check="(checked) => handleCheck(item.cart_item_id, checked)"
      />
    </div>
  </div>
</template>

<style scoped></style>
