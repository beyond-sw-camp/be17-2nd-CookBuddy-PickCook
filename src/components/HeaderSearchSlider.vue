<script setup>
import { defineEmits, ref, watch } from 'vue'
const emit = defineEmits(['search-close'])
const props = defineProps({
  modelValue: Boolean,
})

const show = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    show.value = val
  },
)
</script>

<template>
  <transition name="slide">
    <div class="header-search-modal">
      <div id="modal-top">
        <div id="header-search-modal-search-bar-container">
          <input type="text" placeholder="통합검색" />
          <img src="/assets/icons/ic-pink-search.png" alt="검색바" />
        </div>
        <span @click="emit('search-close')">X</span>
      </div>

      <div class="search-record-list">
        <div class="search-record-items">
          <img src="/assets/icons/ic-search.png" alt="" />
          <span>토마토</span>
        </div>
        <div class="search-record-items">
          <img src="/assets/icons/ic-search.png" alt="" />
          <span>부추전</span>
        </div>
        <div class="search-record-items">
          <img src="/assets/icons/ic-search.png" alt="" />
          <span>블루베리</span>
        </div>
        <div class="search-record-items">
          <img src="/assets/icons/ic-search.png" alt="" />
          <span>바나나</span>
        </div>
      </div>

      <div id="only-layout"></div>
    </div>
  </transition>
</template>

<style scoped>
.header-search-modal {
  background-color: white;
  height: 100vh;
  width: fit-content;
  padding: 25px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

#modal-top {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 20px;
  border-bottom: 0.5px solid var(--color-light-gray);
}

#modal-top > span {
  font-size: 12px;
  cursor: pointer;
}

#header-search-modal-search-bar-container {
  border: 1px solid var(--color-primary-strong);
  border-radius: 3px;
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 8px 12px;
}

#header-search-modal-search-bar-container > input {
  border: none;
  outline: none;
}

#header-search-modal-search-bar-container > img {
  width: 20px;
}

.search-record-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-record-items {
  display: flex;
  gap: 12px;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  align-items: center;
}

.search-record-items > span {
  font-size: 15px;
  color: var(--color-dark-strong);
}

.search-record-items:hover {
  background-color: #f1f1f1;
}

.search-record-items > img {
  width: 18px;
  height: 18px;
  margin-top: 2px;
}


#only-layout {
  flex: 3;
}

/* 슬라이드 애니메이션 */
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.9s ease,
    opacity 0.9s ease;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
