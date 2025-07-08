<script setup>
import { ref, onMounted } from 'vue'
import MyWritePostItemCard from './MyPagePostItemCard.vue'

const posts = ref([])

onMounted(() => {
  posts.value = [
    {
      id: 1,
      title: '식탁보 하나로 맛의 완성도를 높이는 방법',
      content:
        '여러분들은 집에 식탁보 하나씩 가지고 있으신가요? 저는 없다가 최근에 선물로 받게 되면서 써보고 있는데...',
      image:
        'https://images.kolonmall.com/Prod_Img/10003512/2023/LL1/K1711330341098003NO01_LL1.jpg',
      createdAt: '2014.08.10',
      views: 56,
      likes: 789,
      comments: 34,
    },
    {
      id: 2,
      title: '혼밥족을 위한 심플한 테이블 세팅',
      content: '혼자 사는 분들도 분위기 있게 식사할 수 있는 방법 공유드려요.',
      image: 'https://oneandones.com/wp-content/uploads/2022/07/contin_2000_white_fb2.jpg',
      createdAt: '2025.07.06',
      views: 132,
      likes: 213,
      comments: 19,
    },
    {
      id: 3,
      title: '오늘의 테이블 데코 후기',
      content: '주말에 손님 초대해서 테이블 데코를 해봤어요. 분위기 최고였어요.',
      image: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1976/hot1604980439202.jpg',
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
    <MyWritePostItemCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<style scoped></style>
