<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'vue-router'
import api from '@/api/user/index.js'

const userStore = useUserStore()
const router = useRouter()

const userInfo = reactive({
  email: '',
  nickname: '',
  name: '',
  phone: '',
  profileImage:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAlaTCW_H-l1mSyOngrADrGNhk2nTIl-iDew&s',
  zipCode: '',
  address: '',
  detailAddress: '',
})

// 🔧 추가: 회원탈퇴 모달 및 폼 상태
const showWithdrawModal = ref(false)
const withdrawForm = reactive({
  password: '',
  reason: '',
  confirmWithdraw: false,
})

// 🔧 추가: 주소 표시용 computed
const fullAddress = computed(() => {
  if (userInfo.address && userInfo.detailAddress) {
    return `${userInfo.address} ${userInfo.detailAddress}`
  }
  return ''
})

// 🔧 추가: 회원탈퇴 모달 관련 함수들
const openWithdrawModal = () => {
  console.log('회원탈퇴 모달 열기')
  showWithdrawModal.value = true
}

const closeWithdrawModal = () => {
  console.log('회원탈퇴 모달 닫기')
  showWithdrawModal.value = false
  // 폼 초기화
  withdrawForm.password = ''
  withdrawForm.reason = ''
  withdrawForm.confirmWithdraw = false
}

const confirmWithdraw = async () => {
  console.log('회원탈퇴 확인 버튼 클릭')

  // 유효성 검사
  if (!withdrawForm.confirmWithdraw) {
    alert('탈퇴 확인을 체크해주세요.')
    return
  }

  // 일반 로그인 사용자는 비밀번호 필수
  if (!isSocialUser.value && (!withdrawForm.password || withdrawForm.password.trim() === '')) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  // 확인 메시지
  const confirmMessage = isSocialUser.value
    ? '정말로 탈퇴하시겠습니까?'
    : '비밀번호를 확인하여 탈퇴하시겠습니까?'

  if (!confirm(confirmMessage)) {
    return
  }

  try {
    console.log('탈퇴 API 호출:', withdrawForm)

    const result = await userStore.withdrawUser({
      password: withdrawForm.password,
      reason: withdrawForm.reason,
      confirmWithdraw: withdrawForm.confirmWithdraw,
    })

    if (result.success) {
      alert(`탈퇴가 완료되었습니다.\n탈퇴 일시: ${new Date().toLocaleString()}`)

      // 모달 닫기
      closeWithdrawModal()

      // 로그인 페이지로 이동
      router.push('/login')
    } else {
      alert(`탈퇴 실패: ${result.message}`)
    }
  } catch (error) {
    console.error('탈퇴 처리 중 오류:', error)
    alert('탈퇴 처리 중 오류가 발생했습니다.')
  }
}

// 🔧 추가: 주소 검색 팝업 열기
const openAddressPopup = () => {
  const width = 500
  const height = 650
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2

  return window.open(
    `${window.location.origin}/address/search`,
    '주소검색팝업',
    `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`,
  )
}

// 🔧 추가: 주소 메시지 핸들러
const handleAddressMessage = (event) => {
  const newData = event.data
  if (!newData || typeof newData !== 'object' || !newData.address || !newData.zipCode) {
    return
  }

  userInfo.zipCode = newData.zipCode

  // address는 "기본주소 상세주소" 형태로 오므로 분리
  const addressParts = newData.address.split(' ')
  const detailIndex = addressParts.findIndex(
    (part) => /^\d/.test(part) || part.includes('동') || part.includes('호') || part.includes('층'),
  )

  if (detailIndex > 0) {
    userInfo.address = addressParts.slice(0, detailIndex).join(' ')
    userInfo.detailAddress = addressParts.slice(detailIndex).join(' ')
  } else {
    userInfo.address = newData.address
    userInfo.detailAddress = ''
  }
}

const originalUserInfo = reactive({
  nickname: '',
})

const fileInput = ref(null)

// 추가: 소셜 로그인 사용자 판별 (이메일이 숫자로만 구성된 경우)
const isSocialUser = computed(() => {
  return userInfo.email && /^\d+$/.test(userInfo.email)
})

