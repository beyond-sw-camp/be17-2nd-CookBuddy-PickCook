<script setup>
import { computed, ref } from 'vue'
import MyPagePostItemMenuModal from './MyPagePostItemMenuModal.vue'

const props = defineProps({
  post: Object,
  showActions: {
    type: Boolean,
    default: true,
  },
  isMobileOrTablet: Boolean,
})

const showActions = computed(() => !props.isMobileOrTablet)
const showMoreMenus = ref(false)

// 모바일&태블릿 화면일 때 사용하는 메뉴 모달 토글
const PostMoreMenuModalToggle = () => {
  showMoreMenus.value = !showMoreMenus.value
}

const truncateContent = (html, maxLength) => {
  // HTML 태그 제거 후 글자수 제한
  const div = document.createElement('div')
  div.innerHTML = html
  let text = div.textContent || div.innerText || ''
  
  if (text.length > maxLength) {
    text = text.slice(0, maxLength) + '...'
  }
  return text
}

const formatRelativeTime = (isoString) => {
  const now = new Date()
  const past = new Date(isoString)
  const diff = Math.floor((now - past) / 1000) // 초 단위

  if (diff < 60) return `${diff}초 전`
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`

  // 너무 오래된 글은 날짜 표시
  return `${past.getFullYear()}.${(past.getMonth() + 1).toString().padStart(2,'0')}.${past.getDate().toString().padStart(2,'0')}`
}
</script>

<template>
  <div class="mypage-main-my-activity-boards">
    <div class="mypage-my-activity-boards-el">
      <div class="mypage-my-activity-boards-left">
        <img :src="post.postImage" alt="커뮤니티 대표 이미지" />
        <div class="mypage-my-activity-boards-content">
          <p>{{ post.title }}</p>
          <p v-html="truncateContent(post.content, 200)"></p>
          <span
            >{{ formatRelativeTime(post.updatedAt) }} · 조회 {{ post.viewCount }} · 좋아요 {{ post.likeCount }}개 ·
            스크랩 {{ post.scrapCount }}개 · 댓글 {{ post.commentCount }}개</span
          >
        </div>
      </div>
      <div v-if="showActions" class="mypage-my-activity-boards-right">
        <div class="mypage-my-activity-boards-edit-button">수정</div>
        <div class="mypage-my-activity-boards-delete-button">삭제</div>
      </div>

      <div v-else class="mypage-my-activity-board-more-menu-button">
        <!-- 모바일/태블릿에서 보여줄 다른 버튼 UI -->
        <img src="/public/assets/icons/ic-more.png" alt="더보기" @click="PostMoreMenuModalToggle" />
        <MyPagePostItemMenuModal v-if="showMoreMenus" class="post-more-menu-modal" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-more-menu-modal {
  position: absolute;
  top: 25px;
  right: 0;
  width: 80px;
  height: fit-content;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
