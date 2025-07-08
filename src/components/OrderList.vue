<script setup>
import { ref, onMounted, computed } from 'vue'
import OderProductItemCard from './OderProductItemCard.vue'

// 주문 목록 데이터
const orders = ref([])

// 주문 상태별 카운트 계산
const statusCounts = computed(() => {
  const counts = {
    상품준비중: 0,
    배송중: 0,
    배송완료: 0,
    '취소/반품': 0,
  }

  for (const order of orders.value) {
    if (counts[order.status] !== undefined) {
      counts[order.status]++
    }
  }

  return counts
})

// 서버에서 주문 내역 받아오기 (테스트용)
const fetchOrders = async () => {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          orderNumber: '20240706-0000001',
          orderDate: '2024.07.06',
          status: '상품준비중',
          products: [
            {
              id: 1,
              name: '프렌치 토스트 밀키트',
              quantityText: '2인분 / 1개',
              image:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo4Jinz57LhP8UclbLg255t0uVGnnKyQVprA&s',
              price: 8900,
            },
            {
              id: 2,
              name: '핫도그 세트',
              quantityText: '1인분 / 2세트',
              image:
                'https://static.wtable.co.kr/image/production/service/recipe/1793/78e41de9-7045-41e0-8a44-6cbbcd65ddd5.jpg?size=800x800',
              price: 12000,
            },
          ],
        },
        {
          orderNumber: '20240705-0000002',
          orderDate: '2024.07.05',
          status: '배송완료',
          products: [
            {
              id: 3,
              name: '치즈 닭갈비',
              quantityText: '3인분 / 1팩',
              image:
                'https://d1nzxr3h07h50a.cloudfront.net/assets/prod/product/ce2f7347-f96f-4049-9661-08a585edd503.jpg',
              price: 15500,
            },
            {
              id: 4,
              name: '치즈 닭갈비',
              quantityText: '3인분 / 1팩',
              image:
                'https://d1nzxr3h07h50a.cloudfront.net/assets/prod/product/ce2f7347-f96f-4049-9661-08a585edd503.jpg',
              price: 15500,
            },
          ],
        },
      ])
    }, 500) // 0.5초 딜레이로 비동기 흉내
  })

  orders.value = response
}

// 화면 로딩 시 주문 데이터 불러오기
onMounted(() => fetchOrders())


const options = ['3개월', '6개월', '1년', '3년']
const selected = ref('3개월')
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = (option) => {
  selected.value = option
  isOpen.value = false
  console.log('선택된 값:', option)
}
</script>

<template>
  <div class="mypage-my-order-list-container">
    <div class="mypage-header-box">
      <div class="mypage-header-box-title">
        주문 내역
      </div>

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
        <div class="mypage-my-order-list-search-bar-container">
          <img src="#!" alt="돋보기" />
          <input type="text" placeholder="상품명으로 검색해보세요."/>
        </div>
      </div>
    </div>

    <div class="mypage-body-box">
      
    <!-- 주문내역 리스트 -->
      <div class="mypage-main-content-scroll">
        <OderProductItemCard v-for="order in orders" :key="order.orderNumber" :order="order" />
      </div>
    </div>
    
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
}

.dropdown-toggle {
  background-color: white;
  padding: 10px 15px;
  border: 1px solid var(--color-light-gray);
  border-radius: 5px;
  cursor: pointer;
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
