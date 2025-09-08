<script setup>
import RecipeStep from '@/components/RecipeStep.vue'
import RelatedProducts from './RelatedProducts.vue'
import RecipeComment from '@/components/RecipeComment.vue'
import api from '@/api/recipe'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const recipe = reactive({
  title: '',
  time_taken: '',
  difficulty_level: '',
  serving_size: '',
  thumbnail: '',
  ingredients: {
    main: [],
    seasoning: [],
  },
  steps: [],
  comments: [],
})

const newComment = ref('')
const newCommentImage = ref(null)
const newCommentImagePreview = ref(null)
const fileInput = ref(null)
const activeReplyId = ref(null)

// 레시피 정보 가져오기
const getRecipe = async () => {
  const id = route.params.id
  const data = await api.getRecipe(id)
  if (data) Object.assign(recipe, data)
}

// 레시피 댓글 가져오기
const getComments = async () => {
  const id = route.params.id
  const data = await api.getRecipeComments(id)
  if (data.success) recipe.comments = data.results
}

// 댓글 새로고침
const refreshComments = async () => {
  await getComments()
  activeReplyId.value = null
}

const updateNewCommentImage = (e) => {
  newCommentImage.value = e.target.files[0]
  newCommentImagePreview.value = URL.createObjectURL(newCommentImage.value)
}

// 최상위 댓글 등록
const submitComment = async () => {
  if (!newComment.value.trim() && !newCommentImage.value) return

  const formData = new FormData()
  const requestData = {
    content: newComment.value,
    recipeId: route.params.id,
  }
  formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }))

  if (newCommentImage.value) formData.append('image', newCommentImage.value)

  const data = await api.addRecipeComment(formData)
  if (data.success) {
    newComment.value = ''
    newCommentImage.value = null
    newCommentImagePreview.value = null
    await refreshComments()
  }
}

// 페이지 로드 시 데이터 불러오기
onMounted(async () => {
  await getRecipe()
  await getComments()
})
</script>

<template>
  <div class="rd-container">
    <section class="recipe-image">
      <img :src="recipe.image_large_url" alt="레시피 이미지" />
      <h2 class="recipe-title">{{ recipe.title }}</h2>
      <p class="recipe-description">{{ recipe.description }}</p>
      <div class="recipe-detaile-serving-time-level">
        <span><img src="/assets/icons/ic-time.png" alt="소요시간"/> {{ recipe.time_taken }}</span>
        <span><img src="/assets/icons/ic-level.png" alt="난이도"/> {{ recipe.difficulty_level }}</span>
        <span><img src="/assets/icons/ic-qnt.png" alt="인분"/> {{ recipe.serving_size }}</span>
      </div>
    </section>

    <section class="rd-ingredients-section">
      <div class="rd-ingredients-group">
        <h3>[주재료]</h3>
        <table class="rd-ingredients-table">
          <tbody>
            <tr v-for="(item, i) in recipe.ingredients" :key="'main-' + i">
              <td class="rd-td">{{ item.ingredient_name }}</td>
              <td class="rd-td">{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="rd-ingredients-group">
        <h3>[양념]</h3>
        <table class="rd-ingredients-table">
          <tbody>
            <tr v-for="(item, i) in recipe.ingredients.seasoning" :key="'seasoning-' + i">
              <td class="rd-td">{{ item.name }}</td>
              <td class="rd-td">{{ item.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <RelatedProducts :recipe-id="Number(route.params.id)" :title="recipe.title" />

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
            :src="newCommentImagePreview || '/assets/icons/ic-photo.png'"
            alt="new comment image"
            class="rd-image-placeholder"
            @click="fileInput.click()"
          />
          <input
            type="file"
            accept="image/*"
            style="display: none"
            :ref="(el) => (fileInput = el)"
            @change="updateNewCommentImage($event)"
          />
        </div>
        <button @click="submitComment" class="comment-submit-btn">댓글 작성</button>
      </div>
      <div v-if="recipe.comments.length === 0">등록된 댓글이 없습니다.</div>
      <RecipeComment
        v-for="comment in recipe.comments"
        :key="comment.id"
        :comment="comment"
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
  padding: 12px 0 36px;
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
}

.new-comment-input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.comment-input {
  flex-grow: 1;
  width: 100%;
  height: 6rem;
  resize: none;
  font-family: inherit;
  padding: 10px;
  border: 1px solid #bcbbbd;
  border-radius: 4px;
}

.comment-input::placeholder {
  color: #ececec;
}

.comment-input:focus {
  outline: none;
}

.rd-image-placeholder {
  height: 8rem;
}

.comment-submit-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: var(--color-primary);
  align-self: right;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
