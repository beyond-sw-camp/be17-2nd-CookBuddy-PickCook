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
      image:
        'https://i.pinimg.com/564x/60/fd/cd/60fdcde2b778fc412982d318adb27dad.jpg',
      createdAt: '2014.08.10',
      views: 56,
      likes: 789,
      comments: 34,
    },
    {
      id: 2,
      title: '아플 때 먹기 좋은 야채죽',
      content: '혼자 있을 때 아프면 챙겨먹기도 힘들잖아요. 그럴 때 손쉽게 금방 만들 수 있는 야채죽 레시피 공유할게요.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdfNgIeUGhVmQUQNQ_d3QlGLW7dt9Cx5GuNQ&s',
      createdAt: '2025.07.06',
      views: 132,
      likes: 213,
      comments: 19,
    },
    {
      id: 3,
      title: '이거 뭔가요..? 먹어도 되는건가요?',
      content: '냉장고에 있던 치즈를 꺼냈는데.. 이 파란 거는 무엇인거죠?????',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6vXxzxQsFP0Whmpr-R_tkop1OxA4nB6-UqQ&s',
      createdAt: '2025.07.04',
      views: 97,
      likes: 354,
      comments: 41,
    },
  ]
})
</script>

<template>
  <div class="mypage-main-content-scroll">
    <MyWritePostItemCard v-for="post in posts" :key="post.id" :post="post" :showActions="false"/>
  </div>
</template>

<style scoped>

</style>