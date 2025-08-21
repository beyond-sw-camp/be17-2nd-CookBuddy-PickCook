<!-- 개인정보 제 3자 제공 동의 모달 -->
<script setup>
const emit = defineEmits(['close']);
const close = () => {
  emit('close');
}
</script>

<template>
  <div id="third-party-consent-modal-backdrop" @click.self="close">
    <div class="third-party-consent-modal-body">
      <div class="third-party-consent-modal-content">
        <h1 class="terms_title">개인정보 제 3자 제공 동의</h1>

        <div class="scroll_wrapper box_tbl">
          <table>
            <colgroup>
              <col width="25%">
              <col width="25%">
              <col width="25%">
              <col width="25%">
            </colgroup>
            <thead>
              <tr>
                <th>개인정보 제공 받는 자</th>
                <th>개인정보 제공 항목</th>
                <th>개인정보 제공 목적</th>
                <th>개인정보 이용 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PickCook</td>
                <td>고객관리번호, 주문번호, 수취인 정보(이름, 핸드폰번호, 배송주소, 송장번호)</td>
                <td>상품의 배송</td>
                <td>목적 달성 후 폐기</td>
              </tr>
            </tbody>
          </table>

          <p class="txt_service">
            사용자는 개인정보의 제 3자 제공에 대한 동의를 거부할 권리가 있으나, 이는 상품 배송을 제한할 수 있습니다.
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
#third-party-consent-modal-backdrop {
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

.third-party-consent-modal-body {
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

.scroll_wrapper {
    padding: 0 30px;
}

/* 테이블 스타일 */
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
