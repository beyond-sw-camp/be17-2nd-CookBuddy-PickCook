<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import MyPageSubMenuBar from '@/components/MyPageSubMenuBar.vue'

const route = useRoute() // 현재 경로 확인해서 하위 라우터 제목에 알맞은 내용을 넣기 위해 사용
const router = useRouter()

// 페이지 제목 매핑 (내 활동에서 갈 수 있는 경로들은 같이 노출돼서 따로 빼두었습니다.)
const pageTitleMap = {
  cart: '장바구니',
  order_list: '주문내역',
  write_list: '게시글',
  user_info: '내 프로필',
}

// '내 활동'에 해당하는 경로 목록
const activityRoutes = [
  { path: 'like_list', label: '좋아요' },
  { path: 'scrap_list', label: '스크랩' },
  { path: 'reply_list', label: '댓글' },
]

// 현재 하위 경로 찾기 (mypage/ 이후)
const currentSubPath = computed(() => route.path.split('/').pop())

// 현재 하위 경로가 '내 활동'인지 여부
const isActivityPage = computed(() =>
  activityRoutes.some((item) => item.path === currentSubPath.value),
)

// '내 활동'이 아닐 경우의 하위 페이지 제목
const currentTitle = computed(() => pageTitleMap[currentSubPath.value] || '')

// '내 활동'일 경우 탭 클릭 시 라우팅
function goToActivity(path) {
  router.push(`/mypage/${path}`)
}
</script>

<template>
  <div class="mypage-body">
    <div class="mypage-body-child">
      <!-- 서브바 들어갈 부분 -->
      <MyPageSubMenuBar />

      <!-- 내용 부분 -->
      <div class="mypage-main">
        <!-- 내용 인디케이터 -->
        <div class="mypage-main-header">
          <div class="mypage-indicator-container">
            <!-- '내 활동' 페이지일 경우: 탭 3개 -->
            <template v-if="isActivityPage">
              <div
                v-for="item in activityRoutes"
                :key="item.path"
                class="mypage-indicator-items"
                :class="{ active: currentSubPath === item.path }"
                @click="goToActivity(item.path)"
              >
                <span>{{ item.label }}</span>
              </div>
            </template>

            <!-- '내 활동' 페이지가 아닌 일반 페이지일 경우: 제목 하나 -->
            <template v-else>
              <div id="none-cursor" class="mypage-indicator-items">
                <span>{{ currentTitle }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- 내용 -->
        <div class="mypage-main-contents-body">
          <!-- 하위 라우터 내용 들어갈 부분 -->
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
