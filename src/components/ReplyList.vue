<script setup>
import { ref, onMounted } from 'vue'
import MyWritePostItemCard from './MyPagePostItemCard.vue'

const posts = ref([])

onMounted(() => {
  posts.value = [
    {
      id: 1,
      title: '하나씩 집어먹다보면 언제 다 먹었나 싶은 식빵카라멜팝콘',
      content:
        '요즘 날이 더우니 집에서 공포영화 많이 보시죠? 그럴 때 간식으로 무얼 드시나요? 저는 요즘 아이들에게 식빵으로 만든 카라멜 팝콘을',
      image: 'https://i.pinimg.com/564x/60/fd/cd/60fdcde2b778fc412982d318adb27dad.jpg',
      createdAt: '2014.08.10',
      views: 56,
      likes: 789,
      comments: 34,
    },
    {
      id: 2,
      title: '아플 때 먹기 좋은 야채죽',
      content:
        '혼자 있을 때 아프면 챙겨먹기도 힘들잖아요. 그럴 때 손쉽게 금방 만들 수 있는 야채죽 레시피 공유할게요.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdfNgIeUGhVmQUQNQ_d3QlGLW7dt9Cx5GuNQ&s',
      createdAt: '2025.07.06',
      views: 132,
      likes: 213,
      comments: 19,
    },
    {
      id: 3,
      title: '이거 뭔가요..? 먹어도 되는건가요?',
      content: '냉장고에 있던 치즈를 꺼냈는데.. 이 파란 거는 무엇인거죠?????',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6vXxzxQsFP0Whmpr-R_tkop1OxA4nB6-UqQ&s',
      createdAt: '2025.07.04',
      views: 97,
      likes: 354,
      comments: 41,
    },
  ]
})

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
}
</script>

<template>
  <div class="mypage-my-order-list-container">
    <div class="mypage-header-box">
      <div class="mypage-header-box-title">댓글 단 게시글</div>

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
      <div class="mypage-main-content-scroll">
        <MyWritePostItemCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :showActions="false"
        />
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
