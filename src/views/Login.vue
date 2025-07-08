<script setup>

</script>

<template>
  <div class="login-and-signup-body">
<div class="login-container">
    <a class="logo-text" href="/index.html">PickCook</a>
    <span id="title">로그인</span>

    <form action="/login" method="post">
      <div class="form-items">
        <label for="email">이메일</label>
        <input class="login-and-signup-input" type="email" name="email" placeholder="이메일" required />
      </div>
      <div class="form-items">
        <label for="password">비밀번호</label>
        <input class="login-and-signup-input" type="password" name="password" placeholder="비밀번호" required />
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
      <a href="#"><img src="/assets/icons/ic-google-login.png" alt="구글 로그인"></a>
      <a href="#"><img src="/assets/icons/ic-kakao-login.png" alt="카카오 로그인" /></a>
      <a href="#"><img src="/assets/icons/ic-naver-login.png" alt="네이버 로그인"></a>
    </div>
  </div>
  </div>
</template>

<style scoped>

</style>