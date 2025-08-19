<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})

console.log("뭘까요", props.recipe)

const emit = defineEmits(['update:like', 'update:scrap'])

// 로컬 상태
const isLiked = ref(props.recipe.likedByUser)
const likeCount = ref(props.recipe.likeCount)

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
const toggleLike = (event) => {
  event.stopPropagation()
  event.preventDefault()

  if (isLiked.value) {
    likeCount.value--
  } else {
    likeCount.value++
  }
  isLiked.value = !isLiked.value

  // 부모 컴포넌트로 이벤트 전달 (서버 동기화)
  emit('update:like', {
    liked: isLiked.value,
    count: likeCount.value,
  })
}

// 스크랩 토글
const toggleScrap = (event) => {
  event.stopPropagation()
  event.preventDefault()

  if (isScrapped.value) {
    scrapCount.value--
  } else {
    scrapCount.value++
  }
  isScrapped.value = !isScrapped.value

  // 부모 컴포넌트로 이벤트 전달
  emit('update:scrap', {
    scrapped: isScrapped.value,
    count: scrapCount.value,
  })
}
</script>

<template>
  <RouterLink :to="`/recipe/detail/${props.recipe.id}`" class="c-board-link">
    <div class="recipe-card content-card">
      <div class="recipe-rep-image card-image">
        <img :src="props.recipe.image_large_url" :alt="props.recipe.title" />
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
          <span class="recipe-likes-count" @click="toggleLike" style="cursor: pointer">
            {{ props.recipe.likeCount }}
            <img
              class="like-js"
              :src="likeSrc"
              alt="좋아요"
              :class="{ 'icon-pop': likeAnimating }"
            />
          </span>
        </div>

        <div class="recipe-card-stats card-stats">
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-time.png" alt="조리시간" />
            {{ props.recipe.time_taken }}
          </span>
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-level.png" alt="난이도" />
            {{ props.recipe.difficulty_level }}
          </span>
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-qnt.png" alt="인분" />
            {{ props.recipe.serving_size }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
