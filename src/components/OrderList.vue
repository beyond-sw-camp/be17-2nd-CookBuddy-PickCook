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
</script>

<template>
  <div class="mypage-my-order-list-container">
    <div class="mypage-order-dashboard">
      <div class="mypage-order-dashboard-item-container">
        <div class="mypage-order-dashboard-item-each-boxes">
          <p>배송준비</p>
          <span>{{ statusCounts['상품준비중'] }}</span>
        </div>
        <div class="mypage-order-dashboard-item-each-boxes">
          <p>배송중</p>
          <span>{{ statusCounts['배송중'] }}</span>
        </div>
        <div class="mypage-order-dashboard-item-each-boxes">
          <p>배송완료</p>
          <span>{{ statusCounts['배송완료'] }}</span>
        </div>
        <div class="mypage-order-dashboard-item-each-boxes">
          <p>취소/반품</p>
          <span>{{ statusCounts['취소/반품'] }}</span>
        </div>
      </div>
    </div>

    <!-- 주문내역 리스트 -->
    <div class="mypage-main-content-scroll">
      <OderProductItemCard v-for="order in orders" :key="order.orderNumber" :order="order" />
    </div>
  </div>
</template>

<style scoped></style>
