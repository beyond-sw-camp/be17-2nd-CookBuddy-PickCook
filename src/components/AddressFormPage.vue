<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import mypageAPI from '@/api/mypage/index'
import { useRoute } from 'vue-router'

const route = useRoute()

const state = reactive({
  zipCode: '',
  addr1: '',
  addr2: '',
  isDefault: false,
  isEditMode: !!route.params.id,
  addressId: route.params.id || null,
  loading: false,
})

const zipCodeInput = ref(null)
const addr2Input = ref(null)

function toggleCheck() {
  state.isDefault = !state.isDefault
}

function showDaumApi() {
  new daum.Postcode({
    oncomplete: (data) => {
      let fullRoadAddr = data.roadAddress
      let extraRoadAddr = ''

      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname
      }
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraRoadAddr += extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName
      }
      if (extraRoadAddr !== '') {
        fullRoadAddr += ' (' + extraRoadAddr + ')'
      }

      state.zipCode = data.zonecode
      state.addr1 = fullRoadAddr

      nextTick(() => {
        addr2Input.value?.focus()
      })
    },
  }).open()
}

const loadExistingData = async () => {
  if (!state.isEditMode || !state.addressId) return

  state.loading = true
  try {
    const result = await mypageAPI.getAddress(state.addressId)
    if (result.success) {
      const address = result.data
      state.zipCode = address.postalCode || ''
      state.addr1 = address.roadAddress || ''
      state.addr2 = address.detailAddress || ''
      state.isDefault = address.isDefault || false
    } else {
      console.error('배송지 로딩 실패:', result.message)
      // postMessage로 받은 데이터가 있다면 그것을 사용
    }
  } catch (error) {
    console.error('배송지 로딩 실패:', error)
    // postMessage로 받은 데이터가 있다면 그것을 사용
  } finally {
    state.loading = false
  }
}

const handleSave = async () => {
  if (!state.addr1 || !state.addr2) {
    alert('주소를 모두 입력해주세요.')
    return
  }

  const addressData = {
    postalCode: state.zipCode,
    roadAddress: state.addr1,
    detailAddress: state.addr2,
    isDefault: state.isDefault,
  }

  state.loading = true
  try {
    let result
    if (state.isEditMode) {
      result = await mypageAPI.updateAddress(state.addressId, addressData)
    } else {
      result = await mypageAPI.createAddress(addressData)
    }

    if (result.success) {
      alert(result.message)

      if (window.opener) {
    window.opener.postMessage(
      {
        type: 'addressSaved',
        data: {
          postalCode: state.zipCode,
          roadAddress: state.addr1,
          detailAddress: state.addr2,
          fullAddress: state.addr1 + ' ' + state.addr2,
          isDefault: state.isDefault,
          addressId: state.addressId || result.data.addressId, // 새로 생성 시 ID
        },
      },
      '*' // 개발용, 배포 시 부모 origin 명시 ex.(프로토콜)://(프론트엔드서버 도메인):(포트번호)
    )
  }

  window.close()
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('주소 저장 실패:', error)
    alert('주소 저장에 실패했습니다.')
  } finally {
    state.loading = false
  }
}

onMounted(() => {
  if (!window.daum || !window.daum.Postcode) {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    document.body.appendChild(script)
  }
  loadExistingData()
})
</script>

<template>
  <div class="mypage-address-form-page-container">
    <div class="mypage-address-form-title-container">
      <h2>
        <span>{{ state.isEditMode ? '배송지 수정' : '새 배송지 추가' }}</span>
      </h2>
      <p>고객님의 집 앞까지 빠르고 안전하게 전해드리겠습니다.</p>
    </div>

    <div class="address-input-form-container">
      <div class="address-first-input-container">
        <input
          id="zip-code"
          type="text"
          :value="state.addr1"
          readonly
          ref="zipCodeInput"
          placeholder="주소를 검색해주세요"
        />
        <button id="zip-code-find-button" @click="showDaumApi">주소검색</button>
      </div>

      <input
        id="detail-address"
        type="text"
        v-model="state.addr2"
        placeholder="상세주소"
        ref="addr2Input"
      />

      <div class="do-you-want-default-address" @click="toggleCheck">
        <div class="default-address-check-box">
          <img
            :src="
              state.isDefault
                ? '/assets/icons/ic-mypage-full-check.png'
                : '/assets/icons/ic-mypage-empty-check.png'
            "
            alt="체크박스"
          />
        </div>
        <p>기본 배송지로 저장</p>
      </div>
    </div>

    <div class="new-address-submit-button" @click="handleSave" :disabled="state.loading">
      {{ state.loading ? '처리중...' : state.isEditMode ? '수정완료' : '저장' }}
    </div>
  </div>
</template>

<style scoped></style>
