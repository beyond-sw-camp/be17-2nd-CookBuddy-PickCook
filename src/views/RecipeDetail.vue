<script setup>
import RecipeStep from '@/components/RecipeStep.vue'
import RelatedProducts from './RelatedProducts.vue'
import RecipeComment from '@/components/RecipeComment.vue'
import api from '@/api/recipe'
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const uploadedImage = ref('')
const newComment = ref('')
const activeReplyId = ref(null)

const refreshComments = () => {
  getComments()
}

const recipe = reactive({
  title: '',
  description: '',
  cooking_method: '',
  category: '',
  time_taken: '',
  difficulty_level: '',
  serving_size: '',
  hashtags: '',
  tip: '',
  image_small_url: null,
  image_large_url: null,
  ingredients: [],
  steps: [],
  comments: [],
})

const getComments = async () => {
  const recipeId = route.params.id
  const data = await api.getComments(recipeId)
  if (data.success && data.results) {
    recipe.comments = data.results
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  await api.addComment({
    content: newComment.value,
    recipeId: route.params.id,
    parentCommentId: null,
    imageUrl: uploadedImage.value || null,
  })
  newComment.value = ''
  uploadedImage.value = ''
  getComments()
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
      // 1️⃣ Presigned URL 발급
      const data = await api.getPresignedUrl(formData)
      if (!data.success) {
        console.error('Presigned URL 발급 실패')
        return
      }

      const presignedUrl = data.results

      // 2️⃣ 실제 업로드
      await api.uploadImage(presignedUrl, file)

      // 3️⃣ 화면에 표시될 경로 (기존 이미지 교체)
      uploadedImage.value = presignedUrl.split('?')[0]
    } catch (err) {
      console.error('이미지 업로드 실패:', err)
    }
  }
}

// 문자열 재료를 객체 배열로 변환
const parseIngredientString = (rawStr) => {
  if (!rawStr) return []

  const ingredients = []
  let buffer = ''
  let inParen = false

  for (let i = 0; i < rawStr.length; i++) {
    const char = rawStr[i]
    buffer += char

    if (char === '(') inParen = true
    if (char === ')') {
      inParen = false
      // 괄호 닫힌 후 다음이 공백이면 한 덩어리 완성
      if (rawStr[i + 1] === ' ' || i + 1 === rawStr.length) {
        // ingredient_name: 괄호 전까지
        const match = buffer.match(/^([^(]+)\(([^)]+)\)/)
        if (match) {
          ingredients.push({
            ingredient_name: match[1].trim(),
            quantity: match[2].trim(),
            isMainIngredient: true, // 기본값
          })
        }
        buffer = ''
        i++ // 공백 스킵
      }
    }
  }

  // 혹시 마지막에 남은 텍스트 처리
  if (buffer.trim()) {
    ingredients.push({
      ingredient_name: buffer.trim(),
      quantity: '',
      isMainIngredient: true,
    })
  }

  return ingredients
}

// 재료 데이터 처리 (배열/문자열 두 경우 처리)
const processIngredients = (rawIngredients) => {
  if (!rawIngredients) return []

  // 배열이면
  if (Array.isArray(rawIngredients)) {
    // 배열 안에 문자열이 합쳐진 하나의 ingredient가 있으면 분리
    if (
      rawIngredients.length === 1 &&
      rawIngredients[0].quantity === '' &&
      rawIngredients[0].isMainIngredient
    ) {
      return parseIngredientString(rawIngredients[0].ingredient_name)
    } else {
      // 일반 배열이면 그대로 반환
      return rawIngredients
    }
  }

  // 문자열이면 분리
  if (typeof rawIngredients === 'string') {
    return parseIngredientString(rawIngredients)
  }

  return []
}

// 주재료 / 양념 분리
const mainIngredients = computed(() => recipe.ingredients.filter((i) => i.isMainIngredient))
const seasoningIngredients = computed(() => recipe.ingredients.filter((i) => !i.isMainIngredient))

// RelatedProducts에 넘겨줄 매치 재료 계산
const matchedIngredient = computed(() => {
  if (!recipe.ingredients || !recipe.ingredients.length) return ''
  // 첫 번째 주재료 이름
  const firstMain = recipe.ingredients.find((i) => i.isMainIngredient)
  return firstMain ? firstMain.ingredient_name : ''
})

// 레시피 정보 가져오기
const getRecipe = async () => {
  const id = route.params.id
  const data = await api.getRecipe(id)
  if (data) {
    recipe.title = data.title
    recipe.description = data.description
    recipe.cooking_method = data.cooking_method
    recipe.category = data.category
    recipe.time_taken = data.time_taken
    recipe.difficulty_level = data.difficulty_level
    recipe.serving_size = data.serving_size
    recipe.hashtags = data.hashtags
    recipe.tip = data.tip
    recipe.image_small_url = data.image_small_url
    recipe.image_large_url = data.image_large_url
    recipe.steps = data.steps
    // 재료 처리
    recipe.ingredients = processIngredients(data.ingredients)
  }
}

onMounted(async () => {
  await getRecipe()
  await getComments()
})
</script>

