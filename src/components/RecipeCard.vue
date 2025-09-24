<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import likeAPI from '@/api/like'
import scrapAPI from '@/api/scrap'

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})

const likeAnimating = ref(false)
const scrapAnimating = ref(false)

// 로컬 상태
const isLiked = ref(props.recipe.likedByUser || false)
const likeCount = ref(props.recipe.likeCount || 0)

const isScrapped = ref(props.recipe.scrappedByUser)
const scrapCount = ref(props.recipe.scrapCount)

// 아이콘 경로
const likeSrc = computed(() =>
  isLiked.value ? '/assets/icons/ic-full-like.png' : '/assets/icons/ic-empty-like.png',
)

const scrapSrc = computed(() =>
  isScrapped.value ? '/assets/icons/ic-full-scrap.png' : '/assets/icons/ic-empty-scrap.png',
)

// 좋아요 토글
const toggleLike = async (event) => {
  event.stopPropagation()
  event.preventDefault()

  // 이전 상태 저장
  const previousLiked = isLiked.value
  const previousCount = likeCount.value

  // UI 업데이트
  isLiked.value = !isLiked.value
  likeCount.value = Math.max(0, (likeCount.value || 0) + (isLiked.value ? 1 : -1))

  likeAnimating.value = true
  setTimeout(() => {
    likeAnimating.value = false
  }, 300)

  try {
    await likeAPI.toggleLike('RECIPE', props.recipe.idx)
  } catch (err) {
    console.error('좋아요 실패', err)
    // 실패 시 롤백
    isLiked.value = previousLiked
    likeCount.value = previousCount
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
    await scrapAPI.toggleScrap('RECIPE', props.recipe.idx)
    // 성공 → 그대로 유지
  } catch (err) {
    console.error('스크랩 실패', err)
    // 실패 → 원래 상태로 롤백
    isScrapped.value = !isScrapped.value
    scrapCount.value += isScrapped.value ? 1 : -1
  }
}
</script>

<template>
  <RouterLink :to="`/recipe/detail/${recipe.idx}`">
    <div class="recipe-card content-card">
      <div class="recipe-rep-image card-image">
        <img
          :src="props.recipe.image_large_url || '/assets/images/no-image.png'"
          :alt="props.recipe.title"
        />
        <img
          class="recipe-scrap-icon scrap-js"
          :src="scrapSrc"
          alt="스크랩"
          @click="toggleScrap"
          :class="{ 'icon-pop': scrapAnimating }"
        />
      </div>

      <div class="recipe-card-content card-content">
        <div class="recipe-title-container">
          <h3 class="recipe-title card-title">{{ props.recipe.title }}</h3>
          <span class="recipe-likes-count" style="cursor: default">
            {{ props.recipe.commentCount || 0 }}
            <img
              style="margin: 0px 8px 2px 0px; width: 18px; opacity: 60%"
              src="/assets/icons/ic-reply-count.png"
              alt="댓글"
            />
          </span>
          <span class="recipe-likes-count" @click="toggleLike" style="cursor: pointer">
            {{ likeCount || 0 }}
            <img
              class="like-js"
              :src="likeSrc"
              alt="좋아요"
              :class="{ 'icon-pop': likeAnimating }"
            />
          </span>
        </div>

        <div class="recipe-card-stats card-stats">
          <span class="recipe-stats-items" v-if="props.recipe.time_taken">
            <img src="/assets/icons/ic-time.png" alt="조리시간" />
            {{ props.recipe.time_taken }}
          </span>
          <span class="recipe-stats-items" v-if="props.recipe.difficulty_level">
            <img src="/assets/icons/ic-level.png" alt="난이도" />
            {{ props.recipe.difficulty_level }}
          </span>
          <span class="recipe-stats-items" v-if="props.recipe.serving_size">
            <img src="/assets/icons/ic-qnt.png" alt="인분" />
            {{ props.recipe.serving_size }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
