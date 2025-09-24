<script setup>
import { computed } from 'vue'
import StarRating from './StarRating.vue'
import api from '@/api/review'

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['deleted'])

const handleDelete = async () => {
  if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) return

  const res = await api.deleteReview(props.review.reviewId)

  if (res.success) {
    alert('리뷰가 삭제되었습니다.')
    emit('deleted', props.review.reviewId) // 부모 컴포넌트에 알림
  } else {
    alert(res.message || '리뷰 삭제에 실패했습니다.')
  }
}

// 날짜 포맷팅 (백엔드에서 yyyy.MM.dd로 내려주면 그대로 써도 됨)
const formattedDate = computed(() => props.review.createdAt)
</script>

<template>
  <div class="review-items-container">
    <!-- 상품명 클릭 시 상품 상세 이동 -->
    <div
      class="review-item-product-go-container"
      @click="$router.push(`/products/detail/${review.productId}`)"
    >
      <p>{{ review.productName }}</p>
      <img src="/assets/icons/ic-arrow-right.png" alt="상품 보러가기" />
    </div>

    <div class="review-item-container-head">
      <div class="review-item-container-head-left">
        <StarRating :model-value="review.rating" :readonly="true" />
        <span>{{ formattedDate }}</span>
      </div>
      <div class="review-item-container-head-right" v-if="review.isMyReview">
        <span class="delete-btn" @click="handleDelete">삭제</span>
      </div>
    </div>

    <div class="review-item-content">
      {{ review.content }}
    </div>

    <!-- 이미지 영역 -->
    <div class="review-item-image-container" v-if="review.images && review.images.length > 0">
      <img
        v-for="img in review.images"
        :key="img.imageId"
        :src="img.imageUrl"
        :alt="img.originalFilename"
        class="review-image"
      />
    </div>
  </div>
</template>

<style scoped>
.review-items-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 18px;
  margin-bottom: 15px;
  border-bottom: 1px solid #efefef;
}

.review-item-product-go-container,
.review-item-container-head {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 6px;
}

.review-item-product-go-container {
  cursor: pointer;
}

.review-item-container-head {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}

.review-item-product-go-container > p {
  font-weight: 500;
  font-size: 15px;
}

.review-item-product-go-container > img {
  width: 18px;
  height: 18px;
  margin-top: 3px;
}

.review-item-container-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-item-container-head-left > span,
.review-item-container-head-right > span {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-dark-strong);
}

.review-item-container-head-right > span {
  padding: 4px 8px;
  background-color: #f3f3f3;
  border-radius: 5px;
  cursor: pointer;
}

.star-rating {
  font-size: 18px;
}

.review-item-content {
  padding: 18px 5px;
  font-size: 15px;
  color: #151515;
}

.review-item-image-container {
  display: flex;
  gap: 8px;
  padding: 5px;
  overflow-x: auto;
}

.review-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}
</style>
