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
            >{{ post.createdAt }} · 조회 {{ post.views }} · 좋아요 {{ post.likes }}개 · 댓글
            {{ post.comments }}개</span
          >
        </div>
      </div>
      <div v-if="showActions" class="mypage-my-activity-boards-right">
        <div class="mypage-my-activity-boards-edit-button">수정</div>
        <div class="mypage-my-activity-boards-delete-button">삭제</div>
      </div>

      <div v-else class="mypage-my-activity-board-more-menu-button">
        <!-- 모바일/태블릿에서 보여줄 다른 버튼 UI -->
        <img src="/public/assets/icons/ic-more.png" alt="더보기" @click="PostMoreMenuModalToggle"/>
        <MyPagePostItemMenuModal v-if="showMoreMenus" class="post-more-menu-modal"/>
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
