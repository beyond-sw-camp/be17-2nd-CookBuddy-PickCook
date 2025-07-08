<script setup>
import { reactive, onMounted, ref } from "vue";
import shoppingAPI from "@/api/shopping";
import Item_card from "@/components/Item_card.vue";
import Banner from '@/components/Banner.vue'  

const products = reactive({
    allProducts: []
})

const loading = ref(false)

onMounted(async () => {
    loading.value = true     // 로딩 시작
    try {
        products.allProducts = await shoppingAPI.getAllProducts()
    } catch (error) {
        console.error('데이터 로딩 실패:', error)
    } finally {
        loading.value = false  // 로딩 끝
    }
})

</script>

<template>

    <div class="content-section">
        <Banner :autoPlay="true" :autoPlayInterval="4000" />
          <!-- 필터 섹션 -->
        <div class="filter-section">
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
            <Item_card v-for="product in products.allProducts" :key="product.id" :product="product"/>
        </div>
    </div>
</template>

<style scoped>

</style>