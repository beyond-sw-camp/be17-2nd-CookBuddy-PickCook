<script setup>
import { useUserStore } from '@/store/useUserStore'
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useUserStore()

// 폼 데이터 관리
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

// 이메일 구성 관리
const emailForm = reactive({
  localPart: '',
  selectedDomain: 'gmail.com',
  customDomain: '',
})

// 인기 도메인 목록
const popularDomains = [
  { label: 'Gmail', value: 'gmail.com' },
  { label: 'Naver', value: 'naver.com' },
  { label: 'Daum', value: 'daum.net' },
  { label: 'Yahoo', value: 'yahoo.com' },
]

// 상태 관리
const loading = ref(false)
const emailVerification = reactive({
  isDisabled: false,
  isVerified: false,
})
const nicknameVerification = reactive({
  isDisabled: false,
  isVerified: false,
})

// 에러 상태 관리
const formErrors = reactive({
  email: { message: '', isValid: false },
  password: { message: '', isValid: false },
  passwordCheck: { message: '', isValid: false },
  nickname: { message: '', isValid: false },
  name: { message: '', isValid: false },
  phone: { message: '', isValid: false },
})

// 검증 규칙
const emailRules = [
  (v) => !!v || '이메일을 입력해주세요',
  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || '올바른 이메일 형식이 아닙니다',
]

const passwordRules = [
  (v) => !!v || '비밀번호를 입력해주세요',
  (v) =>
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}$/.test(v) ||
    '비밀번호는 영문, 숫자, 특수문자(!@#$%^&*())를 포함한 8-20자여야 합니다',
]

const passwordCheckRules = [
  (v) => !!v || '비밀번호 확인을 입력해주세요',
  (v) => v === form.password || '비밀번호가 일치하지 않습니다',
]

const nicknameRules = [
  (v) => !!v || '닉네임을 입력해주세요',
  (v) => v.length >= 2 || '닉네임은 2자 이상이어야 합니다',
  (v) => v.length <= 20 || '닉네임은 20자 이하여야 합니다',
  (v) => /^[가-힣a-zA-Z0-9]+$/.test(v) || '닉네임은 한글, 영문, 숫자만 사용 가능합니다',
]

const nameRules = [
  (v) => !!v || '이름을 입력해주세요',
  (v) => v.length <= 50 || '이름은 50자 이하여야 합니다',
  (v) => /^[가-힣a-zA-Z\s]+$/.test(v) || '이름은 한글, 영문만 사용 가능합니다',
]

const phoneRules = [
  (v) => !!v || '전화번호를 입력해주세요',
  (v) =>
    /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/.test(v) ||
    '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)',
]

// 실시간 검증 상태
const emailValidation = computed(() => {
  if (!form.email) return { isValid: false, message: '' }

  for (const rule of emailRules) {
    const result = rule(form.email)
    if (result !== true) {
      return { isValid: false, message: result }
    }
  }
  return { isValid: true, message: '' }
})

const passwordValidation = computed(() => {
  if (!form.password) return { isValid: false, message: '' }

  for (const rule of passwordRules) {
    const result = rule(form.password)
    if (result !== true) {
      return { isValid: false, message: result }
    }
  }
  return { isValid: true, message: '' }
})

const passwordCheckValidation = computed(() => {
  if (!form.passwordCheck) return { isValid: false, message: '' }

  for (const rule of passwordCheckRules) {
    const result = rule(form.passwordCheck)
    if (result !== true) {
      return { isValid: false, message: result }
    }
  }
  return { isValid: true, message: '' }
})

const nicknameValidation = computed(() => {
  if (!form.nickname) return { isValid: false, message: '' }

  for (const rule of nicknameRules) {
    const result = rule(form.nickname)
    if (result !== true) {
      return { isValid: false, message: result }
    }
  }
  return { isValid: true, message: '' }
})

const nameValidation = computed(() => {
  if (!form.name) return { isValid: false, message: '' }

  for (const rule of nameRules) {
    const result = rule(form.name)
    if (result !== true) {
      return { isValid: false, message: result }
    }
  }
  return { isValid: true, message: '' }
})

const phoneValidation = computed(() => {
  if (!form.phone) return { isValid: false, message: '' }

  for (const rule of phoneRules) {
    const result = rule(form.phone)
    if (result !== true) {
      return { isValid: false, message: result }
    }
  }
  return { isValid: true, message: '' }
})

