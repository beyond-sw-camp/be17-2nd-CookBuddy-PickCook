<script setup>
import { ref, onMounted } from 'vue'
import AddressCard from './AddressCard.vue'

const addresses = ref([
  { id: 1, address: '경상남도 양산시 양양양 보라아파트 111동 111호', isDefault: true },
  { id: 2, address: '서울특별시 강남구 테헤란로 123', isDefault: false },
  { id: 3, address: '부산광역시 해운대구 센텀로 45', isDefault: false },
])

const selectedId = ref(addresses.value.find((addr) => addr.isDefault)?.id || null)

function onSelect(id) {
  selectedId.value = id
}

function openPopup(relativePath) {
  const width = 500
  const height = 650
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2

  return window.open(
    `${window.location.origin}${relativePath}`,
    '배송지팝업',
    `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`,
  )
}

function handleNewAddressMessage(event) {
  const newData = event.data
  if (!newData || typeof newData !== 'object' || !newData.address || !newData.zipCode) {
    return
  }

  if (newData.isDefault) {
    addresses.value.forEach((a) => (a.isDefault = false))
  }

  const newItem = {
    id: Date.now(),
    address: newData.address,
    isDefault: newData.isDefault || false,
  }

  addresses.value.push(newItem)

  if (newItem.isDefault) {
    selectedId.value = newItem.id
  }
}

function onEditAddress(address) {
  const popupWindow = openPopup(`/mypage/address/edit/${address.id}`)

  setTimeout(() => {
    if (popupWindow) {
      popupWindow.postMessage({ type: 'editData', data: address }, window.location.origin)
    }
  }, 500)
}

onMounted(() => {
  window.addEventListener('message', handleNewAddressMessage)
})
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
          @edit="onEditAddress(item)"
        />
      </div>
    </div>

    <div class="mypage-address-button-container-parents">
      <button class="mypage-address-add" @click="() => openPopup('/mypage/address/new')">
        배송지 추가
      </button>
    </div>
  </div>
</template>

<style scoped></style>
