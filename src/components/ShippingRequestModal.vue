<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  user: { type: Object, default: () => ({}) } // 부모에서 전달받는 유저 정보
})

// 체크박스 상태 (주문자 정보와 동일)
const isDefault = ref(false)
const toggleCheck = () => {
  isDefault.value = !isDefault.value
}

// input 상태
const recipient = ref("") // 받으실 분
const phone = ref("") // 핸드폰
const requestMessage = ref("") // 배송 요청사항

// 체크박스가 변경될 때 유저 정보 자동 입력
watch(isDefault, (newVal) => {
  if (newVal && props.user) {
    recipient.value = props.user.name || ""
    phone.value = props.user.phone || ""
  } else if (!newVal) {
    recipient.value = ""
    phone.value = ""
  }
})

// 라디오 버튼 상태 (받으실 장소)
const selectedPlace = ref("문 앞") // 기본 선택값
const handleClick = (place) => { selectedPlace.value = place }

const emit = defineEmits(["close", "save"])
const close = () => { emit("close") }
const save = () => {
  emit("save", {
    receiverName: recipient.value,
    receiverPhone: phone.value,
    deliveryPlace: selectedPlace.value,
    requestMessage: requestMessage.value
  })
  close() // 모달 닫기
}
</script>

<template>
  <div id="shipping-request-modal-backdrop" @click.self="close">
    <div class="shipping-request-modal-body">
      <div class="shipping-request-modal-header">
        <p>배송 요청사항</p>
        <div>
          <div class="shipping-request-modal-check-box" @click="toggleCheck">
            <img
              :src="
                isDefault
                  ? '/assets/icons/ic-mypage-full-check.png'
                  : '/assets/icons/ic-mypage-empty-check.png'
              "
              alt="체크박스"
            />
          </div>
          <p>주문자 정보와 동일</p>
        </div>
      </div>

      <div class="shipping-request-modal-input-container">
        <p>받으실 분<span>*</span></p>
        <input type="text" v-model="recipient"/>
      </div>

      <div class="shipping-request-modal-input-container">
        <p>핸드폰<span>*</span></p>
        <input type="tel" v-model="phone"/>
      </div>

      <div class="shipping-request-modal-input-container">
        <p>받으실 장소<span>*</span></p>
        <label>
          <div class="shipping-request-modal-radio-button-container" @click="handleClick('문 앞')">
            <div v-if="selectedPlace === '문 앞'" class="shipping-request-box-red-circle">
              <div></div>
            </div>

            <div v-else class="shipping-request-box-gray-circle"></div>
          </div>
          문 앞
        </label>
        <label>
          <div class="shipping-request-modal-radio-button-container" @click="handleClick('택배 보관함')">
            <div v-if="selectedPlace === '택배 보관함'" class="shipping-request-box-red-circle">
              <div></div>
            </div>

            <div v-else class="shipping-request-box-gray-circle"></div>
          </div>
          택배 보관함
        </label>
        <label>
          <div class="shipping-request-modal-radio-button-container" @click="handleClick('공동현관 앞')">
            <div v-if="selectedPlace === '공동현관 앞'" class="shipping-request-box-red-circle">
              <div></div>
            </div>

            <div v-else class="shipping-request-box-gray-circle"></div>
          </div>
          공동현관 앞
        </label>
        <label>
          <div class="shipping-request-modal-radio-button-container" @click="handleClick('기타')">
            <div v-if="selectedPlace === '기타'" class="shipping-request-box-red-circle">
              <div></div>
            </div>

            <div v-else class="shipping-request-box-gray-circle" @click="handleClick"></div>
          </div>
          기타
        </label>
        <input v-if="selectedPlace === '기타'" id="etc-input-tag" type="text" />
      </div>

      <div class="shipping-request-modal-notice-box">
        <span><img src="/assets/icons/ic-attention.png" alt="확인" /> 확인해주세요!</span>
        정확한 배송을 위해 장소의 특징 또는 출입 방법 등을 자세하게 작성해주세요.<br />
        요청하신 장소로 배송이 어려운 경우, 부득이하게 1층 공동현관 앞에 배송 될 수 있습니다.
      </div>

      <div class="shipping-request-modal-input-container">
        <p>배송 요청사항</p>
        <input
          type="text"
          placeholder="공동현관 출입번호나 기사님께 전달할 말씀이 있으시면 작성해주세요."
          v-model="requestMessage"
        />
      </div>

      <div class="shipping-request-button-container">
        <button @click="close">취소</button>
        <button @click="save">동의하고 저장</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#shipping-request-modal-backdrop {
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

.shipping-request-modal-body {
  background-color: white;
  border-radius: 5px;
  width: 500px;
  z-index: 1000;
  padding-bottom: 15px;
  max-height: 650px;
  overflow-y: auto;
}

.shipping-request-modal-header {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 15px;
  border-bottom: 0.5px solid #f4f4f4;
}

.shipping-request-modal-header > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shipping-request-modal-check-box > img {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 5px;
}

.shipping-request-modal-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 20px;
}

.shipping-request-modal-input-container span {
  color: red;
  font-weight: 600;
}

.shipping-request-modal-input-container > input {
  height: 44px;
  border: 0.5px solid var(--color-light-gray);
  border-radius: 5px;
}

.shipping-request-modal-input-container > label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 2px;
}

.shipping-request-modal-radio-button-container {
  cursor: pointer;
  margin-top: 2px;
}

.shipping-request-box-red-circle {
  background-color: var(--color-primary);
  width: 18px;
  height: 18px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shipping-request-box-red-circle > div {
  background-color: white;
  width: 9px;
  height: 9px;
  border-radius: 100%;
}

.shipping-request-box-gray-circle {
  border: 0.5px solid var(--color-light-gray);
  width: 18px;
  height: 18px;
  border-radius: 100%;
}

#etc-input-tag {
  margin: 3px 5px 0;
}

input {
  padding: 8px 12px;
}

.shipping-request-modal-notice-box {
  margin: 10px 20px;
  padding: 15px 20px;
  background-color: #ffeeef;
  color: var(--color-primary);
  font-size: 14px;
}

.shipping-request-modal-notice-box img {
  width: 20px;
  margin-top: 1px;
}

.shipping-request-modal-notice-box > span {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  margin-bottom: 3px;
}

.shipping-request-button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 20px;
  border-top: 0.5px solid #f4f4f4;
  margin-top: 10px;
}

.shipping-request-button-container > button {
    height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  font-size: 15px;
}

.shipping-request-button-container > button:first-child {
    flex: 1;
  border: 0.5px solid #ececec;
}

.shipping-request-button-container > button:first-child:hover {
    background-color: #dfdfdf;
}

.shipping-request-button-container > button:last-child {
    flex: 3;
  background-color: var(--color-primary);
  border: none;
  color: white;
}

.shipping-request-button-container > button:last-child:hover {
    background-color: var(--color-primary-dark);
}
</style>
