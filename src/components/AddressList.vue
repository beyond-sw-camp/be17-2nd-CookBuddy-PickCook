<script setup>
import { reactive, onMounted } from 'vue'
import AddressCard from './AddressCard.vue'
import mypageAPI from '@/api/mypage/index'

const state = reactive({
  addresses: [],
  loading: false,
  selectedId: null,
})

const loadAddresses = async () => {
  state.loading = true

  try {
    const result = await mypageAPI.getAddresses()

    if (result.success) {
      state.addresses = result.data

      const defaultAddress = state.addresses.find((addr) => addr.isDefault)
      if (defaultAddress) {
        state.selectedId = defaultAddress.addressId
      }
    } else {
      console.error('배송지 목록 로드 실패:', result.message)
      alert(result.message)
      state.addresses = []
    }
  } catch (error) {
    console.error('배송지 목록 로드 중 예외 발생:', error)
    alert('배송지 목록을 불러오는 중 오류가 발생했습니다.')
    state.addresses = []
  } finally {
    state.loading = false
  }
}

function onSelect(addressId) {
  state.selectedId = addressId
}

const onDeleteAddress = async (addressId) => {
  try {
    const result = await mypageAPI.deleteAddress(addressId)

    if (result.success) {
      alert(result.message)
      await loadAddresses()
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('배송지 삭제 중 오류:', error)
    alert('배송지 삭제 중 오류가 발생했습니다.')
  }
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

function onEditAddress(address) {
  const popupWindow = openPopup(`/mypage/address/edit/${address.addressId}`)

  // 팝업 창이 닫힌 후 새로고침하도록 폴링 방식 적용
  const checkClosed = setInterval(() => {
    if (popupWindow.closed) {
      clearInterval(checkClosed)
      loadAddresses() // 팝업 닫힌 후 목록 새로고침
    }
  }, 500)
}

onMounted(() => {
  loadAddresses() // 추가
})
</script>

<template>
  <div class="mypage-address-body">
    <!-- 로딩 상태 -->
    <div v-if="state.loading" class="loading-container">
      <p>배송지 목록을 불러오는 중...</p>
    </div>

    <!-- 배송지 목록 -->
    <div v-else-if="state.addresses.length > 0" class="mypage-main-content-scroll">
      <AddressCard
        v-for="item in state.addresses"
        :key="item.addressId"
        :address="item.fullAddress"
        :isDefault="item.isDefault"
        :isSelected="item.addressId === state.selectedId"
        @click="onSelect(item.addressId)"
        @edit="onEditAddress(item)"
        @delete="onDeleteAddress(item.addressId)"
      />
    </div>

    <!-- 배송지 없음 -->
    <div v-else class="empty-address-container">
      <p>등록된 배송지가 없습니다.</p>
      <p>새 배송지를 추가해보세요.</p>
    </div>
  </div>

  <div class="mypage-address-button-container-parents">
    <button class="mypage-address-add" @click="() => openPopup('/mypage/address/new')">
      배송지 추가
    </button>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
}

.empty-address-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
  text-align: center;
}

.empty-address-container p {
  margin: 8px 0;
}
</style>