<template>
  <div class="rd-container">
    <section class="recipe-image">
      <img :src="recipe.image_large_url || '/assets/images/no-image.png'" alt="레시피 이미지" />
      <h2 class="recipe-title">{{ recipe.title }}</h2>
      <p class="recipe-description">{{ recipe.description }}</p>
      <div class="recipe-detaile-serving-time-level">
        <span v-if="recipe.time_taken">
          <img src="/assets/icons/ic-time.png" alt="소요시간" />
          {{ recipe.time_taken }}
        </span>
        <span v-if="recipe.difficulty_level">
          <img src="/assets/icons/ic-level.png" alt="난이도" />
          {{ recipe.difficulty_level }}
        </span>
        <span v-if="recipe.serving_size">
          <img src="/assets/icons/ic-qnt.png" alt="인분" />
          {{ recipe.serving_size }}
        </span>
      </div>
    </section>

    <section class="rd-ingredients-section">
      <div class="rd-ingredients-group" v-if="mainIngredients.length">
        <h3>[주재료]</h3>
        <table class="rd-ingredients-table">
          <tbody>
            <tr v-for="(item, i) in mainIngredients" :key="'main-' + i">
              <td class="rd-td">{{ item.ingredient_name }}</td>
              <td class="rd-td">{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rd-ingredients-group" v-if="seasoningIngredients.length">
        <h3>[양념]</h3>
        <table class="rd-ingredients-table">
          <tbody>
            <tr v-for="(item, i) in seasoningIngredients" :key="'seasoning-' + i">
              <td class="rd-td">{{ item.ingredient_name }}</td>
              <td class="rd-td">{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <RelatedProducts
      :recipe-id="Number(route.params.id)"
      :title="recipe.title"
      :matched-ingredient="matchedIngredient"
    />

    <section class="recipe-steps">
      <h2>요리 순서</h2>
      <RecipeStep
        v-for="(step, i) in recipe.steps"
        :key="i"
        :stepNumber="step.step_order"
        :text="step.description"
        :image="step.image_url"
      />
    </section>

    <section class="recipe-comments">
      <h2>댓글</h2>
      <div class="rd-comment-form">
        <div class="new-comment-input-wrapper">
          <textarea
            v-model="newComment"
            placeholder="칭찬과 격려의 댓글은 작성자에게 큰 힘이 됩니다 :)"
            class="comment-input"
          ></textarea>

          <img
            :src="uploadedImage || '/assets/icons/ic-photo.png'"
            alt="new comment image"
            class="rd-image-placeholder"
            @click="showImageUI"
          />
        </div>
        <button @click="submitComment" class="comment-submit-btn">댓글 작성</button>
      </div>
      <div v-if="recipe.comments.length === 0">등록된 댓글이 없습니다.</div>
      <RecipeComment
        v-for="comment in recipe.comments"
        :key="comment.id"
        :comment="comment"
        :recipeId="route.params.id"
        :replyId="activeReplyId"
        @toggle-reply="(id) => (activeReplyId = id)"
        @refresh-comments="refreshComments"
      />
    </section>
  </div>
</template>

<style scoped>
.rd-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.rd-container section {
  padding: 35px 30px;
  background-color: white;
  border-radius: 10px;
}
.recipe-title {
  padding: 20px 0 10px;
  font-size: 20px;
}
.recipe-image {
  text-align: center;
  margin-bottom: 40px;
}
.recipe-image img {
  width: 60%;
  border-radius: 8px;
}

.recipe-detaile-serving-time-level {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

.recipe-detaile-serving-time-level > span {
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--color-dark-strong);
  font-size: 15px;
}

.recipe-detaile-serving-time-level img {
  width: 20px;
}

.rd-ingredients-section {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.rd-ingredients-group {
  flex: 1 1 48%;
}

.rd-ingredients-group h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #212121;
  font-weight: 500;
}

.rd-ingredients-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.rd-ingredients-table .rd-td {
  border-bottom: 1px solid #eee;
  padding: 12px 20px; /* 좌우 여백 넉넉하게 */
  font-size: 0.95rem;
}

.rd-ingredients-table td:nth-child(1) {
  text-align: left;
  width: 60%;
  padding-left: 24px; /* 왼쪽 여백 */
}

.rd-ingredients-table td:nth-child(2) {
  text-align: right;
  width: 40%;
  padding-right: 24px; /* 오른쪽 여백 */
}

.recipe-comments {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rd-comment-form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 30px;
}

.new-comment-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.recipe-description {
  margin-bottom: 50px;
}

.comment-input {
  flex-grow: 1;
  width: 100%;
  height: 120px;
  resize: none;
  font-family: inherit;
  padding: 10px;
  border: 1px solid #bcbbbd;
  border-radius: 5px;
}

.comment-input::placeholder {
  color: #ececec;
}

.comment-input:focus {
  outline: none;
}

.rd-image-placeholder {
  height: 8rem;
  width: 120px;
  height: 120px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid #bcbbbd;
}

.comment-submit-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: var(--color-primary);
  cursor: pointer;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
