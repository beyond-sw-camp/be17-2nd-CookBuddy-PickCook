<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'

const route = useRoute()
const router = useRouter()
const auth = useUserStore()

watch(
  () => auth.state.user,
  (newUser) => {
    console.log('사용자 정보 변경됨:', newUser)
  },
  { immediate: true },
)

const activePath = ref(route.path.split('/').pop())

// 각 메뉴 항목 클릭 시 해당 경로로 이동
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
  <div class="mypage-sub-menu-bar">
    <!-- 인사말 -->
    <div class="mypage-sub-menu-each-container">
      <p id="mypage-sub-menu-bar-hello">
        반가워요!
        <span id="mypage-sub-menu-bar-user"> {{ auth.state.user?.nickname || '사용자' }} </span>님
        :)
      </p>
    </div>

    <!-- 내 정보관리 메뉴 -->
    <div class="mypage-sub-menu-each-container">
      <span class="mypage-sub-menu-bar-items-category">내 정보관리</span>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'user_info' }"
        @click="goTo('user_info')"
      >
        <img src="/public/assets/icons/ic-mypage-user.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">회원 정보 관리</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'address_list' }"
        @click="goTo('address_list')"
      >
        <img src="/public/assets/icons/ic-mypage-delivery.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">배송지 관리</p>
      </div>
    </div>

    <!-- 쇼핑 메뉴 -->
    <div class="mypage-sub-menu-each-container">
      <span class="mypage-sub-menu-bar-items-category">쇼핑</span>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'order_list' }"
        @click="goTo('order_list')"
      >
        <img src="/public/assets/icons/ic-mypage-order-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">주문 내역</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'cart' }"
        @click="goTo('cart')"
      >
        <img src="/public/assets/icons/ic-mypage-shopping-cart.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">장바구니</p>
      </div>
      <!-- <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'payment-method' }"
        @click="goTo('payment_method')"
      >
        <img src="/public/assets/icons/ic-mypage-credit_card.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">결제수단</p>
      </div> -->
    </div>

    <!-- 레시피 메뉴 -->
    <div class="mypage-sub-menu-each-container">
      <span class="mypage-sub-menu-bar-items-category">레시피</span>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'my_recipe_list' }"
        @click="goTo('my_recipe_list')"
      >
        <img src="/public/assets/icons/ic-mypage-write-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">내 레시피 관리</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'recipe_like_list' }"
        @click="goTo('recipe_like_list')"
      >
        <img src="/public/assets/icons/ic-mypage-like-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">좋아요 누른 레시피</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'recipe_scrap_list' }"
        @click="goTo('recipe_scrap_list')"
      >
        <img src="/public/assets/icons/ic-mypage-scrap-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">스크랩한 레시피</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'recipe_reply_list' }"
        @click="goTo('recipe_reply_list')"
      >
        <img src="/public/assets/icons/ic-mypage-reply-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">댓글 단 레시피</p>
      </div>
    </div>

    <!-- 커뮤니티 메뉴 -->
    <div class="mypage-sub-menu-each-container">
      <span class="mypage-sub-menu-bar-items-category">커뮤니티</span>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'write_list' }"
        @click="goTo('write_list')"
      >
        <img src="/public/assets/icons/ic-mypage-write-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">내 게시글 관리</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'like_list' }"
        @click="goTo('like_list')"
      >
        <img src="/public/assets/icons/ic-mypage-like-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">좋아요 누른 게시글</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'scrap_list' }"
        @click="goTo('scrap_list')"
      >
        <img src="/public/assets/icons/ic-mypage-scrap-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">스크랩한 게시글</p>
      </div>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'reply_list' }"
        @click="goTo('reply_list')"
      >
        <img src="/public/assets/icons/ic-mypage-reply-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">댓글 단 게시글</p>
      </div>
    </div>

    <!-- 리뷰 관리 -->
    <div class="mypage-sub-menu-each-container">
      <span class="mypage-sub-menu-bar-items-category">리뷰</span>
      <div
        class="mypage-sub-menu-bar-items"
        :class="{ active: activePath === 'my_review_list' }"
        @click="goTo('my_review_list')"
      >
        <img src="/public/assets/icons/ic-mypage-reply-list.png" alt="메뉴이미지" />
        <p class="mypage-sub-menu-title">내가 쓴 리뷰</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
