<!-- 개인정보 수집·이용 및 처리 동의 모달 -->
<script setup>
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
}
</script>

<template>
  <div id="terms-modal-backdrop" @click.self="close">
    <div class="terms-modal-body">
      <div class="terms-modal-content">
        <h1 class="terms_title">개인정보 수집·이용 및 처리 동의 (필수)</h1>
        <div class="scroll_wrapper box_tbl">
          <h4 class="tit_main">개인정보 수집·이용 동의</h4>
          <table>
            <colgroup>
              <col width="18%">
              <col width="15%">
              <col width="15%">
              <col width="35%">
              <col width="17%">
            </colgroup>
            <thead>
              <tr>
                <th>구분</th>
                <th>목적</th>
                <th colspan="2">수집 항목</th>
                <th>보유 및 이용기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="4">주문 및 배송 서비스 제공</td>
                <td rowspan="3">주문 관리</td>
                <td>공통</td>
                <td>주문자정보(아이디, 이름, 이메일, 휴대폰번호), 구매상품정보, 결제정보</td>
                <td rowspan="4" class="emph">회원 탈퇴 후 5년</td>
              </tr>
              <tr>
                <td>배송 상품</td>
                <td>
                  수취인정보(이름, 휴대폰번호, 주소, 공동현관비밀번호, 전달사항)<br>
                  (관세청 통관 처리 필요상품 구매 시)<br>
                  개인통관고유부호
                </td>
              </tr>
              <tr>
                <td>주류</td>
                <td>주문자정보(성인인증정보)</td>
              </tr>
              <tr>
                <td>결제 관리</td>
                <td colspan="2">결제정보(결제수단, 결제금액, 결제상태), (현금영수증 신청 시) 이름, 핸드폰번호</td>
              </tr>
            </tbody>
          </table>
          <p class="txt_service">
            서비스 제공을 위해서 필요한 최소한의 개인정보입니다. 동의를 해 주셔야 서비스를 이용하실 수 있으며, 동의하지 않으실 경우 서비스에 제한이 있을 수 있습니다.
          </p>
        </div>
        <div class="terms-modal-actions">
          <button @click="close">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#terms-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.terms-modal-body {
  background-color: white;
  width: 440px;
  max-height: 80vh;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.terms_title {
    font-size: 18px;
    font-weight: 400;
    padding: 30px;
}

.tit_main {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 8px;
}

.scroll_wrapper {
    padding: 0 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px; 
}

thead th, tbody td {
  border: 1px solid #ddd; 
  padding: 8px;
  text-align: center;
}

thead th {
  background-color: #f4f4f4;
}

.emph {
  font-weight: 500;
}

.txt_service {
  font-size: 14px;
  margin-top: 15px;
  color: #666;
}

.terms-modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  height: 56px;
  border-top: 0.5px solid #f7f7f7;
}

.terms-modal-actions button {
  cursor: pointer;
  border: none;
  background-color: unset;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
}
</style>
