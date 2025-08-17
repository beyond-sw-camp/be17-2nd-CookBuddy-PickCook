<script setup>
import { useUserStore } from '@/store/useUserStore'
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useUserStore()

const form = reactive({
  email: '',
  nickname: '',
  password: '',
  passwordCheck: '',
  name: '',
  phone: '',
  zipCode: '',
  address: '',
  detailAddress: '',
})

// 🔧 주소 표시용 computed
const fullAddress = computed(() => {
  if (form.address && form.detailAddress) {
    return `${form.address} ${form.detailAddress}`
  }
  return ''
})

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

  form.zipCode = newData.zipCode

  // address는 "기본주소 상세주소" 형태로 오므로 분리
  const addressParts = newData.address.split(' ')
  const detailIndex = addressParts.findIndex(
    (part) => /^\d/.test(part) || part.includes('동') || part.includes('호') || part.includes('층'),
  )

  if (detailIndex > 0) {
    form.address = addressParts.slice(0, detailIndex).join(' ')
    form.detailAddress = addressParts.slice(detailIndex).join(' ')
  } else {
    form.address = newData.address
    form.detailAddress = ''
  }
}

// 🔧 이메일 폼 데이터 추가
const emailForm = reactive({
  localPart: '',
  selectedDomain: 'gmail.com', // 기본값
  customDomain: '',
})

// 🔧 인기 도메인 목록
const popularDomains = [
  { label: 'Gmail', value: 'gmail.com' },
  { label: 'Naver', value: 'naver.com' },
  { label: 'Daum', value: 'daum.net' },
  { label: 'Yahoo', value: 'yahoo.com' },
]

const emailVerification = reactive({
  isDisabled: false,
  isVerified: false,
})

const nicknameVerification = reactive({
  isDisabled: false,
  isVerified: false,
})

// 🔧 도메인 선택 함수
const selectDomain = (domain) => {
  emailForm.selectedDomain = domain
  if (domain !== 'custom') {
    emailForm.customDomain = ''
  }
  updateFullEmail()

  // 도메인 변경 시 이메일 인증 상태 초기화
  if (emailVerification.isVerified || emailVerification.isDisabled) {
    emailVerification.isVerified = false
    emailVerification.isDisabled = false
  }
}

// 🔧 전체 이메일 업데이트 함수
const updateFullEmail = () => {
  if (!emailForm.localPart) {
    form.email = ''
    return
  }

  const domain =
    emailForm.selectedDomain === 'custom' ? emailForm.customDomain : emailForm.selectedDomain

  if (domain) {
    form.email = `${emailForm.localPart}@${domain}`
  } else {
    form.email = emailForm.localPart
  }
}

// 🔧 로컬 파트 입력 핸들러
const onLocalPartInput = () => {
  updateFullEmail()
  // 이메일 변경 시 인증 상태 초기화
  if (emailVerification.isVerified || emailVerification.isDisabled) {
    emailVerification.isVerified = false
    emailVerification.isDisabled = false
  }
}

// 🔧 커스텀 도메인 입력 핸들러
const onCustomDomainInput = () => {
  updateFullEmail()
  // 이메일 변경 시 인증 상태 초기화
  if (emailVerification.isVerified || emailVerification.isDisabled) {
    emailVerification.isVerified = false
    emailVerification.isDisabled = false
  }
}

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.email)
})

const certMessage = computed(() =>
  emailVerification.isVerified ? '사용 가능한 이메일입니다.' : '이메일 중복 확인을 해주세요.',
)

const nicknameStatus = computed(() => {
  if (form.nickname.length === 0) return 'empty'
  if (form.nickname.length < 2) return 'tooShort'
  return 'valid'
})

