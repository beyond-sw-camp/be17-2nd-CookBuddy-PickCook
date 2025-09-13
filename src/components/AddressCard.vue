<script setup>
import { isAxiosError } from 'axios'

defineProps({
  address: String,
  isDefault: Boolean, // 기본배송지 여부 (태그에만 사용)
  isSelected: Boolean, // 클릭되어 선택된 항목 (뱃지에만 사용)
  showButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'edit'])

function handleClick() {
  emit('click')
}

function handleEditClick(event) {
  event.stopPropagation() // 부모 클릭 이벤트와 겹치지 않도록 막기
  emit('edit')
}

function handleDeleteClick(event) {
  event.stopPropagation()
  emit('delete')
}
</script>

<template>
  <div class="mypage-address-card-container">
    <div v-if="showButton" class="mypage-address-button-container" @click="handleClick">
      <div v-if="isSelected" class="mypage-address-box-red-circle">
        <div></div>
      </div>

      <div v-else class="mypage-address-box-gray-circle" @click="handleClick"></div>
    </div>

    <div class="mypage-address-card-content-parent-container">
      <div class="mypage-address-card-content-container">
        <div v-if="isDefault" class="mypage-address-tag-default">기본배송지</div>
        <div class="mypage-user-address-text">
          {{ address }}
        </div>
      </div>

      <div class="mypage-address-delete-and-edit-container" :class="{ 'default-address': isDefault, 'normal-address': !isDefault }">
        <p v-if="!isDefault" @click="handleDeleteClick" class="mypage-address-delete-button">
          삭제
        </p>
        <p v-if="!isDefault">|</p>
        <p @click="handleEditClick">수정</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

.mypage-address-delete-and-edit-container {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 97px;
}

.default-address > p {
  margin-top: 10px;
  width: 85px;
  text-align: right;
}

@media (max-width: 1023px) {
  .mypage-user-address-text {
    font-size: 14px;
  }

  .mypage-address-delete-and-edit-container > p {
    font-size: 12px;
  }
}
</style>
