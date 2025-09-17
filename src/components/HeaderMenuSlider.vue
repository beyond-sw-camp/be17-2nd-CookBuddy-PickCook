<script setup>
import { defineEmits, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
const emit = defineEmits(['close'])
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
    <div class="header-menu-modal">
      <div id="modal-top">
        <div></div>
        <h4>PickCook</h4>
        <img src="/assets/icons/ic-modal-slide.png" alt="닫기" @click="emit('close')" />
      </div>

      <div class="button-container">
        <button class="modal-login-button modal-button">로그인</button>
        <button class="modal-signup-button modal-button">회원가입</button>
      </div>

      <div class="menu-list">
        <RouterLink to="/refrigerator" class="menu-items" @click="emit('close')">
          <img src="/assets/icons/ic-fridge.png" alt="냉장고" />
          <span>냉장고</span>
        </RouterLink>
        <RouterLink to="/recipe" class="menu-items" @click="emit('close')">
          <img src="/assets/icons/ic-recipe-book.png" alt="레시피" />
          <span>레시피</span>
        </RouterLink>
        <RouterLink to="/products" class="menu-items" @click="emit('close')">
          <img src="/assets/icons/ic-shopping.png" alt="쇼핑" />
          <span>쇼핑</span>
        </RouterLink>
        <RouterLink to="community" class="menu-items" @click="emit('close')">
          <img src="/assets/icons/ic-community.png" alt="커뮤니티" />
          <span>커뮤니티</span>
        </RouterLink>
        <RouterLink to="#!" class="menu-items" @click="emit('close')">
          <img src="/assets/icons/ic-helpdesk.png" alt="고객센터" />
          <span>고객센터</span>
        </RouterLink>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.header-menu-modal {
  background-color: white;
  height: 100vh;
  width: fit-content;
  padding: 25px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}

#modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 0.5px solid var(--color-light-gray);
}

#modal-top > h4 {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-primary-strong);
}

#modal-top > img {
  width: 18px;
  height: 18px;
  transform: rotate(-90deg);
  cursor: pointer;
}

.button-container {
  display: flex;
  gap: 8px;
}

.modal-button {
  padding: 8px 45px;
  font-weight: 500;
  font-size: 15px;
  border-radius: 3px;
  cursor: pointer;
}

.modal-login-button {
  background-color: white;
  border: 1px solid #e14345;
  color: #e14345;
}

.modal-signup-button {
  border: none;
  background-color: #e14345;
  color: white;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 35px;
}

.menu-items {
  display: flex;
  gap: 16px;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

.menu-items > span {
  font-size: 15px;
  color: var(--color-dark-strong);
}

.menu-items:hover {
  background-color: #f1f1f1;
}

.menu-items > img {
  width: 25px;
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
