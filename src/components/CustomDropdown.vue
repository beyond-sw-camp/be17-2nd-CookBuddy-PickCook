<template>
  <div class="custom-select" @click="toggleDropdown">
    <div class="selected">{{ modelValue || placeholder }} <span>▼</span></div>
    <ul v-if="isOpen" class="options">
      <li 
        v-for="option in options" 
        :key="option" 
        @click.stop="selectOption(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  options: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '선택' }
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emits('update:modelValue', option)
  isOpen.value = false
}

// 외부 클릭 시 닫기
const closeOnClickOutside = (e) => {
  if (!e.target.closest('.custom-select')) {
    isOpen.value = false
  }
}
document.addEventListener('click', closeOnClickOutside)
</script>

<style scoped>
.custom-select {
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  background: #fff;
  user-select: none;
  font-size: 13px;
}

.custom-select .selected {
  padding: 8px 10px;
}

.custom-select .options {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 38px;
  width: 100%;
  background: #fff;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.custom-select .options li {
  padding: 8px 10px;
}

.custom-select .options li:hover {
  background: #f0f0f0;
}

.selected {
    display: flex;
    justify-content: space-between;
    color: var(--color-gray);
}
</style>
