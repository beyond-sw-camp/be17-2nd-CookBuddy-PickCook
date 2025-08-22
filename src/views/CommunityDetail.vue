<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/community'
import Comment from '@/components/Comment.vue'

const route = useRoute()
const post = reactive({
  id: null,
  title: '',
  content: '',
  authorName: '',
  likes: 0,
  scraps: 0,
  updatedAt: '',
})
const newComment = ref('')
const comments = reactive([])
const replyId = ref(null)
const totalComments = computed(() => countComments(comments))
const hasLiked = ref(false)
const hasScrapped = ref(false)
const likeCount = ref(0)
const scrapCount = ref(0)

function countComments(comments) {
  let total = 0
  for (const comment of comments) {
    total += 1 // 자기 자신
    if (comment.children && comment.children.length > 0) {
      total += countComments(comment.children) // 자식 재귀
    }
  }
  return total
}

// 댓글에서 emit된 reply 클릭 이벤트 처리
const handleToggleReply = (id) => {
  replyId.value = replyId.value === id ? null : id
}

const getPostDetail = async () => {
  const id = route.params.id
  const data = await api.getPostDetail(id)
  if (data.success && data.results) {
    Object.assign(post, data.results)
  }
}

const getComments = async () => {
  const postId = route.params.id
  const data = await api.getComments(postId)
  if (data.success && data.results) {
    Object.assign(comments, data.results)
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  await api.addComment({
    content: newComment.value,
    postId: post.id,
    parentCommentId: null,
  })
  newComment.value = ''
  getComments()
}

const toggleLike = async () => {
  const data = await api.likePost({
    targetType: 'POST',
    targetId: post.id,
  })
  if (data.success && data.results) {
    likeCount.value = data.results.likeCount
    hasLiked.value = data.results.hasLiked
  }
}

const toggleScrap = async () => {
  const data = await api.scrapPost({
    targetType: 'POST',
    targetId: post.id,
  })
  if (data.success && data.results) {
    scrapCount.value = data.results.scrapCount
    hasScrapped.value = data.results.hasScrapped
  }
}

onMounted(() => {
  getPostDetail()
  getComments()
})
</script>

<template>
  <main class="cd-main-container">
    <!-- 제목 섹션 -->
    <div class="cd-title-section">
      <p class="cd-post-title">{{ post.title }}</p>
      <div class="cd-post-info">
        <p>{{ post.authorName }} • {{ post.updatedAt }}</p>
      </div>
    </div>

    <!-- 이미지 + 텍스트 섹션 -->
    <div class="cd-post-content">
      <p>{{ post.content }}</p>
    </div>

    <!-- 액션 바 -->
    <div class="cd-action-bar">
      <button class="cd-action-btn" @click="toggleLike">
        <img
          :src="hasLiked ? '/assets/icons/ic-full-like.png' : '/assets/icons/ic-empty-like.png'"
        />
        좋아요 {{ likeCount }}
      </button>
      <button class="cd-action-btn" @click="toggleScrap">
        <img
          :src="
            hasScrapped
              ? '/assets/icons/ic-full-scrap.png'
              : '/assets/icons/ic-empty-scrap-mypage.png'
          "
        />
        스크랩 {{ scrapCount }}
      </button>
    </div>

    <!-- 태그 -->
    <div class="cd-tags">
      <p v-if="post.tags">관련 태그</p>
      <a v-for="(tag, i) in post.tags" :key="i" href="#" class="tag">#{{ tag }}</a>
    </div>

    <!-- 댓글 섹션 -->
    <div class="cd-comment-section">
      <p class="cd-comment-header">댓글 {{ totalComments }}개</p>

      <!-- 댓글 작성 영역 -->
      <div class="cd-comment-form">
        <textarea
          type="text"
          v-model="newComment"
          placeholder="칭찬과 격려의 댓글은 작성자에게 큰 힘이 됩니다 :)"
          class="comment-input"
        ></textarea>
        <button @click="submitComment" class="comment-submit-btn">댓글 작성</button>
      </div>

      <!-- 댓글 리스트 -->
      <div class="cd-comment-list">
        <Comment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :reply-id="replyId"
          @toggle-reply="handleToggleReply"
          @refresh-comments="getComments"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 메인 컨테이너 */
.cd-main-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: white;
}

/* 제목 섹션 */
.cd-title-section {
  margin-bottom: 24px;
}

.cd-post-title {
  font-size: 20px;
  margin-bottom: 12px;
}

.cd-post-info {
  font-size: 12px;
  color: #515151;
}

/* 이미지 섹션 */
.cd-post-content {
  font-size: 16px;
}

/* 텍스트 콘텐츠 */
.cd-text-content {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 32px;
}

.cd-text-content p {
  margin-bottom: 20px;
}

/* 액션 바 */
.cd-action-bar {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
}

.cd-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 14px;
  color: #424242;
  cursor: pointer;
}

.cd-action-btn img {
  height: 12px;
}

/* 태그 */
.cd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 40px;
}

.tag {
  background-color: #f5f5f5;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #424242;
  text-decoration: none;
}

.tag:hover {
  background-color: #eaedef;
}

/* 댓글 섹션 */
.cd-comment-section {
  border-top: 10px solid #f2f2f2;
  padding-top: 20px;
}

.cd-comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.cd-comment-sort {
  font-size: 14px;
  color: #757575;
}

/* 댓글 입력 */
.cd-comment-input-container {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.cd-comment-input-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #eaedef;
  flex-shrink: 0;
}

.cd-comment-input-wrapper {
  flex: 1;
}

.cd-comment-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  resize: none;
  outline: none;
}

.cd-comment-input:focus {
  border-color: #35c5f0;
}

.cd-comment-submit {
  margin-top: 8px;
  text-align: right;
}

.cd-comment-submit-btn {
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* 댓글 리스트 */
.cd-comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cd-comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ff5757;
  flex-shrink: 0;
}

.cd-comment-content {
  flex: 1;
}

.cd-comment-author {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
}

.cd-comment-text {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.cd-comment-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #757575;
}

.cd-comment-action {
  cursor: pointer;
}

.cd-comment-action:hover {
  color: #ff5757;
}

/* 댓글 입력란 */
.cd-comment-form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.comment-input {
  width: 100%;
  height: 6rem;
  resize: none;
  font-family: inherit;
  padding: 10px;
  border: 1px solid #bcbbbd;
  border-radius: 4px;
}

.comment-input::placeholder {
  color: #ececec;
}

.comment-input:focus {
  outline: none;
}

.comment-submit-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: var(--color-primary);
  align-self: right;
}

/* 반응형 */
@media (max-width: 1200px) {
  .cd-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .cd-nav-menu {
    display: none;
  }

  .cd-search-bar {
    width: auto;
    flex: 1;
  }

  .cd-post-title {
    font-size: 24px;
  }
}
</style>
