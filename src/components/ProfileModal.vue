<script setup>
import { useUserStore } from '@/store/useUserStore'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const auth = useUserStore()
const route = useRoute()

const goToMypage = () => {
  router.push('/mypage')
}

const logout = async () => {
  const result = await auth.logout() // ✅ logout으로 변경

  if (result.success) {
    const isAuthRequired = route.meta?.requiresAuth

    if (isAuthRequired) {
      router.replace('/login')
    } else {
      console.log('현재 위치에서 로그아웃 완료')
      router.replace('/')
    }
  }
}
</script>

<template>
  <div class="profile-modal-container">
    <div @click="goToMypage">마이페이지</div>
    <div @click="logout">로그아웃</div>
  </div>
</template>

<style scoped></style>
