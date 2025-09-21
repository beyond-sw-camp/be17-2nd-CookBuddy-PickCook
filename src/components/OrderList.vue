<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import OderProductItemCard from './OderProductItemCard.vue'
import { useRouter } from 'vue-router'
import api from '@/api/payment'

const orders = reactive([])
const router = useRouter()

const pageResponse = reactive({
  content: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 4,
  hasNext: true,
})

const isLoading = ref(false) // 요청 중복 방지

const options = ['3개월', '6개월', '1년', '3년']
const selected = ref('3개월')
const isOpen = ref(false)

const periodMap = {
  '3개월': '3M',
  '6개월': '6M',
  '1년': '1Y',
  '3년': '3Y',
}

const getOrderList = async (period = '3M', page = 0) => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const data = await api.orderList(period, page, pageResponse.size)

    if (data && data.success && data.results) {
      const newOrders = data.results.content

      if (page === 0) {
        // 처음 불러올 때 초기화
        orders.splice(0, orders.length, ...newOrders)
      } else {
        // 다음 페이지 이어붙이기
        orders.push(...newOrders)
      }

      // 페이지 정보 갱신
      pageResponse.content = orders
      pageResponse.currentPage = data.results.currentPage
      pageResponse.totalPages = data.results.totalPages
      pageResponse.totalElements = data.results.totalElements
      pageResponse.size = data.results.size
      pageResponse.hasNext = data.results.hasNext ?? false
    } else if (page === 0) {
      // 데이터 없을 때 초기화
      orders.splice(0)
      pageResponse.content = []
      pageResponse.totalPages = 0
      pageResponse.totalElements = 0
      pageResponse.hasNext = false
    }
  } finally {
    isLoading.value = false
  }
}

const handleScroll = () => {
  if (!pageResponse.hasNext || isLoading.value) return

  // 화면 끝까지 스크롤 시 다음 페이지 요청
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    getOrderList(periodMap[selected.value], pageResponse.currentPage + 1)
  }
}

onMounted(() => {
  getOrderList()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const selectOption = (option) => {
  selected.value = option
  isOpen.value = false
  getOrderList(periodMap[option], 0) // 페이지 0부터 다시 요청
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const goToShopping = () => {
  router.push('/products')
}
</script>

<template>
  <div class="mypage-my-order-list-container" v-if="orders.length > 0">
    <div class="mypage-header-box">
      <div class="mypage-header-box-title">주문 내역</div>

      <div class="mypage-my-order-list-search-container">
        <div class="dropdown" @click="toggleDropdown" @blur="closeDropdown" tabindex="0">
          <div class="dropdown-toggle">
            {{ selected }}
            <span class="arrow" :class="{ open: isOpen }">▼</span>
          </div>
          <div class="dropdown-menu" v-if="isOpen">
            <div
              v-for="option in options"
              :key="option"
              class="dropdown-item"
              @click.stop="selectOption(option)"
            >
              {{ option }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mypage-body-box">
      <!-- 주문내역 리스트 -->
      <div class="mypage-main-content-scroll">
        <OderProductItemCard
          v-for="order in orders"
          :key="order.orderNumber"
          :order="order"
          :show-buttons="false"
        />
      </div>
    </div>
  </div>

  <div v-else class="empty-order-list-message">
    주문 내역이 없습니다.
    <button @click="goToShopping">상품 구경하러 가기</button>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
  width: 100px;
  font-family: sans-serif;
  user-select: none;
  outline: none;
  font-size: 15px;
}

.dropdown-toggle {
  background-color: white;
  padding: 10px 15px;
  border: 1px solid var(--color-light-gray);
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  font-size: 15px;
}

@media (max-width: 1023px) {
  .dropdown-toggle {
    font-size: 14px;
    width: 90px;
  }

  .arrow {
    font-size: 12px;
    margin-top: 1px;
  }
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #e9e9e9;
}

.arrow {
  float: right;
  transition: transform 0.2s;
}

.arrow.open {
  transform: rotate(180deg);
}
</style>
