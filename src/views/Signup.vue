<script setup>
import { useUserStore } from '@/store/useUserStore'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useUserStore()

// 이메일
const emailRef = ref('')
const isEmailDisabled = ref(false)
const isEmailVerified = ref(false)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmailValid = computed(() => emailRegex.test(emailRef.value))

const certMessage = computed(() =>
  isEmailVerified.value
    ? '인증이 완료되었습니다.'
    : '입력하신 이메일로 인증 요청 메일을 보냈습니다.',
)

const checkEmail = () => {
  if (!isEmailValid.value) {
    alert('올바른 이메일 형식이 아닙니다.')
    return
  }

  isEmailDisabled.value = true

  setTimeout(() => {
    isEmailVerified.value = true
  }, 3000)
}

// 비밀번호
const passwordInputRef = ref('')
const passwordCheckInputRef = ref('')

const signup = () => {
  const password = passwordInputRef.value
  const passwordCheck = passwordCheckInputRef.value
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

  if (!passwordRegex.test(password)) {
    alert('비밀번호는 영문자와 숫자를 포함해 8자 이상이어야 합니다.')
    return
  }

  if (password !== passwordCheck) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  auth.signup()
  router.push('/')
}

// 닉네임
const nickname = ref('')

const nicknameStatus = computed(() => {
  if (nickname.value.length === 0) return 'empty'
  if (nickname.value.length < 2) return 'tooShort'
  return 'valid'
})
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
            v-model="emailRef"
            :disabled="isEmailDisabled"
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
            :class="[{ disabled: !isEmailValid || isEmailDisabled }, { verified: isEmailVerified }]"
            @click="!isEmailDisabled && isEmailValid && checkEmail()"
          >
            {{ isEmailVerified ? '인증 완료' : '이메일 인증하기' }}
          </div>
          <span
            v-show="isEmailDisabled"
            id="cert-guide-message"
            class="message-style"
            :class="{ 'valid-message': isEmailVerified }"
          >
            {{ certMessage }}
          </span>
        </div>

        <!-- 비밀번호 -->
        <div class="form-items">
          <label for="password">비밀번호</label>
          <span class="label-sup">영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.</span>
          <input
            v-model="passwordInputRef"
            class="login-and-signup-input"
            type="password"
            name="password"
            placeholder="비밀번호"
            required
          />
          <input
            v-model="passwordCheckInputRef"
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
            v-model="nickname"
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

        <button class="signup-button button-styles" @click="signup">회원가입</button>
      </form>

      <div class="option-link">
        이미 아이디가 있으신가요?
        <RouterLink to="/login">로그인</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
