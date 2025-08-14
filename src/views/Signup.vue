<script setup>
import { useUserStore } from '@/store/useUserStore'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  email: '',
  nickname: '',
  password: '',
  passwordCheck: ''
})

const emailVerification = reactive({
  isDisabled: false,
  isVerified: false
})

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.email)
})

const certMessage = computed(() =>
  emailVerification.isVerified
    ? '사용 가능한 이메일입니다.'
    : '이메일 중복 확인을 해주세요.',
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

  // 실제 이메일 중복 확인 API 호출
  const result = await userStore.checkEmailDuplicate(form.email)
  
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
    alert(result.message)
  }
}

const signup = async () => {
  // 기본 검증
  if (!form.email.trim() || !form.nickname.trim() || !form.password.trim()) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  if (form.password !== form.passwordCheck) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  if (!emailVerification.isVerified) {
    alert('이메일 중복 확인을 먼저 해주세요.')
    return
  }

  // 실제 백엔드 API 호출
  const result = await userStore.signup({
    email: form.email,
    nickname: form.nickname,
    password: form.password
  })
  console.log('회원가입 API 응답:', result)

  if (result.success) {
    alert('회원가입이 완료되었습니다. 이메일 인증을 완료한 후 로그인해주세요.')
    router.push('/login')  // 바로 로그인 페이지로 이동
  } else {
    alert(result.message)
  }
}
</script>

<template>
  <div class="login-and-signup-body" id="signup-body">
    <div class="signup-container">
      <a class="logo-text" href="/index.html">PickCook</a>
      <span id="title">회원가입</span>

      <form @submit.prevent="checkEmail">
        <!-- 이메일 -->
        <div class="form-items">
          <label for="email">이메일</label>
          <span class="label-sup">아이디로 사용할 이메일을 입력해주세요.</span>
          <input
            v-model="form.email"
            :disabled="emailVerification.isDisabled"
            class="login-and-signup-input"
            id="signup-email-input"
            type="email"
            name="email"
            placeholder="이메일"
            required
          />
          <div
            id="email-cert-button"
            class="button-styles"
            :class="[{ disabled: !isEmailValid || emailVerification.isDisabled }, { verified: emailVerification.isVerified }]"
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
          <span class="label-sup">영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.</span>
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

        <!-- 닉네임 -->
        <div class="form-items">
          <label for="nickname">닉네임</label>
          <span class="label-sup">다른 유저와 겹치지 않도록 입력해주세요. (2~ 20자)</span>
          <input
            v-model="form.nickname"
            class="login-and-signup-input"
            type="text"
            name="nickname"
            placeholder="닉네임"
          />
          <span
            v-show="nicknameStatus === 'valid'"
            id="usable-nickname-message"
            class="message-style"
            :class="{ 'valid-message': nicknameStatus === 'valid' }"
          >
            사용 가능한 닉네임입니다.
          </span>
          <span
            v-show="nicknameStatus === 'tooShort'"
            id="unusable-nickname-message"
            class="message-style"
          >
            닉네임은 2자 이상이어야 합니다.
          </span>
        </div>

        <!-- 카테고리 -->
        <div class="form-items">
          <label for="nickname">관심 카테고리</label>
          <span class="label-sup">관심있는 레시피 카테고리를 선택해주세요.</span>
          <div id="category-list-box"></div>
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

<style scoped></style>
