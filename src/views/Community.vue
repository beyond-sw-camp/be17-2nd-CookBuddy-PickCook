<script setup>
import api from '@/api/community';
import { onMounted, reactive } from 'vue';
import CommunityCard from '@/components/CommunityCard.vue';

const communityList = reactive([]);

const getCommunityList = async () => {
  const data = await api.communityList();
  if (data && data.success && data.results) {
    console.log(data);
    communityList.push(...data.results);
  } else {
    communityList.splice(0);
  }
};

onMounted(() => {
  getCommunityList();
});
</script>

<template>
  <!-- 필터 섹션 -->
  <div class="filter-section">
    <div class="filter-container">
      <span class="filter-tag">정렬 &nbsp;▼</span>
      <span class="filter-tag">분류 &nbsp;▼</span>
    </div>
  </div>

  <!-- 컨텐츠 섹션 -->
  <div class="content-section">
    <div class="c-content-container">
      <CommunityCard v-for="post in communityList" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<style scoped></style>