<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0, // 현재 평점
  },
  max: {
    type: Number,
    default: 5, // 최대 별 개수
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

function setRating(value) {
  if (!props.readonly) {
    emit('update:modelValue', value) // 부모로 값 전달
  }
}

function isFilled(value) {
  return props.modelValue >= value
}
</script>

<template>
  <div class="star-rating">
    <span
      v-for="value in stars"
      :key="value"
      class="star"
      :class="{ filled: isFilled(value) }"
      @click="setRating(value)"
    >
      ★
    </span>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  cursor: pointer;
  font-size: 2rem;
  color: #ddd;
}
.star {
  transition: color 0.2s;
  user-select: none;
}
.star.filled {
  color: gold;
}
</style>
