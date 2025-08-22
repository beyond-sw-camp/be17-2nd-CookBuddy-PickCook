<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import api from '@/api/user/index.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// =================================================================
// 상태 관리
// =================================================================

// URL 파라미터 처리
const token = route.query.token
const isInternal = route.query.type === 'internal'

// 폼 데이터
const formData = reactive({
  currentPassword: '', // 마이페이지에서 온 경우만 사용
  newPassword: '',
  confirmPassword: '',
})

// 페이지 상태
const pageState = reactive({
  loading: false,
  tokenValid: false,
  tokenChecked: false,
  tokenInfo: null,
})

// 포커스 상태 (기존 로그인 페이지와 동일한 패턴)
const focusState = reactive({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
})

// =================================================================
// 비밀번호 검증 로직 (로그인 페이지와 동일한 패턴)
// =================================================================

// 비밀번호 검증 규칙
const passwordValidation = reactive({
  minLength: false, // 8자 이상
  hasLetter: false, // 영문 포함
  hasNumber: false, // 숫자 포함
  hasSpecial: false, // 특수문자 포함
  isValid: false, // 전체 유효성
})

// 확인 비밀번호 검증
const confirmValidation = reactive({
  matches: false, // 비밀번호 일치
  touched: false, // 사용자가 입력했는지 여부
})

// 현재 비밀번호 에러 상태
const currentPasswordError = ref('')

// 실시간 비밀번호 검증 함수
const validatePassword = (password) => {
  passwordValidation.minLength = password.length >= 8
  passwordValidation.hasLetter = /[a-zA-Z]/.test(password)
  passwordValidation.hasNumber = /\d/.test(password)
  passwordValidation.hasSpecial = /[!@#$%^&*()]/.test(password)

  passwordValidation.isValid =
    passwordValidation.minLength &&
    passwordValidation.hasLetter &&
    passwordValidation.hasNumber &&
    passwordValidation.hasSpecial
}

// 확인 비밀번호 검증 함수
const validateConfirmPassword = (confirmPassword, originalPassword) => {
  confirmValidation.matches = confirmPassword === originalPassword && originalPassword.length > 0
}

// 비밀번호 강도 메시지 (동적)
const passwordStrengthMessage = computed(() => {
  const validCount = [
    passwordValidation.minLength,
    passwordValidation.hasLetter,
    passwordValidation.hasNumber,
    passwordValidation.hasSpecial,
  ].filter(Boolean).length

  switch (validCount) {
    case 0:
    case 1:
      return { text: '매우 약함', class: 'strength-very-weak' }
    case 2:
      return { text: '약함', class: 'strength-weak' }
    case 3:
      return { text: '보통', class: 'strength-medium' }
    case 4:
      return { text: '강함', class: 'strength-strong' }
    default:
      return { text: '', class: '' }
  }
})

// =================================================================
// 버튼 활성화 조건 (로그인 페이지 패턴)
// =================================================================

const isSubmitDisabled = computed(() => {
  if (isInternal) {
    // 마이페이지에서 온 경우: 현재 비밀번호도 필요
    return !(
      formData.currentPassword.length > 0 && // 현재 비밀번호 입력됨
      passwordValidation.isValid && // 새 비밀번호 규칙 통과
      confirmValidation.matches && // 비밀번호 일치
      !pageState.loading // 로딩 중이 아님
    )
  } else {
    // 이메일에서 온 경우: 현재 비밀번호 불필요
    return !(
      passwordValidation.isValid && // 새 비밀번호 규칙 통과
      confirmValidation.matches && // 비밀번호 일치
      !pageState.loading // 로딩 중이 아님
    )
  }
})

// 제출 버튼 텍스트 및 스타일
const submitButtonText = computed(() => {
  if (pageState.loading) return '처리 중...'
  if (isInternal) return '비밀번호 변경'
  return '비밀번호 재설정'
})

// =================================================================
// 이벤트 핸들링 로직
// =================================================================

// 새 비밀번호 입력 처리
const handlePasswordInput = () => {
  validatePassword(formData.newPassword)

  // 확인 비밀번호가 이미 입력되어 있다면 재검증
  if (confirmValidation.touched) {
    validateConfirmPassword(formData.confirmPassword, formData.newPassword)
  }
}

// 비밀번호 확인 입력 처리
const handleConfirmPasswordInput = () => {
  confirmValidation.touched = true
  validateConfirmPassword(formData.confirmPassword, formData.newPassword)
}

// 비밀번호 확인 필드 blur 처리
const handleConfirmPasswordBlur = () => {
  confirmValidation.touched = true
  validateConfirmPassword(formData.confirmPassword, formData.newPassword)
  focusState.confirmPassword = false
}

// =================================================================
// API 호출 로직
// =================================================================

// 토큰 검증
const validateToken = async () => {
  if (!token) {
    showErrorAndRedirect('유효하지 않은 접근입니다.')
    return
  }

  try {
    const response = await api.validateResetToken(token)

    if (response.success && response.results.valid) {
      pageState.tokenValid = true
      pageState.tokenInfo = response.results
    } else {
      showErrorAndRedirect('토큰이 유효하지 않거나 만료되었습니다.')
    }
  } catch (error) {
    console.error('토큰 검증 오류:', error)
    showErrorAndRedirect('토큰 검증 중 오류가 발생했습니다.')
  } finally {
    pageState.tokenChecked = true
  }
}

// 비밀번호 재설정 제출
const handleSubmit = async () => {
  // 이미 로딩 중이거나 유효하지 않으면 리턴
  if (pageState.loading || isSubmitDisabled.value) return

  // 최종 검증
  if (!passwordValidation.isValid) {
    showToast('비밀번호 요구사항을 모두 충족해주세요', 'warning')
    return
  }

  if (!confirmValidation.matches) {
    showToast('비밀번호가 일치하지 않습니다', 'warning')
    return
  }

  // 로딩 상태 시작
  pageState.loading = true
  currentPasswordError.value = ''

  try {
    const requestData = {
      token: token,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    }

    // 마이페이지에서 온 경우 현재 비밀번호 추가
    if (isInternal) {
      requestData.currentPassword = formData.currentPassword
    }

    const response = await api.resetPassword(requestData)

    if (response.success) {
      // 성공 처리
      showToast('🎉 비밀번호가 성공적으로 변경되었습니다!', 'success')

      // 🔧 추가: 프론트엔드 상태 강제 초기화 (백엔드에서 쿠키 삭제됨)
      await userStore.logout()

      // 보안 안내
      setTimeout(() => {
        showToast('보안을 위해 모든 기기에서 재로그인이 필요합니다.', 'info')
      }, 1000)

      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      // 실패 처리
      handleApiError(response)
    }
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error)
    showToast('요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error')
  } finally {
    // 로딩 상태 해제
    pageState.loading = false
  }
}

