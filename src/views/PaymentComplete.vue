<script setup>
import { onMounted, ref } from 'vue'
import lottie from 'lottie-web'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const lottieContainer = ref(null)

onMounted(() => {
  lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/assets/animations/bqh4dsxhG0.json',
    path: '/assets/animations/bqh4dsxhG0.json',
  })
})

// 쇼핑 페이지로 이동
const goToShopping = () => {
  router.push('/products')
}

function goOrderDetail() {
  const pathParts = route.path.split('/');
  const orderId = pathParts[pathParts.length - 1];
  router.push(`/order/details/${orderId}`);
}
</script>

<template>
  <div class="payment-complete-page-body">
  <div class="payment-complete-page-body">
    <div class="payment-complete-contents-container">
      <div>
        <div ref="lottieContainer" class="lottie-image"></div>
        <h3>주문이 완료되었습니다.</h3>
        <p>고객님의 <span>맛있는 한 끼</span>를 위해 빠르게 배송해드릴게요.</p>
      <div>
        <div ref="lottieContainer" class="lottie-image"></div>
        <h3>주문이 완료되었습니다.</h3>
        <p>고객님의 <span>맛있는 한 끼</span>를 위해 빠르게 배송해드릴게요.</p>

        <div class="payment-complete-buttons-container">
          <button @click="goOrderDetail" class="order-detail-page-go">주문 상세보기</button>
          <button @click="goToShopping" class="shopping-continue-go">쇼핑 계속하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-complete-page-body {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 30px;
}

.payment-complete-contents-container {
  background-color: white;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 20px 0 100px;
}

.lottie-image {
  width: 230px;
  height: 230px;
}

.payment-complete-contents-container > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.payment-complete-contents-container h3 {
  font-weight: 500;
}

.payment-complete-contents-container span {
  color: var(--color-primary);
  font-weight: 500;
  font-weight: 600;
}

.payment-complete-contents-container p {
  font-size: 14px;
}

.payment-complete-buttons-container {
  display: flex;
  gap: 22px;
  margin-top: 30px;
}

.payment-complete-buttons-container button {
  background-color: #f1f1f1;
  border-radius: 25px;
  border: none;
  padding: 15px 50px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.payment-complete-buttons-container button:hover {
  background-color: #e9e9e9;
}
</style>
