<script setup>
import { useBreakpoints } from '@/composables/useBreakpoints.js'

const { isDesktop, isMobile, isTablet } = useBreakpoints()
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div v-if="isMobile" class="footer-array-mobile">
        <div class="footer-logo-mobile">PickCook</div>

        <div class="footer-links-mobile">
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
      <div v-else class="footer-array">
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
</style>