onMounted(async () => {
  await loadUserInfo()
  // 🔧 추가: 주소 메시지 리스너 등록
  window.addEventListener('message', handleAddressMessage)
})

// 🔧 수정: 사용자 정보 로드 시 주소 정보도 포함
const loadUserInfo = async () => {
  const result = await userStore.getCurrentUser()

  if (result.success && result.user) {
    Object.assign(userInfo, {
      email: result.user.email || '',
      nickname: result.user.nickname || '',
      name: result.user.name || '',
      phone: result.user.phone || '',
      profileImage: result.user.profileImage || userInfo.profileImage,
      // 🔧 추가: 주소 정보 로드
      zipCode: result.user.zipCode || '',
      address: result.user.address || '',
      detailAddress: result.user.detailAddress || '',
    })

    // 추가: 원본 닉네임 저장
    originalUserInfo.nickname = result.user.nickname || ''
  } else {
    console.error('❌ 사용자 정보 로드 실패:', result.message)
    alert('사용자 정보를 불러올 수 없습니다.')
  }
}

// 비밀번호 재설정
const changePassword = async () => {
  console.log('비밀번호 변경 버튼 클릭')

  try {
    // 1. OAuth2 사용자인지 확인
    if (isSocialUser.value) {
      // OAuth2 사용자: 카카오 계정 관리 페이지로 리다이렉트
      const response = await api.checkOAuthUser()
      if (response.success) {
        window.open(response.results.redirectUrl, '_blank')
      } else {
        alert('카카오 계정 관리 페이지로 이동할 수 없습니다.')
      }
      return
    }

    // 2. 일반 사용자: 내부 토큰 생성 후 Vue 페이지로 이동
    const result = await userStore.generatePasswordChangeToken()

    if (result.success) {
      const token = result.results.token

      // ✅ Vue 페이지로 이동 (백엔드 HTML 대신)
      router.push(`/reset-password?token=${token}&type=internal`)

      console.log('비밀번호 재설정 페이지로 이동')
    } else {
      alert(`토큰 생성 실패: ${result.message}`)
    }
  } catch (error) {
    console.error('비밀번호 변경 토큰 생성 중 오류:', error)
    alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

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

// 수정: 닉네임이 변경되었을 때만 중복 체크 실행
const onSubmit = async () => {
  if (!isSocialUser.value && !isValidEmail(userInfo.email)) {
    alert('유효한 이메일 주소를 입력하세요.')
    return
  }

  // 수정: 닉네임이 실제로 변경되었을 때만 중복 체크
  if (
    userInfo.nickname !== originalUserInfo.nickname &&
    userInfo.nickname &&
    userInfo.nickname.trim().length >= 2
  ) {
    console.log('닉네임 변경 감지 - 중복 체크 실행')
    console.log('기존:', originalUserInfo.nickname, '새로운:', userInfo.nickname)

    const nicknameResult = await userStore.checkNicknameDuplicate(userInfo.nickname)

    if (!nicknameResult.success) {
      alert(`닉네임 확인 실패: ${nicknameResult.message}`)
      return
    }

    if (!nicknameResult.available) {
      alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.')
      return
    }
  } else {
    console.log('닉네임 변경 없음 - 중복 체크 건너뛰기')
  }

  console.log('수정할 사용자 정보:', userInfo)

  try {
    const result = await userStore.updateProfile(userInfo)

    if (result.success) {
      // 추가: 업데이트 성공 시 원본 정보도 갱신
      originalUserInfo.nickname = userInfo.nickname
      alert('회원정보가 성공적으로 수정되었습니다!')
    } else {
      alert(`수정 실패: ${result.message}`)
    }
  } catch (error) {
    console.error('정보 수정 중 오류:', error)
    alert('정보 수정 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="mypage-content-container">
    <div class="mypage-header-box">
      <div class="mypage-header-box-title">회원 정보 관리</div>

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
            style="background-color: #f5f5f5"
          />
        </div>

        <div class="mypage-my-profile-info-input-el">
          <label>닉네임</label>
          <input type="text" v-model="userInfo.nickname" placeholder="닉네임을 입력해주세요" />
        </div>

        <div class="mypage-my-profile-info-input-el">
          <label>이름</label>
          <input type="text" v-model="userInfo.name" placeholder="실제 이름을 입력해주세요" />
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

        <!-- 🔧 추가: 주소 입력 섹션 -->
        <div class="mypage-my-profile-info-input-el">
          <label>주소</label>

          <!-- 주소가 없을 때: 빈 input 창 + 검색 버튼 -->
          <div v-if="!fullAddress">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #f8f9fa;
                cursor: pointer;
                width: 430px;
                font-size: 14px;
              "
              @click="openAddressPopup"
            >
              <span style="flex: 1; color: #666; margin-right: 10px"> 여기를 클릭해주세요 </span>
            </div>
          </div>

          <!-- 주소가 있을 때: 주소 표시 + 수정 버튼 -->
          <div v-if="fullAddress">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #f8f9fa;
              "
            >
              <span
                style="
                  flex: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  margin-right: 10px;
                  width: 395px;
                  font-size: 14px;
                "
                @click="openAddressPopup"
              >
                {{ fullAddress }}
              </span>
            </div>
          </div>
        </div>

        <div class="mypage-my-preofile-info-save">
          <button style="width: 150px" id="mypage-user-info-edit-button" @click="onSubmit">
            회원정보 수정</button
          ><br />
          <button
            style="width: 150px; border: 1px solid #e14345; color: #e14345"
            id=""
            @click="changePassword"
          >
            비밀번호 수정</button
          ><br />
          <button style="width: 150px" id="goob-bye-button" @click="openWithdrawModal">
            탈퇴하기
          </button>
        </div>

        <!-- 🔧 추가: 회원탈퇴 모달 -->
        <div v-if="showWithdrawModal" class="withdraw-modal-overlay" @click="closeWithdrawModal">
          <div class="withdraw-modal" @click.stop>
            <div class="withdraw-modal-header">
              <h3>회원탈퇴</h3>
              <button @click="closeWithdrawModal">×</button>
            </div>

            <div class="withdraw-modal-body">
              <div class="withdraw-warning">
                <h4>⚠️ 탈퇴 전 확인사항</h4>
                <ul>
                  <li>탈퇴 시 작성한 게시글, 댓글은 삭제되지 않습니다</li>
                  <li>개인정보는 관련 법령에 따라 일정 기간 보관됩니다</li>
                  <li>동일한 이메일로 재가입이 제한될 수 있습니다</li>
                </ul>
              </div>

              <!-- 일반 로그인 사용자만 비밀번호 입력 -->
              <div v-if="!isSocialUser" class="form-group">
                <label>현재 비밀번호</label>
                <input
                  type="password"
                  v-model="withdrawForm.password"
                  placeholder="본인 확인을 위해 현재 비밀번호를 입력하세요"
                  required
                />
              </div>

              <div class="form-group">
                <label>탈퇴 사유 (선택사항)</label>
                <textarea
                  v-model="withdrawForm.reason"
                  placeholder="탈퇴 사유를 입력해주세요 (선택사항)"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="withdrawForm.confirmWithdraw" />
                  위 내용을 모두 확인했으며, 회원탈퇴에 동의합니다.
                </label>
              </div>
            </div>

            <div class="withdraw-modal-footer">
              <button @click="closeWithdrawModal" class="cancel-btn">취소</button>
              <button
                @click="confirmWithdraw"
                class="withdraw-btn"
                :disabled="!withdrawForm.confirmWithdraw"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🔧 추가: 탈퇴 모달 스타일 */
.withdraw-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.withdraw-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.withdraw-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.withdraw-modal-header h3 {
  margin: 0;
  color: #e14345;
}

.withdraw-modal-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.withdraw-modal-body {
  padding: 20px;
}

.withdraw-warning {
  background-color: #fff3cd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #ffc107;
}

.withdraw-warning h4 {
  margin-top: 0;
  color: #856404;
}

.withdraw-warning ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: #856404;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  width: auto !important;
  margin-right: 8px;
}

.withdraw-modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn,
.withdraw-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #333;
}

.withdraw-btn {
  background-color: #e14345;
  color: white;
}

.withdraw-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
