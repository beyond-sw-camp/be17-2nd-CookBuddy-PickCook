<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/community' 

const route = useRoute()
const post = reactive({
  title: '',
  author: '',
  updatedAt: '',
  images: [],
  contents: [],
  tags: [],
  likes: 0,
  scraps: 0,
  comments: [],
})

const getDetail = async () => {
  const id = route.params.id
  const data = await api.communityDetail(id)
  if (data && data.success && data.result) {
    Object.assign(post, data.result)
  }
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <main class="cd-main-container">
    <!-- 제목 섹션 -->
    <div class="cd-title-section">
      <h1 class="cd-post-title">{{ post.title }}</h1>
      <div class="cd-author-info">
        <div class="cd-author-left">
          <div class="cd-author-avatar"></div>
          <div class="cd-author-details">
            <div class="cd-author-name">{{ post.author }}</div>
            <div class="cd-post-date">마지막 수정일자 {{ post.updatedAt }}</div>
          </div>
        </div>
        <button class="cd-follow-btn">팔로우</button>
      </div>
    </div>

    <!-- 이미지 + 텍스트 섹션 -->
    <div class="cd-image-container" v-for="(img, i) in post.images" :key="i">
      <div class="cd-post-image">
        <img :src="img" alt="게시글 이미지" />
      </div>
      <div class="cd-text-content">
        <p>{{ post.contents[i] }}</p>
      </div>
    </div>

    <!-- 액션 바 -->
    <div class="cd-action-bar">
      <div class="cd-action-left">
        <button class="cd-action-btn">❤️ 좋아요 {{ post.likes }}</button>
        <button class="cd-action-btn">🔖 스크랩 {{ post.scraps }}</button>
        <button class="cd-action-btn">💬 댓글 {{ post.comments.length }}</button>
      </div>
      <button class="cd-action-btn">↗️ 공유하기</button>
    </div>

    <!-- 태그 -->
    <div class="cd-tags">
      <a v-for="(tag, i) in post.tags" :key="i" href="#" class="tag">#{{ tag }}</a>
    </div>

    <!-- 댓글 섹션 -->
    <div class="cd-comment-section">
      <div class="cd-comment-header">
        <h2 class="cd-comment-title">댓글 <span class="cd-comment-count">{{ post.comments.length }}</span></h2>
      </div>

      <!-- 댓글 리스트 -->
      <div class="cd-comment-list">
        <div v-for="(c, i) in post.comments" :key="i" class="cd-comment-item">
          <div class="cd-comment-avatar"></div>
          <div class="cd-comment-content">
            <div class="cd-comment-author">{{ c.author }}</div>
            <div class="cd-comment-text">{{ c.text }}</div>
            <div class="cd-comment-meta">
              <span>{{ c.time }}</span>
              <span class="cd-comment-action">좋아요 {{ c.likes || 0 }}</span>
              <span class="cd-comment-action">답글달기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <aside class="cd-sidebar">
    <button class="cd-sidebar-btn">❤️</button>
    <button class="cd-sidebar-btn">🔖</button>
  </aside>
</template>

<style scoped>

</style>