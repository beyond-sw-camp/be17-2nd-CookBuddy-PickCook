<script setup>
import { ref } from 'vue'

// 프로필 이미지 관련
const fileInput = ref(null)
const profileImage = ref(
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAlaTCW_H-l1mSyOngrADrGNhk2nTIl-iDew&s', // 기본 이미지
)

// 사용자 정보 관련
const email = ref('')
const nickname = ref('')
const name = ref('')
const phone = ref('')

// 프로필 이미지 파일 선택
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.')
    return
  }

  profileImage.value = URL.createObjectURL(file)

  // 서버 업로드 시 사용 예:
  // const formData = new FormData()
  // formData.append('profileImage', file)
  // await axios.post('/api/profile/upload', formData)
}

// 이메일 유효성 검사
const isValidEmail = (emailValue) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(emailValue)
}

// 전화번호 자동 하이픈 처리
const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11) // 숫자만 추출 (최대 11자리)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const onPhoneInput = (event) => {
  phone.value = formatPhoneNumber(event.target.value)
}

const onSubmit = () => {
  if (!isValidEmail(email.value)) {
    alert('유효한 이메일 주소를 입력하세요.')
    return
  }

  console.log('이메일:', email.value)
  console.log('닉네임:', nickname.value)
  console.log('이름:', name.value)
  console.log('연락처:', phone.value)

  // 실제 API 전송 가능
}
</script>

<template>
  <div class="mypage-content-container">
    <div class="mypage-header-box">
      <div class="mypage-header-box-title">
        회원 정보 관리
      </div>
    </div>

    <!-- 프로필 이미지 -->
    <div class="mypage-my-profile-image-container">
      <div class="my-profile-image-box">
        <img :src="profileImage" alt="프로필 사진" />
        <div id="profile-image-edit-button" @click="triggerFileInput">
          <img src="/assets/icons/ic-edit.png" alt="프로필 이미지 수정 버튼" />
        </div>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="handleFileChange"
        />
      </div>
    </div>

    <!-- 사용자 정보 입력 -->
    <div class="mypage-my-profile-info-input-container">
      <div class="mypage-my-profile-info-input-el">
        <label>이메일</label>
        <input type="email" v-model="email" placeholder="example@example.com" />
      </div>
      <div class="mypage-my-profile-info-input-el">
        <label>닉네임</label>
        <input type="text" v-model="nickname" />
      </div>
      <div class="mypage-my-profile-info-input-el">
        <label>이름</label>
        <input type="text" v-model="name" />
      </div>
      <div class="mypage-my-profile-info-input-el">
        <label>연락처</label>
        <input
          type="text"
          v-model="phone"
          @input="onPhoneInput"
          placeholder="000-0000-0000"
        />
      </div>
      <div class="mypage-my-preofile-info-save">
        <button id="goob-bye-button">탈퇴하기</button>
        <button id="mypage-user-info-edit-button" @click="onSubmit">
          회원정보수정
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 원하는 스타일 여기 추가 가능 */
</style>
