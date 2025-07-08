<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activePath = ref(route.path.split('/').pop())

const goTo = (path) => {
  activePath.value = path
  router.push(`/mypage/${path}`)
}

// 경로가 수정되면 자동 실행 (감시대상 : route.path)
watch(
  () => route.path,
  (newPath) => {
    activePath.value = newPath.split('/').pop()
  },
)
</script>

<template>
  <div class="mypage-sub-bar-container">
    <div
      class="mypage-sub-bar-items"
      :class="{ active: activePath === 'cart' }"
      @click="goTo('cart')"
    >
      <div class="mypage-sub-bar-items-el">
        <div class="mypage-icon mypage-icon-cart"></div>
        <span class="mypage-sub-bar-el-name">장바구니</span>
      </div>
    </div>
    <div
      class="mypage-sub-bar-items"
      :class="{ active: activePath === 'order_list' }"
      @click="goTo('order_list')"
    >
      <div class="mypage-sub-bar-items-el">
        <div class="mypage-icon mypage-icon-check"></div>
        <span class="mypage-sub-bar-el-name">구매목록</span>
      </div>
    </div>
    <div
      class="mypage-sub-bar-items"
      :class="{ active: activePath === 'write_list' }"
      @click="goTo('write_list')"
    >
      <div class="mypage-sub-bar-items-el">
        <div class="mypage-icon mypage-icon-write"></div>
        <span class="mypage-sub-bar-el-name">게시글</span>
      </div>
    </div>
    <div
      class="mypage-sub-bar-items"
      :class="{ active: ['like_list', 'scrap_list', 'reply_list'].includes(activePath) }"
      @click="goTo('like_list')"
    >
      <div class="mypage-sub-bar-items-el">
        <div class="mypage-icon mypage-icon-scrap"></div>
        <span class="mypage-sub-bar-el-name">내 활동</span>
      </div>
    </div>
    <div
      class="mypage-sub-bar-items"
      :class="{ active: activePath === 'user_info' }"
      @click="goTo('user_info')"
    >
      <div class="mypage-sub-bar-items-el">
        <div class="mypage-icon mypage-icon-user"></div>
        <span class="mypage-sub-bar-el-name">내 프로필</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
