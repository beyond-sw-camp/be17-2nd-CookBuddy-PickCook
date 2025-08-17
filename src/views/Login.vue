<script setup>
import { useUserStore } from '@/store/useUserStore'
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const auth = useUserStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const formRef = ref(null)

const login = async () => {
  if (!form.email.trim()) {
    alert('이메일을 입력해주세요.')
    return
  }

  if (!form.password.trim()) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  const result = await auth.login(form.email, form.password)

  if (result.success) {
    const nickname = result.user?.nickname || '사용자'
    const encodedNickname = encodeURIComponent(nickname)
    router.push(`/?loginSuccess=true&nickname=${encodedNickname}&loginType=normal`)
  } else {
    alert(result.message)
  }
}

// 🔧 팝업에서 메시지 받는 핸들러
const handlePopupMessage = (event) => {
  if (event.data.type === 'FOUND_EMAIL') {
    form.email = event.data.email // 마스킹된 이메일이 입력됨

    // 사용자가 직접 완전한 이메일을 입력하도록 유도
    setTimeout(() => {
      alert('마스킹 표시된 이메일을 참고하여 완전한 이메일을 입력해주세요.')
      const emailInput = document.querySelector('input[type="email"]')
      if (emailInput) {
        emailInput.focus()
        emailInput.select() // 텍스트 선택상태로 수정 가능하게
      }
    }, 500)
  }
}

// 🔧 아이디 찾기 팝업 열기
const openFindIdPopup = () => {
  try {
    const popup = window.open(
      '/find-id',
      'findIdPopup',
      'width=500,height=600,scrollbars=yes,resizable=yes,top=100,left=100',
    )

    if (!popup || popup.closed) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
      return
    }
  } catch (error) {
    console.error('팝업 열기 실패:', error)
    alert('팝업 열기에 실패했습니다.')
  }
}

// 🔧 비밀번호 찾기 팝업 열기
const openFindPasswordPopup = () => {
  try {
    const popup = window.open(
      '/find-password',
      'findPasswordPopup',
      'width=500,height=600,scrollbars=yes,resizable=yes,top=100,left=100',
    )

    if (!popup || popup.closed) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
      return
    }
  } catch (error) {
    console.error('팝업 열기 실패:', error)
    alert('팝업 열기에 실패했습니다.')
  }
}

// 🔧 이벤트 리스너 관리
onMounted(() => {
  window.addEventListener('message', handlePopupMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handlePopupMessage)
})
</script>

<template>
  <div class="login-and-signup-body">
    <div class="login-container">
      <a class="logo-text" href="/">PickCook</a>
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
        <a href="#" @click.prevent="openFindIdPopup">아이디 찾기</a>
        <span>|</span>
        <a href="#" @click.prevent="openFindPasswordPopup">비밀번호 찾기</a>
        <span>|</span>
        <RouterLink to="/user/signup">회원가입</RouterLink>
      </div>

      <div class="sns-login">
        <div></div>
        <span>OR</span>
        <div></div>
      </div>
      <div class="sns-icons">
        <a href="http://localhost:8080/oauth2/authorization/kakao"
          ><img src="/assets/icons/ic-kakao-login.png" alt="카카오 로그인"
        /></a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
