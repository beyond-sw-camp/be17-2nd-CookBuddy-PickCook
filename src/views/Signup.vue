<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const formRef = ref(null)
const passwordInputRef = ref(null)
const passwordCheckInputRef = ref(null)
const router = useRouter()

onMounted(() => {
  const form = formRef.value
  const passwordInput = passwordInputRef.value
  const passwordCheckInput = passwordCheckInputRef.value

  form?.addEventListener('submit', (e) => {
    const password = passwordInput?.value
    const passwordCheck = passwordCheckInput?.value

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (!passwordRegex.test(password)) {
      e.preventDefault()
      alert('비밀번호는 영문자와 숫자를 포함해 8자 이상이어야 합니다.')
      return
    }

    if (password !== passwordCheck) {
      e.preventDefault()
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    router.push("/")
  })
})
</script>

<template>
  <div class="login-and-signup-body">
    <div class="signup-container">
      <a class="logo-text" href="/index.html">PickCook</a>
      <span id="title">회원가입</span>

      <form ref="formRef" action="/signup/write" method="post">
        <!-- 이메일 입력란 -->
        <div class="form-items">
          <label for="email">이메일</label>
          <span class="label-sup">아이디로 사용할 이메일을 입력해주세요.</span>
          <input class="login-and-signup-input" type="email" name="email" placeholder="이메일" required />
          <div id="email-cert-button" class="button-styles">이메일 인증하기</div>
          <span id="cert-guide-message" class="message-style">입력하신 이메일로 인증 요청 메일을 보냈습니다.</span>
        </div>

        <!-- 비밀번호 입력란 -->
        <div class="form-items">
          <label for="password">비밀번호</label>
          <span class="label-sup">영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.</span>
          <input ref="passwordInputRef" class="login-and-signup-input" type="password" name="password" placeholder="비밀번호" required />
          <input ref="passwordCheckInputRef" class="login-and-signup-input" type="password" name="password-check" placeholder="비밀번호 확인" required />
        </div>

        <!-- 닉네임 입력란 -->
        <div class="form-items">
          <label for="nickname">닉네임</label>
          <span class="label-sup">다른 유저와 겹치지 않도록 입력해주세요. (2~ 20자)</span>
          <input class="login-and-signup-input" type="text" name="nickname" placeholder="닉네임" />
          <span id="usable-nickname-message" class="message-style">사용 가능한 닉네임입니다.</span>
          <span id="unusable-nickname-message" class="message-style">이미 사용중인 닉네임입니다.</span>
        </div>

        <!-- 관심 카테고리 선택란 -->
        <div class="form-items">
          <label for="nickname">관심 카테고리</label>
          <span class="label-sup">관심있는 레시피 카테고리를 선택해주세요.</span>
          <div id="category-list-box"></div>
        </div>

        <button class="signup-button button-styles" type="submit">회원가입</button>
      </form>

      <div class="option-link">
        이미 아이디가 있으신가요?
        <RouterLink to="/login">로그인</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
</style>
