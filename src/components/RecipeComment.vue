<script setup>
import { ref } from 'vue'
import RecipeComment from './RecipeComment.vue'
import api from '@/api/recipe'

// props
const { comment, replyId } = defineProps({
  comment: Object,
  replyId: [Number, null],
})

const emit = defineEmits(['toggle-reply', 'refresh-comments'])

// 댓글 상태
const replyText = ref('')
const replyImage = ref(null)
const hasLiked = ref(comment.hasLiked)

// 이미지 선택 핸들러
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) replyImage.value = file
}

// 좋아요 토글
const toggleLike = async () => {
  const data = await api.like({
    targetType: 'RECIPE_COMMENT',
    targetId: comment.id,
  })
  if (data.success) hasLiked.value = !hasLiked.value
}

// 대댓글 입력창 토글
const toggleReply = () => {
  emit('toggle-reply', replyId === comment.id ? null : comment.id)
}

// 대댓글 등록
const submitReply = async () => {
  if (!replyText.value.trim() && !replyImage.value) return

  const formData = new FormData()
  formData.append('content', replyText.value)
  formData.append('recipeId', recipeId)
  if (parentCommentId) formData.append('parentCommentId', parentCommentId)
  if (replyImage.value) formData.append('image', replyImage.value)

  const data = await api.addRecipeComment(formData)
  if (data.success) {
    replyText.value = ''
    replyImage.value = null

    emit('refresh-comments')
  }
}
</script>

<template>
  <div class="rd-comment-item">
    <div class="rd-comment-content">
      <div class="rd-comment-info">
        <div class="rd-comment-author">{{ comment.username }}</div>
        <div class="rd-comment-action">
          <img
            :src="hasLiked ? '/assets/icons/ic-full-like.png' : '/assets/icons/ic-empty-like.png'"
            @click="toggleLike"
          />
          <img
            v-if="comment.parentCommentId == null"
            src="/assets/icons/ic-comment.png"
            @click="toggleReply"
          />
          <img src="/assets/icons/ic-more.png" />
        </div>
      </div>
      <div class="rd-comment-text">{{ comment.content }}</div>
      <div v-if="comment.imageUrl">
        <img :src="comment.imageUrl" alt="댓글 이미지" class="rd-comment-image" />
      </div>
    </div>

    <!-- 대댓글 렌더링 -->
    <div class="rd-children" v-if="comment.children && comment.children.length">
      <RecipeComment
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :replyId="replyId"
        @toggle-reply="$emit('toggle-reply', $event)"
        @refresh-comments="$emit('refresh-comments')"
      />
    </div>

    <!-- 대댓글 입력창 -->
    <div v-if="replyId === comment.id" class="rd-reply-form">
      <textarea
        v-model="replyText"
        placeholder="답글을 입력하세요..."
        class="rd-reply-input"
      ></textarea>
      <input type="file" accept="image/*" @change="handleImageChange" />
      <button @click="submitReply">등록</button>
    </div>
  </div>
</template>

<style scoped>
.rd-comment-item {
  padding-bottom: 20px;
  border-bottom: 0.5px solid #ececec;
}
.rd-comment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rd-comment-author {
  font-size: 14px;
  font-weight: 700;
}
.rd-comment-action {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rd-comment-action img {
  height: 16px;
  cursor: pointer;
}
.rd-comment-text {
  font-size: 16px;
  margin-top: 4px;
}
.rd-comment-image {
  max-width: 200px;
  margin-top: 8px;
  border-radius: 4px;
}
.rd-reply-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 4px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  resize: none;
}
.rd-children {
  padding-left: 24px;
  margin-top: 8px;
}
.rd-reply-form input[type='file'] {
  margin-bottom: 8px;
}
</style>