// 주소 표시
const fullAddress = computed(() => {
  if (form.address && form.detailAddress) {
    return `${form.address} ${form.detailAddress}`
  }
  return ''
})

// 폼 준비 상태 계산
const isFormReady = computed(() => {
  return (
    form.email.trim() &&
    form.password.trim() &&
    form.passwordCheck.trim() &&
    form.nickname.trim() &&
    form.name.trim() &&
    form.phone.trim() &&
    emailValidation.value.isValid &&
    passwordValidation.value.isValid &&
    passwordCheckValidation.value.isValid &&
    nicknameValidation.value.isValid &&
    nameValidation.value.isValid &&
    phoneValidation.value.isValid &&
    fullAddress.value &&
    emailVerification.isVerified &&
    nicknameVerification.isVerified
  )
})

// 실시간 검증 함수 (blur용)
const validateEmail = () => {
  formErrors.email.isValid = emailValidation.value.isValid
  formErrors.email.message = emailValidation.value.message
}

const validatePassword = () => {
  formErrors.password.isValid = passwordValidation.value.isValid
  formErrors.password.message = passwordValidation.value.message
}

const validatePasswordCheck = () => {
  formErrors.passwordCheck.isValid = passwordCheckValidation.value.isValid
  formErrors.passwordCheck.message = passwordCheckValidation.value.message
}

const validateNickname = () => {
  formErrors.nickname.isValid = nicknameValidation.value.isValid
  formErrors.nickname.message = nicknameValidation.value.message
}

const validateName = () => {
  formErrors.name.isValid = nameValidation.value.isValid
  formErrors.name.message = nameValidation.value.message
}

const validatePhone = () => {
  formErrors.phone.isValid = phoneValidation.value.isValid
  formErrors.phone.message = phoneValidation.value.message
}

// 에러 메시지 초기화
const clearEmailError = () => {
  formErrors.email.message = ''
}

const clearPasswordError = () => {
  formErrors.password.message = ''
}

const clearPasswordCheckError = () => {
  formErrors.passwordCheck.message = ''
}

const clearNicknameError = () => {
  formErrors.nickname.message = ''
}

const clearNameError = () => {
  formErrors.name.message = ''
}

const clearPhoneError = () => {
  formErrors.phone.message = ''
}

// 이메일 구성 관리
const selectDomain = (domain) => {
  emailForm.selectedDomain = domain
  if (domain !== 'custom') {
    emailForm.customDomain = ''
  }
  updateFullEmail()
  resetEmailVerification()
}

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

const onLocalPartInput = () => {
  updateFullEmail()
  resetEmailVerification()
  clearEmailError()
}

const onCustomDomainInput = () => {
  updateFullEmail()
  resetEmailVerification()
  clearEmailError()
}

const resetEmailVerification = () => {
  if (emailVerification.isVerified || emailVerification.isDisabled) {
    emailVerification.isVerified = false
    emailVerification.isDisabled = false
  }
}

const resetNicknameVerification = () => {
  if (nicknameVerification.isVerified || nicknameVerification.isDisabled) {
    nicknameVerification.isVerified = false
    nicknameVerification.isDisabled = false
  }
}

// 전화번호 포맷팅
const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^\d]/g, '')
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }
}

const onPhoneInput = (event) => {
  const formatted = formatPhoneNumber(event.target.value)
  form.phone = formatted
  clearPhoneError()
}

// 중복 검증
const checkEmail = async () => {
  if (!emailValidation.value.isValid) {
    formErrors.email.message = emailValidation.value.message
    return
  }

  emailVerification.isDisabled = true

  try {
    const result = await auth.checkEmailDuplicate(form.email)

    if (result.success) {
      if (result.available) {
        emailVerification.isVerified = true
        formErrors.email.message = ''
        formErrors.email.isValid = true
      } else {
        emailVerification.isVerified = false
        emailVerification.isDisabled = false
        formErrors.email.message = result.message
        formErrors.email.isValid = false
      }
    } else {
      emailVerification.isDisabled = false
      formErrors.email.message = result.message
      formErrors.email.isValid = false
    }
  } catch (error) {
    emailVerification.isDisabled = false
    formErrors.email.message = '이메일 확인 중 오류가 발생했습니다.'
    formErrors.email.isValid = false
  }
}

