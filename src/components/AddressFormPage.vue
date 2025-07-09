<script setup>
import { ref, onMounted, nextTick } from 'vue'

const zipCode = ref('')
const addr1 = ref('')
const addr2 = ref('')
const isDefault = ref(false)

const zipCodeInput = ref(null)
const addr2Input = ref(null)

function toggleCheck() {
  isDefault.value = !isDefault.value
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

      zipCode.value = data.zonecode
      addr1.value = fullRoadAddr

      // 주소 입력된 후 상세주소로 포커스 이동
      nextTick(() => {
        addr2Input.value?.focus()
      })
    },
  }).open()
}

function handleSave() {
  if (!addr1.value || !addr2.value) {
    alert('주소를 모두 입력해주세요.')
    return
  }

  const newAddress = {
    id: Date.now(),
    zipCode: zipCode.value,
    address: addr1.value + ' ' + addr2.value,
    isDefault: isDefault.value,
  }

  if (window.opener) {
    window.opener.postMessage(newAddress, '*')
    window.close()
  }
}

onMounted(() => {
  if (!window.daum || !window.daum.Postcode) {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    document.body.appendChild(script)
  }
})
</script>

<template>
  <div class="mypage-address-form-page-container">
    <div class="mypage-address-form-title-container">
      <h2><span>더 행복한 한끼</span>를 위해</h2>
      <p>고객님의 집 앞까지 빠르고 안전하게 전해드리겠습니다.</p>
    </div>

    <div class="address-input-form-container">
      <div class="address-first-input-container">
        <input
          id="zip-code"
          type="text"
          :value="addr1"
          readonly
          ref="zipCodeInput"
          placeholder="주소를 검색해주세요"
        />
        <button id="zip-code-find-button" @click="showDaumApi">주소검색</button>
      </div>

      <input
        id="detail-address"
        type="text"
        v-model="addr2"
        placeholder="상세주소"
        ref="addr2Input"
      />

      <div class="do-you-want-default-address" @click="toggleCheck">
        <div class="default-address-check-box">
          <img
            :src="
              isDefault
                ? '/assets/icons/ic-mypage-full-check.png'
                : '/assets/icons/ic-mypage-empty-check.png'
            "
            alt="체크박스"
          />
        </div>
        <p>기본 배송지로 저장</p>
      </div>
    </div>

    <div class="new-address-submit-button" @click="handleSave">저장</div>
  </div>
</template>

<style scoped></style>
