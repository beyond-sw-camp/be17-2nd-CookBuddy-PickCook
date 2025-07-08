<script setup>
const props = defineProps({
    order: Object
})

// 총 가격 계산
const totalPrice = props.order.products.reduce((acc, cur) => acc + cur.price, 0)

function statusClass(status) {
  switch (status) {
    case '상품준비중':
      return 'preparing-product'
    case '배송중':
      return 'in-delivery-product'
    case '배송완료':
      return 'delivery-completed-product'
    default:
      return ''
  }
}
</script>

<template>
  <div class="mypage-main-my-order-boards">
    <div class="mypage-my-order-boards-top">
      <div class="mypage-my-order-boards-top-left">
        <p>주문번호 :  {{ order.orderNumber }} <span>· {{ order.orderDate }}</span></p>
      </div>
      <div class="mypage-my-order-boards-top-right">
        <!-- 태그 종류는 3개, 상품준비중(preparing-product, in-delivery-product, delivery-completed-product) -->
        <div :class="['order-status-code-tag', statusClass(order.status)]">
          <span>{{ order.status }}</span>
        </div>
      </div>
    </div>

    <div class="mypage-my-order-boards-mid">
      <div 
        class="mypage-my-order-boards-el"
        v-for="product in order.products"
        :key="product.id"
        >
        <div class="mypage-my-order-boards-el-left">
          <img
            :src="product.image"
            alt="상품 이미지"
          />
          <div class="mypage-my-order-boards-product-content">
            <p>{{ product.name }}</p>
            <span>{{ product.quantityText }}</span>
          </div>
        </div>
        <div class="mypage-my-order-boards-el-right">
          <div class="mypage-my-order-boards-product-price"> {{ product.price.toLocaleString() }}원</div>
        </div>
      </div>
    </div>

    <div class="mypage-my-order-boards-bottom">
      <div class="mypage-my-order-boards-bottom-left">
        <p>총 결제금액</p>
      </div>
      <div class="mypage-my-order-boards-bottom-right">
        <p>{{ totalPrice.toLocaleString() }}원</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
