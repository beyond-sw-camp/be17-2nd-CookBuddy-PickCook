<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true }, // 현재 페이지 (0부터 시작)
  totalPages: { type: Number, required: true }, // 전체 페이지 수
})

const emit = defineEmits(['changePage'])

// 한 번에 보여줄 페이지 버튼 개수
const maxButtons = 5

// 현재 블록(start ~ end) 계산
const pageRange = computed(() => {
  const start = Math.floor(props.currentPage / maxButtons) * maxButtons + 1
  const end = Math.min(start + maxButtons - 1, props.totalPages)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 페이지 이동 함수
const goToPage = (page) => {
  if (page >= 0 && page < props.totalPages) {
    emit('changePage', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="pagination">
    <!-- 맨 처음 -->
    <button @click="goToPage(0)" :disabled="props.currentPage === 0">«</button>

    <!-- 이전 -->
    <button @click="goToPage(props.currentPage - 1)" :disabled="props.currentPage === 0">‹</button>

    <!-- 페이지 번호 -->
    <button
      v-for="page in pageRange"
      :key="page"
      @click="goToPage(page - 1)"
      :class="{ active: page - 1 === props.currentPage }"
    >
      {{ page }}
    </button>

    <!-- 다음 -->
    <button
      @click="goToPage(props.currentPage + 1)"
      :disabled="props.currentPage === props.totalPages - 1"
    >
      ›
    </button>

    <!-- 맨 끝 -->
    <button
      @click="goToPage(props.totalPages - 1)"
      :disabled="props.currentPage === props.totalPages - 1"
    >
      » 
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 16px;
}

.pagination button {
  padding: 6px 10px;
  border-radius: 4px;
  background-color: #e5e7eb;
  color: #565656;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: var(--color-primary);
  color: #fff;
}

.pagination button:hover:not(:disabled):not(.active) {
  background-color: #d1d5db;
}
</style>
