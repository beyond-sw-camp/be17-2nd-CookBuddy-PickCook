<script setup>
import api from '@/api/community'
import { onMounted, reactive } from 'vue'
import PostListCard from '@/components/PostListCard.vue'

const posts = reactive([])

const getPostList = async () => {
  const data = await api.getPostList()
  if (data && data.success && data.results) {
    posts.push(...data.results)
  } else {
    posts.splice(0)
  }
}

onMounted(() => {
  getPostList()
})
</script>

<template>
  <!-- 필터 섹션 -->
  <div class="filter-section">
    <div class="filter-container">
      <span class="filter-tag">정렬 &nbsp;▼</span>
      <span class="filter-tag">분류 &nbsp;▼</span>
    </div>
  </div>

  <!-- 컨텐츠 섹션 -->
  <div class="content-section">
    <div class="c-content-container">
      <p class="c-posts-count">전체 {{ posts.length }}개</p>
      <PostListCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<style scoped></style>
