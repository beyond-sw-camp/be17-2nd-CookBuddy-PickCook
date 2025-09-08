<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>
<template>
  <RouterLink :to="`/community/${post.id}`" class="c-board-link">
    <div class="c-board">
      <div class="c-board-type">
        <span class="c-board-type-text">일반</span>
      </div>
      <div class="c-board-flexbox">
        <div class="c-board-details">
          <div class="title">
            <span>{{ post.title }}</span>
          </div>
          <div class="c-board-content">
            <span>{{ post.contentPreview }}</span>
          </div>
          <div class="c-board-info">
            <span class="c-board-nickname">{{ post.authorName }}</span>
            <span class="c-board-dot"></span>
            <span class="c-board-createdat">{{ post.createdAgo }}</span>
            <span class="c-board-dot"></span>
            <span class="c-board-comments">댓글 {{ post.comments }}</span>
            <span class="c-board-dot"></span>
            <span class="c-board-likes">좋아요 {{ post.likeCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <hr class="c-board-border" />
  </RouterLink>
</template>

<style>
.c-board {
  /* background-color: white; */
  /* padding: 12px 18px; */
  margin: 10px 5px;
}

.title {
  font-size: 14px;
}

.c-board-content > span {
  font-size: 14px;
  color: var(--color-dark-strong);
}
</style>
