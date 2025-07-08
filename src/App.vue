<script setup>
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useUserStore } from './store/useUserStore'
const router = useRouter()
const auth = useUserStore()
auth.restore()
</script>

<template>
  <Header v-if="!router.currentRoute.value.meta?.hideLayout" />
  <RouterView />
  <Footer v-if="!router.currentRoute.value.meta?.hideLayout" />
</template>

<style scoped></style>