const checkNickname = async () => {
  if (!nicknameValidation.value.isValid) {
    formErrors.nickname.message = nicknameValidation.value.message
    return
  }

  nicknameVerification.isDisabled = true

  try {
    const result = await auth.checkNicknameDuplicate(form.nickname)

    if (result.success) {
      if (result.available) {
        nicknameVerification.isVerified = true
        formErrors.nickname.message = ''
        formErrors.nickname.isValid = true
      } else {
        nicknameVerification.isVerified = false
        nicknameVerification.isDisabled = false
        formErrors.nickname.message = result.message
        formErrors.nickname.isValid = false
      }
    } else {
      nicknameVerification.isDisabled = false
      formErrors.nickname.message = result.message
      formErrors.nickname.isValid = false
    }
  } catch (error) {
    nicknameVerification.isDisabled = false
    formErrors.nickname.message = '닉네임 확인 중 오류가 발생했습니다.'
    formErrors.nickname.isValid = false
  }
}

// 주소 관리
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

const handleAddressMessage = (event) => {
  const newData = event.data
  if (!newData || typeof newData !== 'object' || !newData.address || !newData.zipCode) {
    return
  }

  form.zipCode = newData.zipCode

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

// 회원가입 처리
const signup = async () => {
  validateEmail()
  validatePassword()
  validatePasswordCheck()
  validateNickname()
  validateName()
  validatePhone()

  if (!isFormReady.value) {
    if (!emailVerification.isVerified) {
      formErrors.email.message = '이메일 중복 확인을 먼저 해주세요.'
    }
    if (!nicknameVerification.isVerified) {
      formErrors.nickname.message = '닉네임 중복 확인을 먼저 해주세요.'
    }
    if (!fullAddress.value) {
      alert('주소를 입력해주세요.')
    }
    return
  }

  loading.value = true

  try {
    const signupData = {
      email: form.email,
      nickname: form.nickname,
      password: form.password,
      name: form.name,
      phone: form.phone,
      zipCode: form.zipCode,
      address: form.address,
      detailAddress: form.detailAddress,
    }

    const result = await auth.signup(signupData)

    if (result.success) {
      alert(`✅ ${result.message}\n\n📧 이메일을 확인하여 인증을 완료해주세요.`)
      router.push('/login')
    } else {
      if (result.message.includes('이메일')) {
        emailVerification.isVerified = false
        emailVerification.isDisabled = false
        formErrors.email.message = result.message
      } else if (result.message.includes('닉네임')) {
        nicknameVerification.isVerified = false
        nicknameVerification.isDisabled = false
        formErrors.nickname.message = result.message
      } else {
        alert(`❌ 회원가입 실패\n\n${result.message}`)
      }
    }
  } catch (error) {
    if (error.message?.includes('timeout')) {
      alert(
        `⏰ 처리 시간이 오래 걸리고 있습니다.\n\n이메일 발송이 완료되었을 수 있으니,\n잠시 후 이메일을 확인해주세요.\n\n만약 이메일이 오지 않았다면\n다시 시도해주세요.`,
      )

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      alert('회원가입 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.')
    }
  } finally {
    loading.value = false
  }
}

// 이벤트 핸들러 통합 함수
const onNicknameInput = () => {
  resetNicknameVerification()
  clearNicknameError()
}

// 라이프사이클 관리
onMounted(() => {
  window.addEventListener('message', handleAddressMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleAddressMessage)
})
</script>

<template>
  <div class="login-and-signup-body" id="signup-body">
    <div class="signup-container">
      <a class="logo-text" href="/">PickCook</a>
      <span id="title">회원가입</span>

      <form @submit.prevent="signup">
        <!-- 이메일 섹션 -->
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
              @blur="validateEmail"
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
              @blur="validateEmail"
              :disabled="emailVerification.isDisabled"
            />
            <span v-else class="email-domain-display">
              {{ emailForm.selectedDomain }}
            </span>
          </div>

          <!-- 최종 이메일 미리보기 -->
          <div class="email-preview">
            <span>완성된 이메일 : </span>
            <strong>{{ form.email || '이메일을 완성해주세요' }}</strong>
          </div>

          <!-- 중복 확인 버튼 -->
          <div
            id="email-cert-button"
            class="button-styles"
            :class="[
              { disabled: !emailValidation.isValid || emailVerification.isDisabled },
              { verified: emailVerification.isVerified },
            ]"
            @click="!emailVerification.isDisabled && emailValidation.isValid && checkEmail()"
          >
            {{ emailVerification.isVerified ? '사용할 수 있는 이메일입니다.' : '이메일 중복확인' }}
          </div>

          <!-- 에러 메시지 표시 -->
          <div
            v-if="
              formErrors.email.message ||
              (form.email && !emailValidation.isValid && !emailVerification.isDisabled)
            "
            class="error-message"
          >
            {{ formErrors.email.message || emailValidation.message }}
          </div>
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
            @blur="validatePassword"
            @input="clearPasswordError"
            required
          />
          <div
            v-if="formErrors.password.message || (form.password && !passwordValidation.isValid)"
            class="error-message"
          >
            {{ formErrors.password.message || passwordValidation.message }}
          </div>

          <input
            v-model="form.passwordCheck"
            class="login-and-signup-input"
            type="password"
            name="password-check"
            placeholder="비밀번호 확인"
            @blur="validatePasswordCheck"
            @input="clearPasswordCheckError"
            required
          />
          <div
            v-if="
              formErrors.passwordCheck.message ||
              (form.passwordCheck && !passwordCheckValidation.isValid)
            "
            class="error-message"
          >
            {{ formErrors.passwordCheck.message || passwordCheckValidation.message }}
          </div>
        </div>

        <!-- 닉네임 -->
        <div class="form-items">
          <label for="nickname">닉네임</label>
          <span class="label-sup">다른 유저와 겹치지 않도록 입력해주세요. (2~20자)</span>
          <input
            v-model="form.nickname"
            @input="onNicknameInput"
            @blur="validateNickname"
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
              { disabled: !nicknameValidation.isValid || nicknameVerification.isDisabled },
              { verified: nicknameVerification.isVerified },
            ]"
            @click="
              nicknameValidation.isValid && !nicknameVerification.isDisabled && checkNickname()
            "
          >
            {{
              nicknameVerification.isVerified ? '사용할 수 있는 닉네임입니다.' : '닉네임 중복확인'
            }}
          </div>

          <div
            v-if="
              formErrors.nickname.message ||
              (form.nickname && !nicknameValidation.isValid && !nicknameVerification.isDisabled)
            "
            class="error-message"
          >
            {{ formErrors.nickname.message || nicknameValidation.message }}
          </div>
        </div>

        <!-- 이름 -->
        <div class="form-items">
          <label for="name">이름</label>
          <input
            v-model="form.name"
            class="login-and-signup-input"
            type="text"
            name="name"
            placeholder="이름을 입력해주세요"
            @blur="validateName"
            @input="clearNameError"
          />
          <div
            v-if="formErrors.name.message || (form.name && !nameValidation.isValid)"
            class="error-message"
          >
            {{ formErrors.name.message || nameValidation.message }}
          </div>
        </div>

        <!-- 전화번호 -->
        <div class="form-items">
          <label for="phone">전화번호</label>
          <input
            v-model="form.phone"
            @input="onPhoneInput"
            @blur="validatePhone"
            class="login-and-signup-input"
            type="text"
            name="phone"
            placeholder="010-0000-0000"
            maxlength="13"
          />
          <div
            v-if="formErrors.phone.message || (form.phone && !phoneValidation.isValid)"
            class="error-message"
          >
            {{ formErrors.phone.message || phoneValidation.message }}
          </div>
        </div>

        <!-- 주소 -->
        <div class="form-items">
          <label for="address">주소</label>

          <div v-if="!fullAddress">
            <input
              class="login-and-signup-input"
              type="text"
              readonly
              placeholder="여기를 클릭해주세요"
              style="background-color: #f8f9fa; cursor: pointer; width: 350px"
              @click="openAddressPopup"
            />
          </div>

          <div v-if="fullAddress">
            <div
              class="login-and-signup-input"
              style="background-color: #f8f9fa; cursor: pointer; display: flex; align-items: center"
              @click="openAddressPopup"
            >
              <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                {{ fullAddress }}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="signup-button button-styles"
          :disabled="!isFormReady || loading"
        >
          {{ loading ? '가입 중...' : '회원가입' }}
        </button>
      </form>

      <div class="option-link">
        이미 아이디가 있으신가요?
        <RouterLink to="/login">로그인</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
