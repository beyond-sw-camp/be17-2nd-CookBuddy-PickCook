<script setup>
const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
  emit('edit') // 부모로 알림
}

const handleDelete = () => {
  emit('delete')
}
</script>

<template>
  <div class="mypage-post-item-modal-container">
    <div @click.stop="handleEdit" class="mypage-post-item">수정</div>
    <div @click.stop="handleDelete" class="mypage-post-item">삭제</div>
  </div>
</template>

<style scoped>
.mypage-post-item-modal-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.mypage-post-item {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
}
</style>
