<script setup>
import { onMounted, ref } from 'vue'

const formRef = ref(null);
const passwordInputRef = ref(null);
const passwordCheckInputRef = ref(null);

onMounted(() => {
  const form = formRef.value;
  const passwordInput = passwordInputRef.value;
  const passwordCheckInput = passwordCheckInputRef.value;

  form.addEventListener('submit', (e) => {
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      e.preventDefault();
      alert('비밀번호는 영문자와 숫자를 포함해 8자 이상이어야 합니다.');
      return;
    }

    if (password !== passwordCheck) {
      e.preventDefault();
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
  });
});
</script>

<template>
  <div class="login-and-signup-body">
    <div class="signup-container">
      <form ref="formRef" action="/signup" method="post">
        <div class="form-items">
          <label>비밀번호</label>
          <input ref="passwordInputRef" class="login-and-signup-input" type="password" name="password" placeholder="비밀번호" required />
          <input ref="passwordCheckInputRef" class="login-and-signup-input" type="password" name="password-check" placeholder="비밀번호 확인" required />
        </div>
        <button class="signup-button button-styles" type="submit">회원가입</button>
      </form>
    </div>
  </div>
</template>
