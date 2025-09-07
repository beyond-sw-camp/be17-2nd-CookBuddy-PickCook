<script setup>
import { reactive, onMounted } from 'vue'
import api from '@/api/shopping'
import ProductItemCard from '@/components/ProductItemCard.vue'
import Pagination from '@/components/Pagination.vue'

const products = reactive([])
const pageResponse = reactive({
  content: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 12,
})

const loadPage = (newPage) => {
  getProductList(newPage)
}

const getProductList = async (page = 0) => {
  const data = await api.getAllProducts(page, pageResponse.size)
  if (data && data.content) {
    Object.assign(products, data.content)
    pageResponse.content = data.content
    pageResponse.currentPage = data.currentPage
    pageResponse.totalPages = data.totalPages
    pageResponse.totalElements = data.totalElements
    pageResponse.size = data.size
  } else {
    products.splice(0)
    pageResponse.content = []
    pageResponse.totalPages = 0
    pageResponse.totalElements = 0
  }
}

onMounted(() => {
  getProductList()
})
</script>

<template>
  <div class="content-section">
    <div class="shopping-category-section">
      <div class="shopping-category-grid">
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
    <div class="content-grid">
      <ProductItemCard v-for="(product, index) in products" :key="index" :product="product" />
    </div>
  </div>
  <Pagination
    :currentPage="pageResponse.currentPage"
    :totalPages="pageResponse.totalPages"
    @changePage="loadPage"
  />
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
