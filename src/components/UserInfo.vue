<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const profileImage = ref(
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAlaTCW_H-l1mSyOngrADrGNhk2nTIl-iDew&s', // 기본 이미지(기본이미지 정해지면 바꿀게용)
)

// 프로필 이미지 수정 버튼 클릭 시 파일탐색기 열기
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 파일 변경 시 처리
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.')
    return
  }

  // 미리보기 이미지
  profileImage.value = URL.createObjectURL(file)

  // TODO: 서버 업로드 필요 시 FormData 사용
  // const formData = new FormData()
  // formData.append('profileImage', file)
  // await axios.post('/api/profile/upload', formData)
}
</script>

<template>
  <div class="mypage-content-container">
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

    <!-- 사용자 정보 입력 컨테이너 -->
    <div class="mypage-my-profile-info-input-container">
      <div class="mypage-my-profile-info-input-el">
        <label>이름</label>
        <input type="text" />
      </div>
      <div class="mypage-my-profile-info-input-el">
        <label>닉네임</label>
        <input type="text" />
      </div>
      <div class="mypage-my-profile-info-input-el">
        <label>이메일</label>
        <input type="text" />
      </div>
      <div class="mypage-my-profile-info-input-el">
        <label>연락처</label>
        <input type="text" />
      </div>
      <div class="mypage-my-profile-info-input-el address-label">
        <label>주소</label>
        <div class="mypage-my-address-input-boxes">
          <div>
            <input type="text" />
            <button>주소찾기</button>
          </div>
          <input type="text" />
          <input type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
