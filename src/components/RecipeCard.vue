<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'


const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})


const isLiked = ref(false)
const likeCount = ref(props.recipe.likes || 0)
const likeAnimating = ref(false)

const likeSrc = computed(() =>
  isLiked.value ? '/assets/icons/ic-full-like.png' : '/assets/icons/ic-empty-like.png',
)

const toggleLike = (event) => {
  event.stopPropagation()
  event.preventDefault()
  if (isLiked.value) {
    likeCount.value--
  } else {
    likeCount.value++
  }
  isLiked.value = !isLiked.value

  likeAnimating.value = true
  setTimeout(() => {
    likeAnimating.value = false
  }, 300)
}


const isScrapped = ref(false)
const scrapCount = ref(props.recipe.scrapCount || 0)
const scrapAnimating = ref(false)

const scrapSrc = computed(() =>
  isScrapped.value ? '/assets/icons/ic-full-scrap.png' : '/assets/icons/ic-gray-empty-scrap.png',
)

const toggleScrap = (event) => {
  event.stopPropagation()
  event.preventDefault()
  if (isScrapped.value) {
    scrapCount.value--
  } else {
    scrapCount.value++
  }
  isScrapped.value = !isScrapped.value

  scrapAnimating.value = true
  setTimeout(() => {
    scrapAnimating.value = false
  }, 300)
}
</script>

<template>
  <RouterLink :to="`/recipe/detail/${props.recipe.id}`">
    <div class="recipe-card content-card">
      <div class="recipe-rep-image card-image">
        <img :src="props.recipe.thumbnail" :alt="props.recipe.title" />
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
          <span class="recipe-likes-count" @click="toggleLike" style="cursor:pointer;">
            {{ likeCount }}
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
            {{ props.recipe.time }}
          </span>
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-level.png" alt="난이도" />
            {{ props.recipe.difficulty }}
          </span>
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-qnt.png" alt="인분" />
            {{ props.recipe.servings }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
