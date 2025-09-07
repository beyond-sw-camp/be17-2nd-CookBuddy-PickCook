<script setup>
import { useUserStore } from '@/store/useUserStore'
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const auth = useUserStore()
const router = useRouter()

const kakaoLoginUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  return `${baseUrl}/oauth2/authorization/kakao`
})

console.log(kakaoLoginUrl)

// 폼 데이터 관리
const form = reactive({
  email: '',
  password: '',
})

// 폼 참조 및 상태
const formRef = ref(null)
const loading = ref(false)
const formValid = ref(false)

// 에러 상태 관리
const formErrors = reactive({
  email: { message: '', isValid: false },
  password: { message: '', isValid: false },
})

// 검증 규칙
const emailRules = [
  (v) => !!v || '이메일을 입력해주세요',
  (v) => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다',
]

const passwordRules = [
  (v) => !!v || '비밀번호를 입력해주세요',
  (v) =>
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}$/.test(v) ||
    '비밀번호는 영문, 숫자, 특수문자(!@#$%^&*())를 포함한 8-20자여야 합니다',
]

// 실시간 검증 상태 (computed)
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

// 실시간 검증 함수 (blur용)
const validateEmail = () => {
  formErrors.email.isValid = emailValidation.value.isValid
  formErrors.email.message = emailValidation.value.message
}

const validatePassword = () => {
  formErrors.password.isValid = passwordValidation.value.isValid
  formErrors.password.message = passwordValidation.value.message
}

// 폼 준비 상태 계산 (실시간)
const isFormReady = computed(() => {
  return (
    form.email.trim() &&
    form.password.trim() &&
    emailValidation.value.isValid &&
    passwordValidation.value.isValid
  )
})

// 로그인 처리
const login = async () => {
  validateEmail()
  validatePassword()

  if (!isFormReady.value) {
    return
  }

  loading.value = true

  try {
    const result = await auth.login(form.email, form.password)

    if (result.success) {
      // ✅ 추가: 로그인 후 즉시 최신 사용자 정보 조회
      const currentUserResult = await auth.getCurrentUser()
      const nickname = result.user?.nickname || '사용자'
      const encodedNickname = encodeURIComponent(nickname)
      router.push(`/?loginSuccess=true&nickname=${encodedNickname}&loginType=normal`)
    } else {
      formErrors.email.message = result.message
      formErrors.email.isValid = false
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    formErrors.email.message = '로그인 중 오류가 발생했습니다.'
    formErrors.email.isValid = false
  } finally {
    loading.value = false
  }
}

// 에러 메시지 초기화
const clearEmailError = () => {
  formErrors.email.message = ''
}

const clearPasswordError = () => {
  formErrors.password.message = ''
}

// 팝업 메시지 핸들러
const handlePopupMessage = (event) => {
  if (event.data.type === 'FOUND_EMAIL') {
    form.email = event.data.email

    setTimeout(() => {
      alert('마스킹 표시된 이메일을 참고하여 완전한 이메일을 입력해주세요.')
      const emailInput = document.querySelector('input[type="email"]')
      if (emailInput) {
        emailInput.focus()
        emailInput.select()
      }
    }, 500)
  }
}

// 팝업 열기 함수들
const openFindIdPopup = () => {
  try {
    const popup = window.open(
      '/find-id',
      'findIdPopup',
      'width=500,height=600,scrollbars=yes,resizable=yes,top=100,left=100',
    )

    if (!popup || popup.closed) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
      return
    }
  } catch (error) {
    console.error('팝업 열기 실패:', error)
    alert('팝업 열기에 실패했습니다.')
  }
}

const openFindPasswordPopup = () => {
  try {
    const popup = window.open(
      '/find-password',
      'findPasswordPopup',
      'width=500,height=600,scrollbars=yes,resizable=yes,top=100,left=100',
    )

    if (!popup || popup.closed) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
      return
    }
  } catch (error) {
    console.error('팝업 열기 실패:', error)
    alert('팝업 열기에 실패했습니다.')
  }
}

// 라이프사이클 관리
onMounted(() => {
  window.addEventListener('message', handlePopupMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handlePopupMessage)
})
</script>

<template>
  <div class="login-and-signup-body">
    <div class="login-container">
      <a class="logo-text" href="/">PickCook</a>
      <span id="title">로그인</span>

      <form ref="formRef" action="/login" method="post" @submit.prevent="login">
        <div class="form-items">
          <label for="email">이메일</label>
          <input
            v-model="form.email"
            class="login-and-signup-input"
            type="email"
            name="email"
            placeholder="이메일"
            @blur="validateEmail"
            @input="clearEmailError"
            required
          />
          <!-- 에러 메시지 표시 (실시간) -->
          <div
            v-if="formErrors.email.message || (form.email && !emailValidation.isValid)"
            class="error-message"
          >
            {{ formErrors.email.message || emailValidation.message }}
          </div>
        </div>

        <div class="form-items">
          <label for="password">비밀번호</label>
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
          <!-- 에러 메시지 표시 (실시간) -->
          <div
            v-if="formErrors.password.message || (form.password && !passwordValidation.isValid)"
            class="error-message"
          >
            {{ formErrors.password.message || passwordValidation.message }}
          </div>
        </div>

        <button class="login-button" type="submit" :disabled="!isFormReady || loading">
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <div class="option-links">
        <a href="#" @click.prevent="openFindIdPopup">아이디 찾기</a>
        <span>|</span>
        <a href="#" @click.prevent="openFindPasswordPopup">비밀번호 찾기</a>
        <span>|</span>
        <RouterLink to="/user/signup">회원가입</RouterLink>
      </div>

      <div class="sns-login">
        <div></div>
        <span>OR</span>
        <div></div>
      </div>
      <div class="sns-icons">
        <a :href="kakaoLoginUrl">
          <img src="/assets/icons/ic-kakao-login.png" alt="카카오 로그인" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
