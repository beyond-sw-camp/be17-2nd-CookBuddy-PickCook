<script setup>
const props = defineProps({
  post: Object,
  showActions: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="mypage-main-my-activity-boards">
    <div class="mypage-my-activity-boards-el">
      <div class="mypage-my-activity-boards-left">
        <img :src="post.image" alt="커뮤니티 대표 이미지" />
        <div class="mypage-my-activity-boards-content">
          <p>{{ post.title }}</p>
          <p>{{ post.content }}</p>
          <span
            >{{ post.createdAt }} · 조회 {{ post.views }} · 좋아요 {{ post.likes }}개 ·
            댓글 {{ post.comments }}개</span
          >
        </div>
      </div>
      <div v-if="showActions" class="mypage-my-activity-boards-right">
        <div class="mypage-my-activity-boards-edit-button">수정</div>
        <div class="mypage-my-activity-boards-delete-button">삭제</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
