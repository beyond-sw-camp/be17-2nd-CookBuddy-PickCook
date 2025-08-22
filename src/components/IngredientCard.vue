<template>
  <div class="ingredient-card-container" @click="handleClick">
    <img class="ingredient-item-image" :src="imageUrl" :alt="category + ' 이미지'" />
    <div class="ingredient-content-container">
      <div class="ingredient-name-and-qnt-container">
        <span class="ingredient-item-name">{{ name }}</span>
        <span class="ingredient-item-qnt">{{ qnt }}</span>
      </div>
      <div class="ingredient-category-and-exdate">
        <span class="ingredient-item-category">{{ category }}</span>
        <span>|</span>
        <span class="ingredient-item-exdate">{{ exDate }}</span>
      </div>
    </div>
    <img
      class="ingredient-setting-button"
      src="/assets/icons/ic-banner-right.png"
      alt="재료 수정 및 삭제"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// ✅ props 정의 (camelCase로 통일)
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  qnt: {
    type: String,
    required: true,
  },
  exDate: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.ingredient-card-container {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.ingredient-card-container:hover {
  background-color: #f8f9fa;
  border-color: #ddd;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ingredient-item-image {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  border-radius: 8px;
  object-fit: cover;
}

.ingredient-content-container {
  flex: 1;
  min-width: 0; /* overflow 방지 */
}

.ingredient-name-and-qnt-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.ingredient-item-name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.ingredient-item-qnt {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.ingredient-category-and-exdate {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #888;
}

.ingredient-item-category {
  color: #666;
  font-weight: 500;
}

.ingredient-setting-button {
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.ingredient-setting-button:hover {
  opacity: 1;
}

/* 유통기한 상태별 스타일 */
.ingredient-card-container[data-expiry='expired'] {
  border-color: #ff4444;
  background-color: #fff5f5;
}

.ingredient-card-container[data-expiry='soon'] {
  border-color: #ff9500;
  background-color: #fff8f0;
}
</style>
