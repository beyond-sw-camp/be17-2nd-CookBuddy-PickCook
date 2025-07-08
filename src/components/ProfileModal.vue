<script setup>
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useUserStore()

const goToMypage = () => {
  router.push('/mypage')
}
const logout = () => {
  router.push('/login')
  auth.proceedLogout()
}
</script>

<template>
  <div class="profile-modal-container">
    <div @click="goToMypage">마이페이지</div>
    <div @click="logout">로그아웃</div>
    <div>회원 탈퇴</div>
  </div>
</template>

<style scoped></style>
