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
  expirationStatus: {
    type: String,
    default: 'FRESH',
  },
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}

// ✅ 유통기한 상태별 클래스 반환
function getExpiryClass() {
  switch (props.expirationStatus) {
    case 'EXPIRED':
      return 'expiry-expired'
    case 'URGENT':
      return 'expiry-urgent'
    case 'EXPIRING_SOON':
      return 'expiry-soon'
    default:
      return 'expiry-fresh'
  }
}
</script>

<template>
  <div class="ingredient-card-container" :data-expiry="expirationStatus" @click="handleClick">
    <img class="ingredient-item-image" :src="imageUrl" :alt="category + ' 이미지'" />
    <div class="ingredient-content-container">
      <div class="ingredient-name-and-qnt-container">
        <span class="ingredient-item-name">{{ name }}</span>
        <span class="ingredient-item-qnt">{{ qnt }}</span>
      </div>
      <div class="ingredient-category-and-exdate">
        <span class="ingredient-item-category">{{ category }}</span>
        <span>|</span>
        <span class="ingredient-item-exdate" :class="getExpiryClass()">{{ exDate }}</span>
      </div>
    </div>
    <img
      class="ingredient-setting-button"
      src="/assets/icons/ic-banner-right.png"
      alt="재료 수정 및 삭제"
    />
  </div>
</template>

<style scoped>
/* 🆕 유통기한 상태별 카드 테두리/배경 */
.ingredient-card-container[data-expiry='EXPIRED'] {
  border-color: #ff4444 !important;
  background-color: #fff5f5 !important;
}

.ingredient-card-container[data-expiry='URGENT'] {
  border-color: #ff4444 !important;
  background-color: #fff5f5 !important;
}

/* .ingredient-card-container[data-expiry='EXPIRING_SOON'] {
  border-color: #ffcc00 !important;
  background-color: #fffdf0 !important;
}

.ingredient-card-container[data-expiry='FRESH'] {
  border-color: #45da00 !important;
  background-color: #f8fff0 !important;
} */

/* 🆕 유통기한 텍스트 색상 */
.expiry-expired {
  color: #ff4444 !important;
  font-weight: 600;
}
.expiry-urgent {
  color: #ff4444 !important;
  font-weight: 600;
}
/* .expiry-soon {
  color: #ffcc00 !important;
  font-weight: 600;
}
.expiry-fresh {
  color: #45da00 !important;
  font-weight: 600;
} */
</style>
