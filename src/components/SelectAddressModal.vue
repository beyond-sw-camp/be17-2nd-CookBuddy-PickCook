<script setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import mypageAPI from '@/api/mypage/index'
import AddressCard from './AddressCard.vue'

const state = reactive({
  addresses: [],
  loading: false,
  selectedId: null,
})

const emit = defineEmits(['close'])
const close = () => {
  const selectedAddress = state.addresses.find((addr) => addr.addressId === state.selectedId)

  if (selectedAddress) {
    // 부모 컴포넌트로 데이터 전달
    emit('close', {
      postalCode: selectedAddress.postalCode,
      roadAddress: selectedAddress.roadAddress,
      detailAddress: selectedAddress.detailAddress,
      fullAddress: selectedAddress.fullAddress,
    })
  } else {
    // 선택된 주소가 없으면 그냥 닫기
    emit('close', null)
  }
}

const onSelect = (addressId) => {
  state.selectedId = addressId
}

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
    }
  } catch (error) {
    console.error('배송지 목록 로드 중 오류:', error)
  } finally {
    state.loading = false
  }
}

function onEditAddress(address) {
  const popupWindow = openPopup(`/mypage/address/edit/${address.addressId}`)

  setTimeout(() => {
    if (popupWindow) {
      popupWindow.postMessage(
        {
          type: 'editData',
          data: {
            addressId: address.addressId,
            postalCode: address.postalCode,
            roadAddress: address.roadAddress,
            detailAddress: address.detailAddress,
            isDefault: address.isDefault,
          },
        },
        window.location.origin,
      )
    }
  }, 500)
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

function handleAddressMessage(event) {
  console.log('[SelectAddressModal] message event:', event.origin, event.data)

  if (event.data && event.data.type === 'addressSaved') {
    const savedAddress = event.data.data
    console.log('새로 저장된 주소:', savedAddress)
    loadAddresses()
  }
}

onMounted(() => {
  loadAddresses()
  window.addEventListener('message', handleAddressMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleAddressMessage)
})
</script>

<template>
  <!-- 배경 -->
  <div id="select-address-modal-backdrop" @click.self="close">
    <!-- 모달 박스 -->
    <div class="select-address-modal-body">
      <div class="select-address-modal-header">배송지 선택</div>
      <div class="select-address-item-list">
        <div id="small-padding"></div>

        <!-- 로딩 상태 -->
        <div v-if="state.loading" style="text-align: center; padding: 20px">
          <p>배송지 목록을 불러오는 중...</p>
        </div>

        <!-- 배송지 목록 -->
        <!-- 배송지 목록 -->
        <template v-else>
          <div v-if="state.addresses.length">
            <AddressCard
              v-for="item in state.addresses"
              :key="item.addressId"
              :address="item.fullAddress"
              :isDefault="item.isDefault"
              :isSelected="item.addressId === state.selectedId"
              @click="onSelect(item.addressId)"
              @edit="onEditAddress(item)"
            />
          </div>
          <div v-else class="no-delivery-register">
            <p>등록된 배송지가 없습니다.</p>
          </div>
        </template>
      </div>

      <div class="select-address-button-container">
        <button @click="close">완료</button>
        <button @click="() => openPopup('/mypage/address/new')">새 배송지 추가</button>
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
  padding: 0 15px;
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
  min-height: 10px;
}

.no-delivery-register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 180px;
  font-size: 14px;
}
</style>
