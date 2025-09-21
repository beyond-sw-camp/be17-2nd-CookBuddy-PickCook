<script setup>
import { computed, ref } from 'vue'
import MyPagePostItemMenuModal from './MyPagePostItemMenuModal.vue'
import { useRouter } from 'vue-router'
import api from '@/api/recipe'

const props = defineProps({
  recipe: Object,
  showActions: {
    type: Boolean,
    default: true,
  },
  isMobileOrTablet: Boolean,
})

console.log("받은 레시피 데이터 ", props.recipe)

const actionStyle = computed(() => !props.isMobileOrTablet)
const showMoreMenus = ref(false)
const router = useRouter()
const emit = defineEmits(['delete'])

// 모바일&태블릿 화면일 때 사용하는 메뉴 모달 토글
const PostMoreMenuModalToggle = () => {
  showMoreMenus.value = !showMoreMenus.value
}

const getImageSrc = (recipeImage) => {
  return recipeImage || '/assets/images/no-image.png'
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
  return `${past.getFullYear()}.${(past.getMonth() + 1).toString().padStart(2, '0')}.${past.getDate().toString().padStart(2, '0')}`
}

const goToEdit = () => {
  router.push(`/recipe/edit/${props.recipe.idx}`)
}

const handleDelete = async () => {
  try {
    await api.deleteRecipe(props.recipe.idx)
    emit('delete', props.recipe.idx) // 부모에게 삭제 사실 전달
  } catch (error) {
    console.error('삭제 실패:', error)
  }
}

const goToDetail = () => {
  router.push(`/recipe/detail/${props.recipe.idx}`)
}
</script>

<template>
  <div class="mypage-main-my-activity-boards" @click="goToDetail">
    <div class="mypage-my-activity-boards-el">
      <div class="mypage-my-activity-boards-left">
        <img :src="getImageSrc(recipe.image_large_url)" alt="커뮤니티 대표 이미지" />
        <div class="mypage-my-activity-boards-content">
          <p>{{ recipe.title }}</p>
          <p>{{ recipe.description || '\u00A0' }}</p>
          <span
            >{{ formatRelativeTime(recipe.updatedAt) }} · 좋아요
            {{ recipe.likeCount || 0 }}개 · 스크랩 {{ recipe.scrapCount || 0 }}개 · 댓글
            {{ recipe.commentCount || 0 }}개</span
          >
        </div>
      </div>
      <div v-if="showActions">
        <div v-if="actionStyle" class="mypage-my-activity-boards-right">
          <div class="mypage-my-activity-boards-edit-button" @click.stop="goToEdit">수정</div>
          <div class="mypage-my-activity-boards-delete-button" @click.stop="handleDelete(recipe)">삭제</div>
        </div>

        <div v-else class="mypage-my-activity-board-more-menu-button">
          <!-- 모바일/태블릿에서 보여줄 다른 버튼 UI -->
          <img
            src="/public/assets/icons/ic-more.png"
            alt="더보기"
            @click.stop="PostMoreMenuModalToggle"
          />
          <MyPagePostItemMenuModal
            v-if="showMoreMenus"
            class="post-more-menu-modal"
            @edit="goToEdit(recipe)"
            @delete="handleDelete(recipe)"
          />
        </div>
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

@media (max-width: 1023px) {
  .mypage-my-activity-boards-content > p {
    font-size: 14px;
  }

  .mypage-my-activity-boards-content > span {
    font-size: 12px;
  }

  .mypage-my-activity-boards-left > img {
    width: 70px;
    height: 70px;
  }

  
}
</style>
