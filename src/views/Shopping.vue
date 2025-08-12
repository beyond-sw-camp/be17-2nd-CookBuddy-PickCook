<script setup>
import { reactive, onMounted, ref } from 'vue'
import shoppingAPI from '@/api/shopping'
import ProductItemCard from '@/components/ProductItemCard.vue'

const products = reactive({
  allProducts: [],
})

const loading = ref(false)

onMounted(async () => {
  loading.value = true // 로딩 시작
  try {
    products.allProducts = await shoppingAPI.getAllProducts()
  } catch (error) {
    console.error('데이터 로딩 실패:', error)
  } finally {
    loading.value = false // 로딩 끝
  }
})
</script>

<template>
  <div class="content-section">
    <div class="shopping-category-section">
      <div class="shopping-category-grid">
        <span class="shopping-category-1 c-hover-1">오늘의 특가</span>
        <span class="shopping-category-1 c-hover-1">새벽배송</span>
        <span class="shopping-category-1 c-hover-1">유기농 전용관</span>
        <span class="shopping-category-1 c-hover-1">비건 전용관</span>
        <span class="shopping-category-1 c-hover-1">다이어트 전용관</span>

        <span class="shopping-category c-hover-2">
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-vegetable.png"
            alt=""
          />
          <span class="padding">채소</span>
        </span>
        <span class="shopping-category c-hover-2">
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-meat.png"
            alt=""
          />
          <span class="padding">육류</span>
        </span>
        <span class="shopping-category c-hover-2">
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-fish.png"
            alt=""
          />
          <span class="padding">해산물</span>
        </span>
        <span class="shopping-category c-hover-2">
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-dessert.png"
            alt=""
          />
          <span class="padding">베이킹</span>
        </span>
        <span class="shopping-category c-hover-2">
          <img
            class="shopping-ingredient-item-image"
            src="/assets/icons/ic-ingredient-category-milk.png"
            alt=""
          />
          <span class="padding">유제품</span>
        </span>
      </div>
    </div>
    <!-- 필터 섹션 -->
    <div class="shopping-filter-section">
      <div class="filter-container">
        <span class="filter-tag">판매량 &nbsp;▼</span>
        <span class="filter-tag">상품평 &nbsp;▼</span>
        <span class="filter-tag">신제품 &nbsp;▼</span>
        <span class="filter-tag">가격 높은순 &nbsp;▼</span>
        <span class="filter-tag">가격 낮은순 &nbsp;▼</span>
      </div>
    </div>
    <div v-if="loading" class="loading">상품을 불러오는 중...</div>
    <div v-else class="content-grid">
      <ProductItemCard
        v-for="product in products.allProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped>
.shopping-filter-section {
  padding-bottom: 10px;
  /* border-top: 1px solid #eaedef; */
}

.shopping-category-section {
  display: flex;
  justify-content: center;
  margin: 20px 0px 20px 0px;
  border: 2px solid #eaedef;
  border-radius: 10px;
  padding: 15px 0px 15px 0px;
  background-color: white;
}

.shopping-category-grid {
  display: grid;
  grid-template-columns: repeat(5, 115px);
  row-gap: 20px;
  column-gap: 100px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.shopping-category-grid > span {
  cursor: pointer;
}

.shopping-category {
  font-weight: 450;
  color: #929596;
  padding: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-bottom: 1px solid #eaedef; */
  /* padding-bottom: 5px; */
}

.shopping-category-1 {
  font-weight: 450;
  color: #929596;
  padding: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-bottom: 1px solid #eaedef; */
  /* padding-bottom: 5px; */
}

.c-hover-1:hover {
  font-weight: 450;
  color: #ab282d;
  transform: translateY(-1.5px);
}

.c-hover-2:hover {
  font-weight: 500;
  color: #2e80cd;
  transform: translateY(-1.5px);
}

.shopping-ingredient-item-image {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.padding {
  padding-left: 10px;
}
</style>
