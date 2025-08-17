<script setup>
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import api from '@/api/user/index'

const userStore = useUserStore()

// 아까 만든 모달 로직 그대로 가져오기
const form = reactive({
  name: '',
  phone: '',
})

const result = reactive({
  found: false,
  maskedEmail: '',
  actualEmail: '',
  loading: false,
})

const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const onPhoneInput = (event) => {
  form.phone = formatPhoneNumber(event.target.value)
}

// 🔧 수정: 올바른 API 사용
const findEmail = async () => {
  if (!form.name.trim() || !form.phone.trim()) {
    alert('이름과 전화번호를 모두 입력해주세요.')
    return
  }

  console.log('=== 프론트엔드 디버깅 ===')
  console.log('form.name:', form.name)
  console.log('form.phone:', form.phone)
  console.log('실제 값 타입:', typeof form.name, typeof form.phone)

  result.loading = true

  try {
    // 🔧 수정: api.findEmail 메서드 사용
    const response = await api.findEmail(form.name, form.phone)

    console.log('API 응답:', response)

    if (response.success) {
      result.found = true
      result.maskedEmail = response.data.maskedEmail
      result.actualEmail = response.data.email
    } else {
      alert(response.message || '일치하는 계정을 찾을 수 없습니다.')
    }
  } catch (error) {
    console.error('아이디 찾기 오류:', error)
    alert('아이디 찾기 중 오류가 발생했습니다.')
  } finally {
    result.loading = false
  }
}

// 🔧 수정: 팝업 전용 함수들
const closePopup = () => {
  window.close()
}

// 🔧 수정: 실제 이메일을 부모 창에 전달
const goToLogin = () => {
  if (window.opener) {
    window.opener.postMessage(
      {
        type: 'FOUND_EMAIL',
        email: result.maskedEmail,
        domain: result.actualEmail.split('@')[1],
      },
      '*',
    )
    window.close()
  }
}
</script>

<template>
  <div class="login-and-signup-body">
    <div class="login-container">
      <a class="logo-text" href="/">PickCook</a>
      <span id="title">아이디 찾기</span>

      <!-- 🔧 수정: 명확한 안내 메시지 추가 -->
      <form v-if="!result.found" @submit.prevent="findEmail">
        <div class="form-items">
          <label for="name">이름</label>
          <span
            class="label-sup"
            style="color: #666; font-size: 12px; display: block; margin-bottom: 5px"
          >
            회원가입 시 입력한 실제 이름을 입력해주세요 (이메일 주소가 아닙니다)
          </span>
          <input
            v-model="form.name"
            class="login-and-signup-input"
            type="text"
            name="name"
            placeholder="예: 홍길동 (이메일 주소 아님)"
            :disabled="result.loading"
            required
          />
        </div>

        <div class="form-items">
          <label for="phone">전화번호</label>
          <span
            class="label-sup"
            style="color: #666; font-size: 12px; display: block; margin-bottom: 5px"
          >
            회원가입 시 입력한 전화번호를 입력해주세요
          </span>
          <input
            v-model="form.phone"
            @input="onPhoneInput"
            class="login-and-signup-input"
            type="text"
            name="phone"
            placeholder="010-0000-0000"
            :disabled="result.loading"
            required
          />
        </div>

        <button class="login-button" type="submit" :disabled="result.loading">
          {{ result.loading ? '찾는 중...' : '아이디 찾기' }}
        </button>
      </form>

      <!-- 결과 표시 -->
      <div v-else>
        <div class="form-items" style="text-align: center; margin-bottom: 30px">
          <div style="font-size: 48px; margin-bottom: 20px">✅</div>
          <h3 style="color: #333; margin-bottom: 15px">아이디를 찾았습니다!</h3>
        </div>

        <div class="form-items">
          <label>찾은 아이디(이메일)</label>
          <div
            class="login-and-signup-input"
            style="background-color: #f8f9fa; color: #e14345; font-weight: bold; text-align: center"
          >
            {{ result.maskedEmail }}
          </div>
        </div>

        <button class="login-button" @click="goToLogin">로그인하기</button>
      </div>
      <br />

      <!-- 링크들 -->
      <div class="option-links">
        <a href="#" @click="closePopup">닫기</a>
        <span>|</span>
        <a href="/find-password" target="_blank">비밀번호 찾기</a>
        <span>|</span>
        <RouterLink to="/user/signup" target="_blank">회원가입</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS 없음 - Login.vue의 CSS 클래스 그대로 사용 */
</style>
