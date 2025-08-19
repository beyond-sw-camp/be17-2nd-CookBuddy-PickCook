<script setup>
import { reactive, onMounted, nextTick } from 'vue'

const form = reactive({
  zipCode: '',
  addr1: '',
  addr2: '',
  isDefault: false,
})

const refs = reactive({
  zipCodeInput: null,
  addr2Input: null,
})

function toggleCheck() {
  form.isDefault = !form.isDefault
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

      form.zipCode = data.zonecode
      form.addr1 = fullRoadAddr

      // 주소 입력된 후 상세주소로 포커스 이동
      nextTick(() => {
        refs.addr2Input?.focus()
      })
    },
  }).open()
}

function handleSave() {
  if (!form.addr1 || !form.addr2) {
    alert('주소를 모두 입력해주세요.')
    return
  }

  const newAddress = {
    id: Date.now(),
    zipCode: form.zipCode,
    address: form.addr1 + ' ' + form.addr2,
    isDefault: form.isDefault,
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
      <h2><span>주소 입력</span></h2>
      <p>정확한 주소를 입력해주세요.</p>
    </div>

    <div class="address-input-form-container">
      <div class="address-first-input-container">
        <input
          id="zip-code"
          type="text"
          :value="form.addr1"
          readonly
          :ref="(el) => (refs.zipCodeInput = el)"
          placeholder="주소를 검색해주세요"
        />
        <button id="zip-code-find-button" @click="showDaumApi">주소검색</button>
      </div>

      <input
        id="detail-address"
        type="text"
        v-model="form.addr2"
        placeholder="상세주소"
        :ref="(el) => (refs.addr2Input = el)"
      />
    </div>

    <div class="new-address-submit-button" @click="handleSave">저장</div>
  </div>
</template>

<style scoped></style>
