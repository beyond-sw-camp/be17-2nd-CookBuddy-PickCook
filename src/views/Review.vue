<script setup>
import { ref, onMounted } from 'vue'
import StarRating from '@/components/StarRating.vue'
import OderProductItemCard from '@/components/OderProductItemCard.vue'
import { useRoute, useRouter } from 'vue-router'
import orderApi from '@/api/payment'
import reviewApi from '@/api/review'

const rating = ref(0)
const route = useRoute()
const router = useRouter()
const orderProduct = ref({})
const uploadedImages = ref([])
const content = ref('')

function goBack() {
  router.back()
}

const submitReview = async () => {
  if (rating.value < 1 || rating.value > 5) {
    alert("별점은 1점부터 5점까지 선택해주세요.");
    return;
  }

  if (!content.value.trim()) {
    alert("리뷰 내용을 입력해주세요.");
    return;
  }

  const payload = {
    content: content.value,
    rating: rating.value,
    images: uploadedImages.value.map((url, index) => ({
      imageUrl: url,
      originalFilename: '', 
      contentType: '',      
      fileSize: 0,          
      imageOrder: index + 1
    }))
  };

  try {
    const orderId = route.params.orderId;
    const productId = route.params.productId;

    const res = await reviewApi.reviewWrite(orderId, productId, payload);
    alert("리뷰가 성공적으로 등록되었습니다.");
    router.back();
  } catch (err) {
    console.error('리뷰 작성 실패:', err);
  }
}

const showImageUI = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const data = await reviewApi.getPresignedUrl(formData)
      if (data.success) {
        const presignedUrl = data.results

        // 실제 업로드
        await reviewApi.uploadImage(presignedUrl, file)

        // 업로드 완료된 파일 경로 (쿼리스트링 제거)
        const imagePath = presignedUrl.split('?')[0]

        // ✅ 화면에 표시될 이미지 목록에 추가
        uploadedImages.value.push(imagePath)
      } else {
        console.error('Presigned URL 발급 실패')
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err)
    }
  }
}

onMounted(async () => {
  const productId = route.params.productId
  const orderId = route.params.orderId

  orderProduct.value = await orderApi.orderProductInfo(productId, orderId)
  console.log('받은 데이터: ', orderProduct.value)
})
</script>

<template>
  <div class="review-write-body">
    <div class="review-write-container">
      <div class="review-write-header">
        <img src="/assets/icons/ic-arrow-left.png" alt="뒤로 가기" id="no-rotate" @click="goBack" />
        <span>리뷰 작성</span>
        <div></div>
      </div>

      <div class="review-product-info-container">
        <OderProductItemCard
          v-if="orderProduct"
          :key="orderProduct.product_id"
          :order="{ orderItems: [orderProduct] }"
          :show-header="false"
          :show-buttons="false"
        />
      </div>

      <div class="product-review-rating-container">
        <h3>상품은 만족하셨나요?</h3>
        <div>
          <StarRating v-model="rating" />
          <span>{{ rating }}</span>
        </div>
      </div>

      <div class="review-write-input-box-container">
        <textarea v-model="content"></textarea>
        <div class="review-product-images-container">
          <div class="review-add-product-image-button" @click="showImageUI">
            <img src="/public/assets/icons/ic-plus.png" alt="이미지 추가" />
          </div>

          <div class="uploaded-images">
            <img
              v-for="(img, index) in uploadedImages"
              :key="index"
              :src="img"
              alt="업로드 이미지"
              class="uploaded-image"
            />
          </div>
        </div>
      </div>

      <div class="review-write-button-container">
        <button @click="submitReview" class="review-write-button">작성완료</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-write-body {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px;
}

.review-write-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  max-width: 800px;
  width: 100%;
  padding-bottom: 25px;
}

.review-write-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px;
  border-bottom: 0.5px solid #ebebeb;
}

.review-write-header > img,
.review-write-header > div {
  width: 20px;
}

.review-write-header > img {
  cursor: pointer;
}

.review-write-header > span {
  font-size: 16px;
  font-weight: 500;
}

.product-review-rating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -20px;
  border-top: 8px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
  width: 100%;
  padding: 30px 0;
}

.product-review-rating-container > h3 {
  font-size: 16px;
  font-weight: 500;
}

.product-review-rating-container > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-product-info-container {
  width: 100%;
  padding: 20px 0 0;
}

.review-write-input-box-container {
  padding: 20px 18px;
  width: 100%;
}

.review-write-input-box-container > textarea {
  width: 100%;
  height: 120px;
  border: none;
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 12px 14px;
  outline: none;
  resize: none;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;  /* 원하는 폰트 */
  font-size: 15px;
  line-height: 1.5;
  color: #333;
}

.review-write-button-container {
  width: 100%;
  padding: 40px 18px 10px;
}

.review-write-button {
  border: none;
  border-radius: 3px;
  background-color: var(--color-primary);
  width: 100%;
  padding: 10px 12px;
  color: white;
  font-size: 15px;
  cursor: pointer;
}

.review-add-product-image-button {
  border-radius: 5px;
  background-color: #e2e2e2;
  min-width: 95px;
  height: 95px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.review-add-product-image-button > img {
  width: 30px;
}

.review-product-images-container {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    margin-top: 3px;
}

.uploaded-images {
    display: flex;
    gap: 4px;
}

.uploaded-images > img {
    width: 95px;
    height: 95px;
    object-fit: cover;
    border-radius: 5px;
}
</style>