// =================================================================
// 헬퍼 함수들
// =================================================================

// 에러 메시지 표시 및 리다이렉트
const showErrorAndRedirect = (message) => {
  alert(message)
  router.push('/login')
}

// 토스트 메시지 (실제 구현에서는 토스트 라이브러리 사용)
const showToast = (message, type = 'info') => {
  // 간단한 alert으로 구현 (추후 토스트 라이브러리로 교체 가능)
  alert(message)
}

// API 에러 처리
const handleApiError = (response) => {
  const message = response.message || '알 수 없는 오류가 발생했습니다.'

  // 특정 에러 코드별 처리
  if (response.code === 30302) {
    showToast('링크가 만료되었습니다. 비밀번호 재설정을 다시 요청해주세요.', 'error')
    setTimeout(() => router.push('/login'), 2000)
  } else if (response.code === 30303) {
    showToast('기존 비밀번호와 다른 비밀번호를 입력해주세요.', 'warning')
  } else if (response.code === 30304) {
    showToast('비밀번호가 일치하지 않습니다.', 'warning')
  } else if (message.includes('현재 비밀번호')) {
    currentPasswordError.value = message
  } else {
    showToast(message, 'error')
  }
}

// =================================================================
// 라이프사이클
// =================================================================

onMounted(async () => {
  // 페이지 로드 시 토큰 검증
  await validateToken()
})
</script>

