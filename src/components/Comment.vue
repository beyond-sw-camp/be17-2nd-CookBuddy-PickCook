<script setup>
import { ref } from 'vue'
import api from '@/api/community'

const { comment, replyId } = defineProps({
  comment: Object,
  replyId: [Number, null],
})

const emit = defineEmits(['toggle-reply', 'refresh-comments'])

const replyText = ref('')

const toggleReply = () => {
  emit('toggle-reply', replyId === comment.id ? null : comment.id)
}

const submitReply = async () => {
  const payload = {
    content: replyText.value,
    postId: comment.postId,
    parentCommentId: comment.id,
  }
  console.log(comment)
  const data = await api.addComment(payload)
  if (data.success && data.results) {
    console.log('대댓글 등록 성공')
  }
  replyText.value = ''
  emit('toggle-reply', null) // 입력창 닫기
  emit('refresh-comments')
}
</script>

<template>
  <div class="cd-comment-item">
    <div class="cd-comment-content">
      <div class="cd-comment-info">
        <div class="cd-comment-author">{{ comment.userName }}</div>
        <div class="cd-comment-action">
          <img src="/public/assets/icons/ic-like.png" />
          <img
            v-if="comment.parentCommentId == null"
            src="/public/assets/icons/ic-comment.png"
            @click="toggleReply"
          />
          <img src="/public/assets/icons/ic-more.png" />
        </div>
      </div>

      <div class="cd-comment-text">{{ comment.content }}</div>
    </div>
  </div>
  <!-- 대댓글 보기: 입력란 없음 -->
  <div class="cd-children" v-if="comment.children && comment.children.length">
    <Comment
      v-for="child in comment.children"
      :key="child.id"
      :comment="child"
      @toggle-reply="$emit('toggle-reply', $event)"
    />
  </div>
  <!-- 대댓글 입력창: 최상위 댓글에만 열림 -->
  <div v-if="replyId === comment.id" class="cd-reply-form">
    <textarea
      v-model="replyText"
      placeholder="답글을 입력하세요..."
      class="cd-reply-input"
    ></textarea>
    <button @click="submitReply">등록</button>
  </div>
</template>

<style scoped>
.cd-comment-item {
  padding-bottom: 20px;
  border-bottom: 0.5px solid #ececec;
}
.cd-comment-info {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

.cd-comment-author {
  font-size: 14px;
  font-weight: 700;
}

.cd-comment-action {
  display: flex;
  align-items: center;
  padding: 4px 16px;
  margin-left: auto;
  gap: 16px;
  background-color: #f7f7f7;
  border-radius: 4px;
}

.cd-comment-action img {
  height: 10px;
}

.cd-comment-text {
  font-size: 16px;
}

.cd-reply-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  resize: none;
  outline: none;
}

.cd-children {
  padding-left: 24px;
}
</style>
