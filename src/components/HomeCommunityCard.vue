<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import likeAPI from '@/api/like'
import scrapAPI from '@/api/scrap'

const router = useRouter()

const props = defineProps({
  community: {
    type: Object,
    required: true,
  },
})

const likeAnimating = ref(false)
const scrapAnimating = ref(false)

// 로컬 상태
const isLiked = ref(props.community.hasLiked)
const likeCount = ref(props.community.likeCount)

const isScrapped = ref(props.community.hasScrapped)
const scrapCount = ref(props.community.scrapCount)

// 아이콘 경로
const likeSrc = computed(() =>
  isLiked.value ? '/assets/icons/ic-full-like.png' : '/assets/icons/ic-empty-like.png',
)

const scrapSrc = computed(() =>
  isScrapped.value ? '/assets/icons/ic-full-scrap.png' : '/assets/icons/ic-gray-empty-scrap.png',
)

// 좋아요 토글
const toggleLike = async (event) => {
  event.stopPropagation()
  event.preventDefault()

  // UI 업데이트
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1

  likeAnimating.value = true
  setTimeout(() => {
    likeAnimating.value = false
  }, 300)

  try {
    await likeAPI.toggleLike('POST', props.community.id)
    // 성공 → 그대로 유지
  } catch (err) {
    console.error('좋아요 실패', err)
    // 실패 → 원래 상태로 롤백
    isLiked.value = !isLiked.value
    likeCount.value += isLiked.value ? 1 : -1
  }
}

// 스크랩 토글
const toggleScrap = async (event) => {
  event.stopPropagation()
  event.preventDefault()

  // UI 업데이트
  isScrapped.value = !isScrapped.value
  scrapCount.value += isScrapped.value ? 1 : -1

  scrapAnimating.value = true
  setTimeout(() => {
    scrapAnimating.value = false
  }, 300)

  try {
    await scrapAPI.toggleScrap('POST', props.community.id)
    // 성공 → 그대로 유지
  } catch (err) {
    console.error('스크랩 실패', err)
    // 실패 → 원래 상태로 롤백
    isScrapped.value = !isScrapped.value
    scrapCount.value += isScrapped.value ? 1 : -1
  }
}

const formatRelativeTime = (isoTime) => {
  const now = new Date()
  const date = new Date(isoTime)
  const diff = (now - date) / 1000

  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}일 전`

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const goToDetail = () => {
  router.push(`/community/${props.community.id}`)
}
</script>

<template>
  <div class="community-card content-card" @click="goToDetail">
    <div class="card-image">
      <img :src="props.community.postImage" alt="게시글 대표 이미지" />
      <span class="community-view-count card-badge">
        <img src="/assets/icons/ic-view.png" alt="조회수" />
        {{ props.community.viewCount }}
      </span>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ props.community.title }}</h3>
      <!-- <p class="community-created">{{ formatRelativeTime(props.community.created_at) }}</p> -->
      <div class="community-card-content">
        <div class="card-author">
          <img
            class="author-avatar"
            :src="
              props.community.authorProfileImage
                ? props.community.authorProfileImage
                : 'https://i.namu.wiki/i/Bge3xnYd4kRe_IKbm2uqxlhQJij2SngwNssjpjaOyOqoRhQlNwLrR2ZiK-JWJ2b99RGcSxDaZ2UCI7fiv4IDDQ.webp'
            "
            alt="프로필 사진"
          />
          <span class="author-name">{{ props.community.authorName }}</span>
        </div>
        <div class="community-stats card-stats">
          <span @click.stop="toggleLike" style="cursor: pointer">
            <img class="icon" :class="{ 'icon-pop': likeAnimating }" :src="likeSrc" alt="좋아요" />
            {{ likeCount }}
          </span>
          <span @click.stop="toggleScrap" style="cursor: pointer">
            <img
              class="icon"
              :class="{ 'icon-pop': scrapAnimating }"
              :src="scrapSrc"
              alt="스크랩"
            />
            {{ scrapCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
