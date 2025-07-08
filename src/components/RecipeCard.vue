<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink to="/recipe/detail">
    <div class="recipe-card content-card">
      <div class="recipe-rep-image card-image">
        <img :src="recipe.thumbnail" :alt="recipe.title" />
        <img
          class="recipe-scrap-icon scrap-js"
          src="/assets/icons/ic-empty-scrap.png"
          alt="스크랩"
        />
      </div>

      <div class="recipe-card-content card-content">
        <div class="recipe-title-container">
          <h3 class="recipe-title card-title">{{ recipe.title }}</h3>
          <span class="recipe-likes-count">
            {{ recipe.likes }}
            <img class="like-js" src="/assets/icons/ic-empty-like.png" alt="좋아요" />
          </span>
        </div>

        <div class="recipe-card-stats card-stats">
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-time.png" alt="조리시간" />
            {{ recipe.time }}
          </span>
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-level.png" alt="난이도" />
            {{ recipe.difficulty }}
          </span>
          <span class="recipe-stats-items">
            <img src="/assets/icons/ic-qnt.png" alt="인분" />
            {{ recipe.servings }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped></style>
