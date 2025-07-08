<script setup></script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-array">
        <div class="footer-logo">PickCook</div>

        <div class="footer-links">
          <a href="#">이메일 문의</a>
          <a href="#">이용약관</a>
          <a href="#">제휴/광고 문의</a>
          <a href="#">상품광고 소개</a>
        </div>

        <div class="footer-social">
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
          <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#"><i class="fa-regular fa-envelope"></i></a>
        </div>
      </div>

      <div class="footer-copyright">© 2025 PickCook. All rights reserved.</div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #eceff5;
  margin-top: 80px;
  padding: 75px 0 26px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary-strong);
  margin-bottom: 20px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 85px;
  margin-bottom: 20px;
}

.footer-links a {
  color: var(--color-gray);
  font-size: 13px;
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--color-dark-strong);
}

.footer-array {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 118px;
}

.footer-social {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: -20px;
}

.footer-social a {
  color: #999;
  font-size: 20px;
  transition: color 0.2s;
}

.footer-social a:hover {
  color: var(--color-primary);
}

.footer-copyright {
  color: var(--color-gray);
  font-size: 13px;
  margin-top: 51px;
}
</style>
