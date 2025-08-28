<script setup>
import api from '@/api/community'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostListCard from '@/components/PostListCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()

const posts = reactive([])
const showDropdown = ref(false)
const sortDirection = ref('DESC')
const searchKeyword = ref('')

const pageResponse = reactive({
  content: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 10,
})

// 라우터 쿼리 값 → 상태 동기화
const updateFromQuery = () => {
  searchKeyword.value = route.query.keyword || ''
  sortDirection.value = route.query.dir || 'DESC'
  pageResponse.currentPage = parseInt(route.query.page) || 0
}

// 게시글 API 호출
const getPostList = async () => {
  const data = await api.getPostList(
    pageResponse.currentPage,
    sortDirection.value,
    searchKeyword.value,
  )
  if (data && data.success) {
    posts.splice(0, posts.length, ...data.results.content)
    pageResponse.content = data.results.content
    pageResponse.currentPage = data.results.currentPage
    pageResponse.totalPages = data.results.totalPages
    pageResponse.totalElements = data.results.totalElements
    pageResponse.size = data.results.size
  } else {
    posts.splice(0)
    pageResponse.content = []
    pageResponse.totalPages = 0
    pageResponse.totalElements = 0
  }
}

// 페이지 변경
const loadPage = (newPage) => {
  router.push({
    query: {
      ...route.query,
      page: newPage,
    },
  })
}

// 정렬 변경
const sortPostList = (direction) => {
  router.push({
    query: {
      ...route.query,
      dir: direction,
    },
  })
}

// route.query 변화 감지 → 상태 동기화 + API 호출
watch(
  () => route.query,
  () => {
    updateFromQuery()
    getPostList()
  },
  { immediate: true },
)
</script>
<template>
  <!-- 필터 섹션 -->
  <div class="filter-section">
    <div class="filter-container" @click="showDropdown = !showDropdown">
      <span class="filter-tag">정렬 &nbsp;▼</span>
    </div>
  </div>
  <div v-if="showDropdown" class="dropdown-menu">
    <p class="dropdown-item" @click="sortPostList('ASCE')">최신순</p>
    <p class="dropdown-item" @click="sortPostList('DESC')">오래된순</p>
  </div>

  <!-- 컨텐츠 섹션 -->
  <div class="content-section">
    <div class="c-content-container">
      <p class="c-posts-count">전체 {{ pageResponse.totalElements }}개</p>
      <p v-if="pageResponse.totalElements == 0" class="c-no-result">검색 결과가 없습니다.</p>
      <PostListCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>

  <Pagination
    :currentPage="pageResponse.currentPage"
    :totalPages="pageResponse.totalPages"
    @changePage="loadPage"
  />
</template>

<style scoped>
.c-no-result {
  padding: 16px;
  text-align: center;
}

.dropdown-menu {
  position: absolute;
  width: fit-content;
  background-color: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: flex;
  padding: 8px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}

.dropdown-item:hover {
  background-color: rgb(244, 244, 244);
}
</style>
