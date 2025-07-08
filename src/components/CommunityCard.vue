<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <RouterLink :to="`/community/${post.id}`" class="c-board-link">
    <div class="c-board">
      <div class="c-board-type">
        <span class="c-board-type-text">{{ post.type }}</span>
      </div>
      <div class="c-board-flexbox">
        <div class="c-board-details">
          <div class="title">
            <span>{{ post.title }}</span>
          </div>
          <div class="c-board-content">
            <span>{{ post.content }}</span>
          </div>
          <div class="c-board-info">
            <span class="c-board-nickname">{{ post.nickname }}</span>
            <span class="c-board-dot"></span>
            <span class="c-board-createdat">{{ post.createdAt }}</span>
            <span class="c-board-dot"></span>
            <span class="c-board-comments">댓글 {{ post.comments }}</span>
            <span class="c-board-dot"></span>
            <span class="c-board-likes">좋아요 {{ post.likes }}</span>
          </div>
        </div>
        <div class="c-board-image-container">
          <img class="c-board-image" :src="post.imageUrl" />
        </div>
      </div>
    </div>
    <hr class="c-board-border" />
  </RouterLink>
</template>

<style lang="">
    
</style>