// 이메일
const checkEmail = async () => {
  if (!isEmailValid.value) {
    alert('올바른 이메일 형식이 아닙니다.')
    return
  }

  emailVerification.isDisabled = true

  // BaseResponse 형식으로 응답 받음
  const result = await auth.checkEmailDuplicate(form.email)

  if (result.success) {
    if (result.available) {
      emailVerification.isVerified = true
      alert(result.message) // "사용 가능한 이메일입니다."
    } else {
      emailVerification.isVerified = false
      emailVerification.isDisabled = false
      alert(result.message) // "이미 사용 중인 이메일입니다."
    }
  } else {
    emailVerification.isDisabled = false
    alert(result.message) // 에러 메시지
  }
}

// 이메일 변경 시 인증 상태 초기화
const onEmailChange = () => {
  if (emailVerification.isVerified || emailVerification.isDisabled) {
    emailVerification.isVerified = false
    emailVerification.isDisabled = false
  }
}

// 닉네임 중복 체크 함수 (마이페이지와 동일한 로직)
const checkNickname = async () => {
  if (form.nickname.length < 2) {
    alert('닉네임은 2자 이상이어야 합니다.')
    return
  }

  nicknameVerification.isDisabled = true

  // 마이페이지에서 만든 메서드 그대로 활용!
  const result = await auth.checkNicknameDuplicate(form.nickname)

  if (result.success) {
    if (result.available) {
      nicknameVerification.isVerified = true
      alert(result.message) // "사용 가능한 닉네임입니다."
    } else {
      nicknameVerification.isVerified = false
      nicknameVerification.isDisabled = false
      alert(result.message) // "이미 사용 중인 닉네임입니다."
    }
  } else {
    nicknameVerification.isDisabled = false
    alert(result.message) // 에러 메시지
  }
}

// 닉네임 변경 시 검증 상태 초기화
const onNicknameChange = () => {
  if (nicknameVerification.isVerified || nicknameVerification.isDisabled) {
    nicknameVerification.isVerified = false
    nicknameVerification.isDisabled = false
  }
}

// 🔧 전화번호 포맷팅 함수 추가
const formatPhoneNumber = (value) => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '')

  // 010-0000-0000 형식으로 포맷팅
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }
}

// 🔧 전화번호 입력 핸들러
const onPhoneInput = (event) => {
  const formatted = formatPhoneNumber(event.target.value)
  form.phone = formatted
}

