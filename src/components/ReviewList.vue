<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/review'
import ReviewItemCard from './ReviewItemCard.vue'

const reviews = ref([])
const totalCount = ref(0)
const loading = ref(false)

const fetchMyReviews = async () => {
  loading.value = true
  try {
    const res = await api.getMyReviews({
      page: 0,
      size: 10,
      sortType: 'RECENT'
    })

    reviews.value = res.results.reviews
    totalCount.value = res.pageInfo.totalElements
  } catch (err) {
    console.error('리뷰 불러오기 실패:', err)
  } finally {
    loading.value = false
  }
}

const handleDeleted = (reviewId) => {
  reviews.value = reviews.value.filter(r => r.reviewId !== reviewId)
}

onMounted(() => {
  fetchMyReviews()
})
</script>

<template>
  <div class="mypage-my-order-list-container">
    <div class="mypage-body-box">
      <h2>내가 쓴 리뷰 총 {{ reviews.length }}개</h2>
      <div class="mypage-main-content-scroll">
        <ReviewItemCard
          v-for="review in reviews"
          :key="review.reviewId"
          :review="review"
          @deleted="handleDeleted"
        />
        <div v-if="loading" class="loading-text">로딩 중...</div>
        <div v-if="!loading && reviews.length === 0" class="empty-text">
          작성한 리뷰가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.mypage-body-box {
    padding: 20px 22px;
}

.mypage-body-box > h2 {
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid black;
    padding-left: 4px;
    padding-bottom: 12px;
    margin-bottom: 10px;
}



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
  width: 125px;
  font-size: 15px;
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
  font-size: 15px;
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

.mypage-main-content-scroll {
  max-height: 600px; /* 필요에 따라 조정 */
  overflow-y: auto;
  padding: 10px 0;
}

.loading-text,
.empty-text {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
