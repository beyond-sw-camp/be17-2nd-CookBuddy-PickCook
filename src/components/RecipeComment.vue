<script setup>
import { ref } from 'vue'
import RecipeComment from './RecipeComment.vue'
import api from '@/api/recipe'
import likeApi from '@/api/like'

// props
const { comment, replyId, recipeId } = defineProps({
  comment: Object,
  replyId: [Number, null],
  recipeId: Number,
})

const emit = defineEmits(['toggle-reply', 'refresh-comments'])

// 대댓글 상태
const replyText = ref('')
const replyImage = ref(null)        // 실제 업로드할 파일
const uploadedImage = ref(null)     // 업로드 후 S3 URL

// 좋아요 상태
const hasLiked = ref(comment.hasLiked)

// 이미지 업로드 UI
const showImageUI = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return

    replyImage.value = file // 파일 저장

    const formData = new FormData()
    formData.append('file', file)

    try {
      // 1️⃣ Presigned URL 발급
      const data = await api.getPresignedUrl(formData)
      if (!data.success) {
        console.error('Presigned URL 발급 실패')
        return
      }

      const presignedUrl = data.results

      // 2️⃣ 실제 업로드
      await api.uploadImage(presignedUrl, file)

      // 3️⃣ 최종 저장할 URL
      uploadedImage.value = presignedUrl.split('?')[0]
    } catch (err) {
      console.error('이미지 업로드 실패:', err)
    }
  }
}

// 좋아요 토글
const toggleLike = async () => {
  if (!comment.id) return
  try {
    const data = await likeApi.toggleLike('RECIPE_COMMENT', comment.id)
    if (data.success && data.results) {
      hasLiked.value = !hasLiked.value
    }
  } catch (err) {
    console.error('좋아요 실패:', err)
  }
}

// 대댓글 입력창 토글
const toggleReply = () => {
  emit('toggle-reply', replyId === comment.id ? null : comment.id)
}

// 대댓글 등록
const submitReply = async () => {
  if (!replyText.value.trim() && !uploadedImage.value) return

  try {
    await api.addComment({
      content: replyText.value,
      recipeId,
      parentCommentId: comment.id,
      imageUrl: uploadedImage.value,
    })

    // 초기화
    replyText.value = ''
    replyImage.value = null
    uploadedImage.value = null
    emit('refresh-comments')
  } catch (err) {
    console.error('대댓글 등록 실패:', err)
  }
}
</script>


<template>
  <div class="rd-comment-item">
    <div class="rd-comment-content">
      <div class="rd-comment-info">
        <div class="rd-comment-author">{{ comment.username }}</div>
        <div class="rd-comment-content-container">
          <div class="rd-comment-text">{{ comment.content }}</div>
          <div v-if="comment.imageUrl">
            <img :src="comment.imageUrl" alt="댓글 이미지" class="rd-comment-image" />
          </div>
        </div>
        <div class="rd-comment-action">
          <img
            :src="hasLiked ? '/assets/icons/ic-full-like.png' : '/assets/icons/ic-empty-like.png'"
            @click="toggleLike"
          />
          <img
            v-if="comment.parentCommentId == null"
            src="/assets/icons/ic-reply-count.png"
            @click="toggleReply"
          />
          <img src="/assets/icons/ic-more.png" />
        </div>
      </div>
    </div>

    <!-- 대댓글 렌더링 -->
    <div class="rd-children" v-if="comment.children && comment.children.length">
      <RecipeComment
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :recipeId="recipeId"
        :replyId="replyId"
        @toggle-reply="$emit('toggle-reply', $event)"
        @refresh-comments="$emit('refresh-comments')"
      />
    </div>

    <!-- 대댓글 입력창 -->
    <div v-if="replyId === comment.id" class="rd-reply-form">
      <div class="rd-reply-form-input-content">
        <textarea
          v-model="replyText"
          placeholder="답글을 입력하세요..."
          class="rd-reply-input"
        ></textarea>
        <img
          :src="uploadedImage || '/assets/icons/ic-photo.png'"
          alt="new comment image"
          class="rd-image-placeholder"
          @click="showImageUI"
        />
      </div>
      <div class="recipe-comment-reply-button-container">
        <button @click="submitReply">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rd-comment-info {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 16px 4px 30px;
  border-bottom: 0.5px solid #ececec;
  min-height: 85px;
}
.rd-comment-author {
  font-size: 16px;
  font-weight: 700;
}
.rd-comment-content-container {
  flex: 2;
  padding: 0 20px;
}
.rd-comment-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  margin-left: auto;
  gap: 16px;
  background-color: #f7f7f7;
  border-radius: 4px;
  height: fit-content;
}
.rd-comment-action img {
  height: 16px;
  cursor: pointer;
}
.rd-comment-text {
  font-size: 15px;
  margin-top: 2px;
}
.rd-comment-image {
  width: 150px;
  height: 150px;
  margin-top: 15px;
  border-radius: 5px;
  object-fit: cover;
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
}
.rd-reply-form {
  margin-left: 24px;
  margin-top: 20px;
}
.rd-reply-form textarea {
  flex-grow: 1;
  width: 100%;
  height: 100px;
  resize: none;
  font-family: inherit;
  padding: 10px;
  border: 1px solid #bcbbbd;
  border-radius: 5px;
  outline: none;
}
.rd-reply-form img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid #bcbbbd;
}
.rd-reply-form input[type='file'] {
  margin-bottom: 8px;
}
.rd-reply-form-input-content {
  display: flex;
  gap: 10px;
}
.recipe-comment-reply-button-container {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: 5px;
}
.recipe-comment-reply-button-container button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: var(--color-primary);
  cursor: pointer;
}
</style>
