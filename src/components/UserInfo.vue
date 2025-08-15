<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/store/useUserStore' 

const userStore = useUserStore()

const userInfo = reactive({
  email: '',
  nickname: '',
  name: '',
  phone: '',
  profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAlaTCW_H-l1mSyOngrADrGNhk2nTIl-iDew&s'
})

const originalUserInfo = reactive({
  nickname: ''
})

const fileInput = ref(null)

// 추가: 소셜 로그인 사용자 판별 (이메일이 숫자로만 구성된 경우)
const isSocialUser = computed(() => {
  return userInfo.email && /^\d+$/.test(userInfo.email)
})

onMounted(async () => {
  await loadUserInfo()
})

const loadUserInfo = async () => {
  const result = await userStore.getCurrentUser()
  
  if (result.success && result.user) {
    Object.assign(userInfo, {
      email: result.user.email || '',
      nickname: result.user.nickname || '',
      name: result.user.name || '',
      phone: result.user.phone || '',
      profileImage: result.user.profileImage || userInfo.profileImage
    })
    
    originalUserInfo.nickname = result.user.nickname || ''
  } else {
    alert('사용자 정보를 불러올 수 없습니다.')
  }
}

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

  userInfo.profileImage = URL.createObjectURL(file)
}

const isValidEmail = (emailValue) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(emailValue)
}

const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const onPhoneInput = (event) => {
  userInfo.phone = formatPhoneNumber(event.target.value)
}

const onSubmit = async () => {
  // 수정: 소셜 로그인 사용자는 이메일 검증 제외
  if (!isSocialUser.value && !isValidEmail(userInfo.email)) {
    alert('유효한 이메일 주소를 입력하세요.')
    return
  }

  // 닉네임이 변경되었을 때만 중복 체크
  if (userInfo.nickname !== originalUserInfo.nickname && 
      userInfo.nickname && 
      userInfo.nickname.trim().length >= 2) {
    
    const nicknameResult = await userStore.checkNicknameDuplicate(userInfo.nickname)
    
    if (!nicknameResult.success) {
      alert(`닉네임 확인 실패: ${nicknameResult.message}`)
      return
    }
    
    if (!nicknameResult.available) {
      alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.')
      return
    }
  }

  try {
    const result = await userStore.updateProfile(userInfo)
    
    if (result.success) {
      originalUserInfo.nickname = userInfo.nickname
      await loadUserInfo() // 최신 데이터 다시 로드
      alert('회원정보가 성공적으로 수정되었습니다!')
    } else {
      alert(`수정 실패: ${result.message}`)
    }
  } catch (error) {
    alert('정보 수정 중 오류가 발생했습니다.')
  }
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
        <img :src="userInfo.profileImage" alt="프로필 사진" />
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
        <input 
          type="email" 
          v-model="userInfo.email" 
          placeholder="example@example.com" 
          readonly 
          style="background-color: #f5f5f5;"
        />
      </div>
      
      <div class="mypage-my-profile-info-input-el">
        <label>닉네임</label>
        <input 
          type="text" 
          v-model="userInfo.nickname" 
          placeholder="닉네임을 입력해주세요"
        />
      </div>
      
      <div class="mypage-my-profile-info-input-el">
        <label>이름</label>
        <input 
          type="text" 
          v-model="userInfo.name" 
          placeholder="실제 이름을 입력해주세요"
        />
      </div>
      
      <div class="mypage-my-profile-info-input-el">
        <label>연락처</label>
        <input
          type="text"
          v-model="userInfo.phone"
          @input="onPhoneInput"
          placeholder="010-0000-0000"
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
