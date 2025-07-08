<script setup>
import { useUserStore } from '@/store/useUserStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useUserStore()
const router = useRouter()

// 템플릿에서 참조할 ref들 정의
const formRef = ref(null)
const emailRef = ref(null)
const passwordRef = ref(null)

const login = () => {
  const email = emailRef.value
  const password = passwordRef.value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

  console.log(email, password)
  if (!emailRegex.test(email)) {
    alert('올바른 이메일 형식을 입력해주세요.')
    return
  }

  if (!passwordRegex.test(password)) {
    alert('비밀번호는 영문자와 숫자를 포함해 8자 이상이어야 합니다.')
    return
  }

  auth.checkLogin(email, password)
  if (auth.isLogin) {
    router.push('/')
  } else {
    alert('아이디 또는 비밀번호가 일치하지 않습니다.')
  }
}
</script>

<template>
  <div class="login-and-signup-body">
    <div class="login-container">
      <a class="logo-text" href="/index.html">PickCook</a>
      <span id="title">로그인</span>
      <form ref="formRef" action="/login" method="post" @submit.prevent="login">
        <div class="form-items">
          <label for="email">이메일</label>
          <input
            v-model="emailRef"
            class="login-and-signup-input"
            type="email"
            name="email"
            placeholder="이메일"
            required
          />
        </div>
        <div class="form-items">
          <label for="password">비밀번호</label>
          <input
            v-model="passwordRef"
            class="login-and-signup-input"
            type="password"
            name="password"
            placeholder="비밀번호"
            required
          />
        </div>
        <button class="login-button" type="submit">로그인</button>
      </form>

      <div class="option-links">
        <a href="/find-id.html">아이디 찾기</a>
        <span>|</span>
        <a href="/find-password.html">비밀번호 찾기</a>
        <span>|</span>
        <a href="/signup_type_select.html">회원가입</a>
      </div>

      <div class="sns-login">
        <div></div>
        <span>OR</span>
        <div></div>
      </div>
      <div class="sns-icons">
        <a href="#"><img src="/assets/icons/ic-google-login.png" alt="구글 로그인" /></a>
        <a href="#"><img src="/assets/icons/ic-kakao-login.png" alt="카카오 로그인" /></a>
        <a href="#"><img src="/assets/icons/ic-naver-login.png" alt="네이버 로그인" /></a>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
