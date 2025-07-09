<script setup>
import { ref } from 'vue'
import AddressCard from './AddressCard.vue'

const addresses = ref([
  { id: 1, address: '경상남도 양산시 양양양 보라아파트 111동 111호', isDefault: true },
  { id: 2, address: '서울특별시 강남구 테헤란로 123', isDefault: false },
  { id: 3, address: '부산광역시 해운대구 센텀로 45', isDefault: false },
])

// isDefault: true인 항목의 id를 초기 선택값으로
const selectedId = ref(addresses.value.find((addr) => addr.isDefault)?.id || null)

function onSelect(id) {
  selectedId.value = id
}
</script>

<template>
  <div class="mypage-content-container">
    <div class="mypage-header-box">
      <div class="mypage-header-box-title">배송지 관리</div>
    </div>

    <div class="mypage-address-body">
      <div class="mypage-main-content-scroll">
        <AddressCard
          v-for="item in addresses"
          :key="item.id"
          :address="item.address"
          :isDefault="item.isDefault"
          :isSelected="item.id === selectedId"
          @click="onSelect(item.id)"
        />
      </div>
    </div>

    <div class="mypage-address-button-container-parents">
      <button class="mypage-address-add">배송지 추가</button>
    </div>
  </div>
</template>

<style scoped></style>
