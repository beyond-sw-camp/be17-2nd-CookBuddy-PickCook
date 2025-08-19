<script setup>
import { reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import api from '@/api/user/index.js'

const userStore = useUserStore()

// 아까 만든 모달 로직 그대로 가져오기
const form = reactive({
  email: '',
})

const state = reactive({
  loading: false,
  emailSent: false,
})

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.email)
})

const sendResetEmail = async () => {
  if (!isEmailValid.value) {
    alert('올바른 이메일 주소를 입력해주세요.')
    return
  }

  state.loading = true

  try {
    const response = await api.requestPasswordReset(form.email)

    if (response.success) {
      state.emailSent = true
    } else {
      alert(response.message || '요청 처리 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('비밀번호 재설정 요청 오류:', error)
    alert('요청 처리 중 오류가 발생했습니다.')
  } finally {
    state.loading = false
  }
}

const resendEmail = async () => {
  state.emailSent = false
  await sendResetEmail()
}

// 🔧 수정: 팝업 전용 함수
const closePopup = () => {
  window.close()
}
</script>

<template>
  <!-- 🔧 수정: 기존 모달 템플릿 그대로 사용 -->
  <div class="login-and-signup-body">
    <div class="login-container">
      <a class="logo-text" href="/">PickCook</a>
      <span id="title">비밀번호 찾기</span>

      <!-- 이메일 입력 폼 (기존 모달과 동일) -->
      <form v-if="!state.emailSent" @submit.prevent="sendResetEmail">
        <div class="form-items">
          <label for="email">이메일</label>
          <input
            v-model="form.email"
            class="login-and-signup-input"
            :style="{ borderColor: form.email && !isEmailValid ? '#dc3545' : '' }"
            type="email"
            name="email"
            placeholder="가입 시 사용한 이메일을 입력해주세요"
            :disabled="state.loading"
            required
          />
          <div
            v-if="form.email && !isEmailValid"
            style="color: #dc3545; font-size: 12px; margin-top: 5px"
          >
            올바른 이메일 형식이 아닙니다.
          </div>
        </div>

        <button class="login-button" type="submit" :disabled="state.loading || !isEmailValid">
          {{ state.loading ? '발송 중...' : '재설정 이메일 발송' }}
        </button>
      </form>

      <!-- 발송 완료 화면 (기존 모달과 동일) -->
      <div v-else>
        <div class="form-items" style="text-align: center; margin-bottom: 30px">
          <div style="font-size: 48px; margin-bottom: 20px">📧</div>
          <h3 style="color: #333; margin-bottom: 15px">이메일이 발송되었습니다!</h3>
        </div>

        <div class="form-items">
          <label>발송된 이메일</label>
          <div
            class="login-and-signup-input"
            style="background-color: #f8f9fa; color: #e14345; font-weight: bold; text-align: center"
          >
            {{ form.email }}
          </div>
        </div>
        <br />

        <div class="form-items">
          <div
            style="
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 4px;
              border-left: 4px solid #e14345;
            "
          >
            <p style="margin: 0 0 10px 0; font-size: 14px">
              <strong>📌 안내사항</strong>
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px">
              1️⃣ 이메일함을 확인해주세요 (스팸메일함도 확인)
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px">
              2️⃣ "비밀번호 재설정" 링크를 클릭해주세요
            </p>
            <p style="margin: 0; font-size: 13px">3️⃣ 새로운 비밀번호를 설정해주세요</p>
          </div>
        </div>
        <button class="login-button" @click="resendEmail">이메일 재발송</button>
      </div>
      <br />

      <!-- 🔧 수정: 팝업용 링크 -->
      <div class="option-links">
        <a href="#" @click="closePopup">닫기</a>
        <span>|</span>
        <a href="/find-id" target="_blank">아이디 찾기</a>
        <span>|</span>
        <RouterLink to="/user/signup" target="_blank">회원가입</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS 없음 - Login.vue의 CSS 클래스 그대로 사용 */
</style>