// 🔧 추가: 비밀번호 검증 함수
const isValidPassword = computed(() => {
  if (!form.password) return null

  return (
    form.password.length >= 8 &&
    /[a-zA-Z]/.test(form.password) &&
    /\d/.test(form.password) &&
    /[!@#$%^&*()]/.test(form.password)
  )
})

const signup = async () => {
  // 기본 검증
  if (!form.email.trim() || !form.nickname.trim() || !form.password.trim()) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  // 🔧 추가: 비밀번호 강도 검증
  if (!isValidPassword.value) {
    alert('비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.')
    return
  }

  if (form.password !== form.passwordCheck) {
    // 🔧 수정: 한글 텍스트 복구
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  if (!emailVerification.isVerified) {
    // 🔧 수정: 한글 텍스트 복구
    alert('이메일 중복 확인을 먼저 해주세요.')
    return
  }

  if (!nicknameVerification.isVerified) {
    // 🔧 수정: 한글 텍스트 복구
    alert('닉네임 중복 확인을 먼저 해주세요.')
    return
  }

  // 🔧 추가: 주소 검증
  if (!form.address || !form.detailAddress) {
    alert('주소를 입력해주세요.')
    return
  }

  const result = await auth.signup({
    email: form.email,
    nickname: form.nickname,
    password: form.password,
    name: form.name,
    phone: form.phone,
    // 🔧 추가: 주소 정보
    zipCode: form.zipCode,
    address: form.address,
    detailAddress: form.detailAddress,
  })

  console.log('회원가입 API 응답:', result)

  if (result.success) {
    alert(result.message)
    router.push('/login')
  } else {
    alert(result.message)

    if (result.message.includes('이메일')) {
      emailVerification.isVerified = false
      emailVerification.isDisabled = false
    }
  }
}

onMounted(() => {
  window.addEventListener('message', handleAddressMessage)
})
</script>

<template>
  <div class="login-and-signup-body" id="signup-body">
    <div class="signup-container">
      <a class="logo-text" href="/">PickCook</a>
      <span id="title">회원가입</span>

      <form @submit.prevent="checkEmail">
        <!-- 🔧 새로운 이메일 섹션 -->
        <div class="form-items">
          <label for="email">이메일</label>
          <span class="label-sup">자주 사용하는 도메인을 선택하거나 직접 입력하세요.</span>

          <!-- 인기 도메인 탭 -->
          <div class="domain-tabs">
            <button
              v-for="domain in popularDomains"
              :key="domain.value"
              :class="['domain-tab', { active: emailForm.selectedDomain === domain.value }]"
              @click="selectDomain(domain.value)"
              type="button"
            >
              {{ domain.label }}
            </button>
            <button
              :class="['domain-tab', { active: emailForm.selectedDomain === 'custom' }]"
              @click="selectDomain('custom')"
              type="button"
            >
              직접입력
            </button>
          </div>

          <!-- 이메일 입력 -->
          <div class="email-input-row">
            <input
              v-model="emailForm.localPart"
              class="email-local-input"
              type="text"
              placeholder="사용자명"
              @input="onLocalPartInput"
              :disabled="emailVerification.isDisabled"
            />
            <span class="email-at">@</span>

            <input
              v-if="emailForm.selectedDomain === 'custom'"
              v-model="emailForm.customDomain"
              class="email-domain-input"
              type="text"
              placeholder="도메인 입력"
              @input="onCustomDomainInput"
              :disabled="emailVerification.isDisabled"
            />
            <span v-else class="email-domain-display">
              {{ emailForm.selectedDomain }}
            </span>
          </div>

          <!-- 최종 이메일 미리보기 -->
          <div class="email-preview">
            <span> 완성된 이메일 : </span>
            <strong>{{ form.email || '이메일을 완성해주세요' }}</strong>
          </div>

          <!-- 기존 중복 확인 버튼과 메시지는 그대로 유지 -->
          <div
            id="email-cert-button"
            class="button-styles"
            :class="[
              { disabled: !isEmailValid || emailVerification.isDisabled },
              { verified: emailVerification.isVerified },
            ]"
            @click="!emailVerification.isDisabled && isEmailValid && checkEmail()"
          >
            {{ emailVerification.isVerified ? '사용할 수 있는 이메일 입니다.' : '이메일 중복확인' }}
          </div>

          <span
            v-show="emailVerification.isDisabled"
            id="cert-guide-message"
            class="message-style"
            :class="{ 'valid-message': emailVerification.isVerified }"
          >
            {{ certMessage }}
          </span>
        </div>

        <!-- 비밀번호 -->
        <div class="form-items">
          <label for="password">비밀번호</label>
          <span class="label-sup"
            >8자 이상, 영문+숫자+특수문자(!@#$%^&*())를 포함한 비밀번호를 입력해주세요.</span
          >
          <input
            v-model="form.password"
            class="login-and-signup-input"
            type="password"
            name="password"
            placeholder="비밀번호"
            required
          />
          <input
            v-model="form.passwordCheck"
            class="login-and-signup-input"
            type="password"
            name="password-check"
            placeholder="비밀번호 확인"
            required
          />
        </div>

        <!-- 닉네임 섹션 전체 수정 -->
        <div class="form-items">
          <label for="nickname">닉네임</label>
          <span class="label-sup">다른 유저와 겹치지 않도록 입력해주세요. (2~ 20자)</span>
          <input
            v-model="form.nickname"
            @input="onNicknameChange"
            :disabled="nicknameVerification.isDisabled"
            class="login-and-signup-input"
            type="text"
            name="nickname"
            placeholder="닉네임"
          />
          <div
            id="nickname-cert-button"
            class="button-styles"
            :class="[
              { disabled: nicknameStatus !== 'valid' || nicknameVerification.isDisabled },
              { verified: nicknameVerification.isVerified },
            ]"
            @click="
              nicknameStatus === 'valid' && !nicknameVerification.isDisabled && checkNickname()
            "
          >
            {{
              nicknameVerification.isVerified ? '사용할 수 있는 닉네임입니다.' : '닉네임 중복확인'
            }}
          </div>
          <!-- 🔧 이메일과 동일한 메시지 표시 구조 -->
          <span
            v-show="nicknameVerification.isDisabled || nicknameVerification.isVerified"
            id="nickname-cert-guide-message"
            class="message-style"
            :class="{ 'valid-message': nicknameVerification.isVerified }"
          >
            {{
              nicknameVerification.isVerified
                ? '사용 가능한 닉네임입니다.'
                : nicknameVerification.isDisabled
                  ? '닉네임 중복 확인을 진행 중입니다.'
                  : ''
            }}
          </span>
          <!-- 🔧 유효성 검사 메시지는 별도로 표시 -->
          <span
            v-show="nicknameStatus === 'tooShort' && !nicknameVerification.isDisabled"
            id="nickname-validation-message"
            class="message-style"
          >
            닉네임은 2자 이상이어야 합니다.
          </span>
        </div>
        <br />

        <!-- 선택 추가정보 -->
        <div class="form-items">
          <label for="name">이름</label>
          <input
            v-model="form.name"
            class="login-and-signup-input"
            type="text"
            name="name"
            placeholder="이름을 입력해주세요"
          />
        </div>

        <div class="form-items">
          <label for="phone">전화번호</label>
          <input
            v-model="form.phone"
            @input="onPhoneInput"
            class="login-and-signup-input"
            type="text"
            name="phone"
            placeholder="010-0000-0000"
            maxlength="13"
          />
        </div>

        <!-- 🔧 수정: 주소 입력 섹션 -->
        <div class="form-items">
          <label for="address">주소</label>

          <!-- 주소가 없을 때: 빈 input 창 (읽기 전용) -->
          <div v-if="!fullAddress">
            <input
              class="login-and-signup-input"
              type="text"
              readonly
              placeholder="주소 검색 버튼을 클릭해주세요"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: #f8f9fa;
                width: 350px;
              "
              @click="openAddressPopup"
            />
          </div>

          <!-- 주소가 있을 때: 주소 표시 + 수정 버튼 -->
          <div v-if="fullAddress">
            <div
              class="login-and-signup-input"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
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
                "
              >
                {{ fullAddress }}
              </span>
            </div>
            <button
              type="button"
              class="button-styles"
              style="
                margin-top: 5px;
                padding: 8px 8px;
                font-size: 14px;
                border: 1px solid lightgrey;
                flex-shrink: 0;
              "
              @click="openAddressPopup"
            >
              수정
            </button>
          </div>
        </div>

        <button type="button" class="signup-button button-styles" @click="signup">회원가입</button>
      </form>

      <div class="option-link">
        이미 아이디가 있으신가요?
        <RouterLink to="/login">로그인</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🔧 추가: 새로운 이메일 관련 스타일 */
.domain-tabs {
  display: flex;
  justify-content: space-around;
  gap: 5px;
  margin: 12px 0px 12px 0px;
  flex-wrap: wrap;
}

.domain-tab {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  white-space: nowrap;
}

.domain-tab:hover {
  background: #e9ecef;
}

.domain-tab.active {
  background: #e14345;
  color: white;
  border-color: #e14345;
}

.email-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.email-local-input,
.email-domain-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 0;
}

.email-at {
  font-weight: bold;
  font-size: 18px;
  color: #666;
}

.email-domain-display {
  padding: 5px 12px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  flex: 1;
  min-width: 120px;
  font-size: 18px;
}

.email-preview {
  padding: 10px 5px;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .domain-tabs {
    justify-content: center;
  }

  .domain-tab {
    font-size: 12px;
    padding: 6px 12px;
  }

  .email-input-row {
    flex-direction: column;
    align-items: stretch;
  }

  .email-local-input,
  .email-domain-input,
  .email-domain-display {
    width: 100%;
  }

  .email-at {
    align-self: center;
  }
}
</style>
