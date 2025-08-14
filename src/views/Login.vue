<script setup>
import { useUserStore } from '@/store/useUserStore'
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const formRef = ref(null)

const login = async () => {
  // 프론트: 기본적인 빈 값 체크만
  if (!form.email.trim()) {
    alert('이메일을 입력해주세요.')
    return
  }

  if (!form.password.trim()) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  // 백엔드에서 상세한 검증 처리
  const result = await userStore.login(form.email, form.password)
  
  if (result.success) {
    router.push('/')
  } else {
    alert(result.message)  // 백엔드에서 온 구체적인 오류 메시지
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
            v-model="form.email"
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
            v-model="form.password"
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
        <RouterLink to="/signup">회원가입</RouterLink>
      </div>

      <div class="sns-login">
        <div></div>
        <span>OR</span>
        <div></div>
      </div>
      <div class="sns-icons">
        <a href="http://localhost:8080/oauth2/authorization/kakao"><img src="/assets/icons/ic-kakao-login.png" alt="카카오 로그인" /></a>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
