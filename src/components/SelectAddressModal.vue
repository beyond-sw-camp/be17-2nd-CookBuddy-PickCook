<script setup>
import { ref } from 'vue'
import AddressCard from './AddressCard.vue'

const addresses = ref([
  { id: 1, address: '경상남도 양산시 양양양 보라아파트 111동 111호', isDefault: true },
  { id: 2, address: '서울특별시 강남구 테헤란로 123', isDefault: false },
  { id: 3, address: '부산광역시 해운대구 센텀로 45', isDefault: false },
])

const emit = defineEmits(['close'])
const close = () => {
  emit('close')
}

const selectedId = ref(addresses.value.find((addr) => addr.isDefault)?.id || null)
const onSelect = (id) => {
  selectedId.value = id
}

function onEditAddress(address) {
  const popupWindow = openPopup(`/mypage/address/edit/${address.id}`)

  setTimeout(() => {
    if (popupWindow) {
      popupWindow.postMessage({ type: 'editData', data: address }, window.location.origin)
    }
  }, 500)
}
</script>

<template>
  <!-- 배경 -->
  <div id="select-address-modal-backdrop" @click.self="close">
    <!-- 모달 박스 -->
    <div class="select-address-modal-body">
      <div class="select-address-modal-header">배송지 선택</div>
      <div class="select-address-item-list">
        <div id="small-padding"></div>
        <AddressCard
          v-for="item in addresses"
          :key="item.id"
          :address="item.address"
          :isDefault="item.isDefault"
          :isSelected="item.id === selectedId"
          @click="onSelect(item.id)"
          @edit="onEditAddress(item)"
        />
      </div>

      <div class="select-address-button-container">
        <button @click="close">완료</button>
        <button>새 배송지 추가</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#select-address-modal-backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: auto;
}

.select-address-modal-header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0 15px;
  border-bottom: 0.5px solid #f4f4f4;
}

.select-address-modal-body {
  background-color: white;
  border-radius: 5px;
  width: 500px;
  z-index: 1000;
  padding-bottom: 15px;
}

.select-address-item-list {
  max-height: 500px;
  overflow-y: auto;
}

.select-address-button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 20px;
  border-top: 0.5px solid #f4f4f4;
}

.select-address-button-container > button:first-child {
  flex: 1;
  background-color: var(--color-primary);
  border: none;
  color: white;
}

.select-address-button-container > button:first-child:hover {
  background-color: var(--color-primary-dark);
}

.select-address-button-container > button:last-child {
  flex: 3;
  border: 0.5px solid #ececec;
}

.select-address-button-container > button:last-child:hover {
  background-color: #dfdfdf;
}

.select-address-button-container > button {
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  font-size: 15px;
}

#small-padding {
    height: 10px;
}
</style>
