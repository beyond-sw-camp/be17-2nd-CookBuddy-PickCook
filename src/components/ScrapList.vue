<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MyWritePostItemCard from './MyPagePostItemCard.vue'
import api from '@/api/mypage'

const posts = ref([])
const page = ref(0)
const size = ref(6)
const totalPages = ref(1)
const loading = ref(false)
const scrollContainer = ref(null)

const options = ['최신순', '오래된 순']
const selected = ref('최신순')
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = (option) => {
  selected.value = option
  isOpen.value = false
  page.value = 0
  loadPosts(true)
}

const loadPosts = async (reset = false) => {
  if (loading.value) return
  loading.value = true

  try {
    const sortType = selected.value === '오래된 순' ? 'oldest' : 'latest'
    const data = await api.getScrappedPosts(page.value, size.value, sortType)
    totalPages.value = data.totalPages

    if (reset) {
      posts.value = data.content
    } else {
      posts.value = [...posts.value, ...data.content]
    }
  } catch (error) {
    console.error('내 게시글 조회 실패:', error)
  } finally {
    loading.value = false
  }
}

// 무한 스크롤
const handleScroll = async () => {
  const el = scrollContainer.value
  if (!el || loading.value) return

  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && page.value + 1 < totalPages.value) {
    page.value += 1
    await loadPosts()
  }
}

onMounted(async () => {
  await loadPosts()

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="mypage-my-order-list-container">
    <div class="mypage-header-box">
      <div class="mypage-header-box-title">스크랩한 게시글</div>

      <div class="mypage-my-order-list-search-container">
        <div class="dropdown" @click="toggleDropdown" @blur="closeDropdown" tabindex="0">
          <div class="dropdown-toggle">
            {{ selected }}
            <span class="arrow" :class="{ open: isOpen }">▼</span>
          </div>
          <div class="dropdown-menu" v-if="isOpen">
            <div
              v-for="option in options"
              :key="option"
              class="dropdown-item"
              @click.stop="selectOption(option)"
            >
              {{ option }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mypage-body-box">
      <div class="mypage-main-content-scroll" ref="scrollContainer">
        <MyWritePostItemCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :showActions="false"
        />
        <div v-if="loading" class="loading-text">로딩 중...</div>
        <div v-if="!loading && posts.length === 0" class="empty-text">게시글이 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
  width: 100px;
  font-family: sans-serif;
  user-select: none;
  outline: none;
}

.dropdown-toggle {
  background-color: white;
  padding: 10px 15px;
  border: 1px solid var(--color-light-gray);
  border-radius: 5px;
  cursor: pointer;
  width: 125px;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #e9e9e9;
}

.arrow {
  float: right;
  transition: transform 0.2s;
}

.arrow.open {
  transform: rotate(180deg);
}
</style>
