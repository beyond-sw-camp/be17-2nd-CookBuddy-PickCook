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
  }
}
</script>

<template>
  <div
    class="pagination"
    style="display: flex; justify-content: center; gap: 4px; margin-top: 16px"
  >
    <!-- 맨 처음 -->
    <button @click="goToPage(0)" :disabled="props.currentPage === 0">«</button>

    <!-- 이전 -->
    <button @click="goToPage(props.currentPage - 1)" :disabled="props.currentPage === 0">‹</button>

    <!-- 페이지 번호 -->
    <button
      v-for="page in pageRange"
      :key="page"
      @click="goToPage(page - 1)"
      :style="{
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: page - 1 === props.currentPage ? '#3b82f6' : '#e5e7eb',
        color: page - 1 === props.currentPage ? '#fff' : '#000',
      }"
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