<template>
  <!-- 기존 로그인 페이지와 동일한 레이아웃 -->
  <div class="login-and-signup-body">
    <div class="login-container">
      <!-- 로고 -->
      <a class="logo-text" href="/">PickCook</a>

      <!-- 제목 (시나리오별 차별화) -->
      <span id="title">
        {{ isInternal ? '비밀번호 변경' : '비밀번호 재설정' }}
      </span>

      <!-- 로딩 중일 때 -->
      <div v-if="!pageState.tokenChecked" style="text-align: center; padding: 40px">
        <div style="font-size: 48px; margin-bottom: 20px">⏳</div>
        <p>토큰을 확인하고 있습니다...</p>
      </div>

      <!-- 토큰이 유효하지 않을 때 -->
      <div v-else-if="!pageState.tokenValid" style="text-align: center; padding: 40px">
        <div style="font-size: 48px; margin-bottom: 20px">❌</div>
        <p style="color: #dc3545">유효하지 않거나 만료된 링크입니다.</p>
        <p style="color: #666; font-size: 14px">로그인 페이지로 이동합니다...</p>
      </div>

      <!-- 메인 폼 -->
      <form v-else @submit.prevent="handleSubmit">
        <!-- 안내 메시지 (시나리오별 차별화) -->
        <div class="form-items" style="text-align: center; margin-bottom: 20px">
          <p v-if="isInternal" style="color: #666; font-size: 14px; margin: 0">
            🔒 보안을 위해 현재 비밀번호를 확인합니다
          </p>
          <p v-else style="color: #666; font-size: 14px; margin: 0">
            📧 이메일 링크를 통한 비밀번호 재설정
          </p>
        </div>

        <!-- 현재 비밀번호 (마이페이지에서 온 경우만) -->
        <div v-if="isInternal" class="form-items">
          <label for="currentPassword">현재 비밀번호</label>
          <input
            v-model="formData.currentPassword"
            class="login-and-signup-input"
            :style="{ borderColor: currentPasswordError ? '#dc3545' : '' }"
            type="password"
            name="currentPassword"
            placeholder="현재 비밀번호를 입력하세요"
            @focus="focusState.currentPassword = true"
            @blur="focusState.currentPassword = false"
            :disabled="pageState.loading"
            required
          />
          <div v-if="currentPasswordError" style="color: #dc3545; font-size: 12px; margin-top: 5px">
            {{ currentPasswordError }}
          </div>
        </div>

        <!-- 새 비밀번호 -->
        <div class="form-items">
          <label for="newPassword">새 비밀번호</label>
          <input
            v-model="formData.newPassword"
            class="login-and-signup-input"
            :style="{
              borderColor:
                !passwordValidation.isValid && formData.newPassword.length > 0
                  ? '#dc3545'
                  : passwordValidation.isValid
                    ? '#28a745'
                    : '',
            }"
            type="password"
            name="newPassword"
            placeholder="새 비밀번호를 입력하세요"
            @input="handlePasswordInput"
            @focus="focusState.newPassword = true"
            @blur="focusState.newPassword = false"
            :disabled="pageState.loading"
            required
          />

          <!-- 실시간 검증 피드백 -->
          <div v-if="formData.newPassword.length > 0" style="margin-top: 10px">
            <!-- 비밀번호 강도 표시 -->
            <div style="margin-bottom: 8px">
              <span style="font-size: 12px; color: #666">비밀번호 강도: </span>
              <span
                :style="{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color:
                    passwordStrengthMessage.text === '강함'
                      ? '#28a745'
                      : passwordStrengthMessage.text === '보통'
                        ? '#ffc107'
                        : passwordStrengthMessage.text === '약함'
                          ? '#fd7e14'
                          : '#dc3545',
                }"
              >
                {{ passwordStrengthMessage.text }}
              </span>
            </div>

            <!-- 상세 검증 항목들 -->
            <div
              style="
                background-color: #f8f9fa;
                padding: 10px;
                border-radius: 4px;
                border-left: 4px solid #e14345;
              "
            >
              <div style="font-size: 12px; color: #333; margin-bottom: 5px">
                <strong>비밀번호 요구사항</strong>
              </div>
              <div
                style="font-size: 12px; margin: 3px 0"
                :style="{ color: passwordValidation.minLength ? '#28a745' : '#dc3545' }"
              >
                {{ passwordValidation.minLength ? '✅' : '❌' }} 8자 이상
              </div>
              <div
                style="font-size: 12px; margin: 3px 0"
                :style="{ color: passwordValidation.hasLetter ? '#28a745' : '#dc3545' }"
              >
                {{ passwordValidation.hasLetter ? '✅' : '❌' }} 영문 포함
              </div>
              <div
                style="font-size: 12px; margin: 3px 0"
                :style="{ color: passwordValidation.hasNumber ? '#28a745' : '#dc3545' }"
              >
                {{ passwordValidation.hasNumber ? '✅' : '❌' }} 숫자 포함
              </div>
              <div
                style="font-size: 12px; margin: 3px 0"
                :style="{ color: passwordValidation.hasSpecial ? '#28a745' : '#dc3545' }"
              >
                {{ passwordValidation.hasSpecial ? '✅' : '❌' }} 특수문자 포함 (!@#$%^&*())
              </div>
            </div>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-items">
          <label for="confirmPassword">비밀번호 확인</label>
          <input
            v-model="formData.confirmPassword"
            class="login-and-signup-input"
            :style="{
              borderColor:
                !confirmValidation.matches && confirmValidation.touched
                  ? '#dc3545'
                  : confirmValidation.matches && confirmValidation.touched
                    ? '#28a745'
                    : '',
            }"
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            @input="handleConfirmPasswordInput"
            @focus="focusState.confirmPassword = true"
            @blur="handleConfirmPasswordBlur"
            :disabled="pageState.loading"
            required
          />
          <div
            v-if="!confirmValidation.matches && confirmValidation.touched"
            style="color: #dc3545; font-size: 12px; margin-top: 5px"
          >
            비밀번호가 일치하지 않습니다
          </div>
          <div
            v-if="confirmValidation.matches && confirmValidation.touched"
            style="color: #28a745; font-size: 12px; margin-top: 5px"
          >
            비밀번호가 일치합니다
          </div>
        </div>

        <!-- 제출 버튼 -->
        <button
          class="login-button"
          type="submit"
          :disabled="isSubmitDisabled"
          :style="{
            opacity: isSubmitDisabled ? 0.6 : 1,
            cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
          }"
        >
          {{ submitButtonText }}
        </button>

        <!-- 추가 안내 메시지 -->
        <div
          style="
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #e14345;
          "
        >
          <div v-if="isInternal" style="font-size: 13px; color: #856404">
            <p style="margin: 0 0 8px 0"><strong>🔒 보안 안내</strong></p>
            <p style="margin: 0 0 5px 0">• 보안을 위해 현재 비밀번호를 확인합니다</p>
            <p style="margin: 0 0 5px 0">• 변경 완료 후 모든 기기에서 재로그인이 필요합니다</p>
            <p style="margin: 0">• 이는 계정 보안을 위한 정상적인 절차입니다</p>
          </div>
          <div v-else style="font-size: 13px; color: #856404">
            <p style="margin: 0 0 8px 0"><strong>📧 이메일 링크 안내</strong></p>
            <p style="margin: 0 0 5px 0">• 이메일 링크를 통한 비밀번호 재설정</p>
            <p style="margin: 0 0 5px 0">• 변경 완료 후 모든 기기에서 재로그인이 필요합니다</p>
            <p style="margin: 0">
              • 토큰은 {{ pageState.tokenInfo?.remainingMinutes || 30 }}분 후 만료됩니다
            </p>
          </div>
        </div>
      </form>

      <!-- 하단 링크 -->
      <div class="option-links" style="margin-top: 20px">
        <a href="#" @click.prevent="router.push('/login')">로그인으로 돌아가기</a>
        <span>|</span>
        <a href="#" @click.prevent="router.push('/find-password')">비밀번호 찾기</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기존 로그인 페이지 CSS 클래스 재사용 - 추가 스타일 없음 */
button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

/* 실시간 피드백을 위한 최소한의 스타일 */
.strength-very-weak {
  color: #dc3545;
}
.strength-weak {
  color: #fd7e14;
}
.strength-medium {
  color: #ffc107;
}
.strength-strong {
  color: #28a745;
}
</style>
