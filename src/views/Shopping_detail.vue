<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import shoppingAPI from "@/api/shopping";

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const currentImageIndex = ref(0)
const activeTab = ref('info')

const productId = computed(() => route.params.id)

onMounted(async () => {
    try {
        console.log('상품 ID:', productId.value)
        product.value = await shoppingAPI.getProductDetail(productId.value)
        console.log('받은 상품 데이터:', product.value)
    } catch (error) {
        console.error('상품 상세 로딩 실패:', error)
        alert('상품을 찾을 수 없습니다.')
    } finally {
        loading.value = false
    }
})

// 이미지 변경
const changeMainImage = (index) => {
  currentImageIndex.value = index
}

// 탭 변경
const switchTab = (tab) => {
  activeTab.value = tab
}

</script>

<template>

<div v-if="loading" class="loading">
  상품 정보를 불러오는 중...
</div>

<div v-else-if="product" class="shopping-detail-container">
    <div class="shopping-detail-row">
        <!-- 좌측 이미지 영역 -->
        <div class="shopping-detail-col-half">
            <!-- 메인 이미지 -->
            <div class="main-image" 
                :style="`background-image: url('${product.images ? product.images[currentImageIndex] : product.image}')`">
            </div>

            <!-- 썸네일 -->
            <div v-if="product.images && product.images.length > 1" class="thumbnail-container">
                <div 
                    v-for="(image, index) in product.images" 
                    :key="index"
                    class="thumbnail"
                    :class="{ active: currentImageIndex === index }"
                    :style="`background-image: url('${image}')`"
                    @click="changeMainImage(index)"
                >
                </div>
            </div>
        </div>

        <!-- 우측 상품 정보 -->
        <div class="shopping-detail-col-half">
            <h5 class="brand-name">{{ product.detailInfo?.brand || '브랜드명' }}</h5>
            <h2 class="product-title">{{ product.title }}</h2>

            <!-- 별점 -->
            <div class="mb-2">
                <span class="product-rate">
                    <i v-for="n in 5" :key="n" 
                       class="fas fa-star"
                       style="color: #ffc107;">
                    </i>
                </span>
                <span class="text-muted">{{ product.rating }} (리뷰 {{ product.reviewCount?.toLocaleString() }})</span>
            </div>

            <!-- 서브 설명 -->
            <p class="text-secondary">{{ product.description }}</p>

            <!-- 가격 정보 -->
            <div class="mb-3">
                <span class="discount-rate">{{ product.discount }}%</span>&nbsp;
                <span class="fs-4 fw-bold text-primary">{{ product.price?.toLocaleString() }}원</span>&nbsp;
                <span class="text-decoration-line-through text-muted">{{ product.originalPrice?.toLocaleString() }}원</span>
            </div>

            <!-- 상세 정보 리스트 -->
            <ul class="text-muted">
                <li>브랜드: {{ product.detailInfo?.brand || '-' }}</li>
                <li>원산지: {{ product.detailInfo?.origin || '-' }}</li>
                <li>중량: {{ product.detailInfo?.weight || '-' }}</li>
                <li>보관: {{ product.detailInfo?.storage || '-' }}</li>
            </ul>

            <!-- 태그 -->
            <div v-if="product.tags" class="tags">
                <span v-for="tag in product.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
        </div>
    </div>

    <!-- 상품 정보 섹션 (탭 제거, 모든 정보 한 번에 표시) -->
    <div class="product-info-section">
        <h3>상세 정보</h3>
        <p>{{ product.description }}</p>
        
        <div v-if="product.ingredients" class="ingredients">
            <h4>구성품</h4>
            <ul>
                <li v-for="ingredient in product.ingredients" :key="ingredient">
                    {{ ingredient }}
                </li>
            </ul>
        </div>

        <div v-if="product.reviews" class="reviews">
            <h4>고객 리뷰</h4>
            <div v-for="review in product.reviews" :key="review.userId" class="review-item">
                <div class="review-header">
                    <span class="reviewer">{{ review.userId }}</span>
                    <span class="review-rating">★ {{ review.rating }}</span>
                    <span class="review-date">{{ review.date }}</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
            </div>
        </div>
    </div>
</div>

<div v-else class="error">
  상품을 찾을 수 없습니다.
</div>
</template>

<style scoped>

</style>