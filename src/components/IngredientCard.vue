<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  name: String,
  qnt: String,
  exDate: String,
  category: String,
  imageUrl: String,
  location: String,
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<template>
  <div class="ingredient-card-container" @click="handleClick">
    <img class="ingredient-item-image" :src="props.imageUrl" :alt="props.category + ' 이미지'" />
    <div class="ingredient-content-container">
      <div class="ingredient-name-and-qnt-container">
        <span class="ingredient-item-name">{{ props.name }}</span>
        <span class="ingredient-item-qnt">{{ props.qnt }}</span>
      </div>
      <div class="ingredient-category-and-exdate">
        <span class="ingredient-item-category">{{ props.category }}</span>
        <span>|</span>
        <span class="ingredient-item-exdate">{{ props.exDate }}</span>
      </div>
    </div>
    <img
      class="ingredient-setting-button"
      src="/assets/icons/ic-banner-right.png"
      alt="재료 수정 및 삭제"
    />
  </div>
</template>
