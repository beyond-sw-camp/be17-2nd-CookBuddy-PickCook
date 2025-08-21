<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
<div class="payment-layout-body">
    <span>{{ props.title }}</span>
    <div class="payment-layout-content">
        <slot></slot>
    </div>
</div>
</template>

<style scoped>
.payment-layout-body {
    width: 100%;
    margin-bottom: 75px;
}

span {
    padding: 10px 8px;
    font-size: 16px;
}

.payment-layout-content {
    border-top: 1px solid black;
    background-color: #F8F8F8;
    margin-top: 8px;
}
</style>