<script setup>
import { ref } from 'vue'

// 기본 데이터 구조
const recipe = ref({
  coverImage: null,
  title: '',
  description: '',
  category: '',
  method: '',
  nation: '',
  ingredients: [{ name: '', amount: '' }],
  steps: [{ description: '', image: null, preview: null }],
  tip: '',
  hashtags: '',
})

const coverPreview = ref(null)
const coverInput = ref(null)
const fileInputs = ref([]) // step별 file input refs

// 커버 파일 선택 버튼 클릭
const triggerCoverSelect = () => {
  coverInput.value.click()
}

// 커버 파일 선택 시
const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    recipe.value.coverImage = file
    coverPreview.value = URL.createObjectURL(file) // 미리보기 URL 생성
  }
}

// 재료 추가/삭제
const addIngredient = () => {
  recipe.value.ingredients.push({ name: '', amount: '' })
}
const removeIngredient = (index) => {
  recipe.value.ingredients.splice(index, 1)
}

// 과정 추가/삭제
const addStep = () => {
  recipe.value.steps.push({ description: '', image: null, preview: null })
}
const removeStep = (index) => {
  recipe.value.steps.splice(index, 1)
}

// 조리 과정 이미지 업로드 핸들러
const handleImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    recipe.value.steps[index].image = file
    recipe.value.steps[index].preview = URL.createObjectURL(file)
  }
}

// 제출
const submitRecipe = () => {
  console.log('레시피 등록:', recipe.value)
}
</script>

<template>
  <div class="recipe-write">
    <!-- 썸네일 업로드 -->
    <div class="thumbnail-upload">
      <div v-if="!coverPreview" class="upload-placeholder">
        <p>
          드래그 앤 드롭이나 찾아보기 버튼으로<br />
          커버 사진을 업로드해주세요.
        </p>
        <button type="button" @click="triggerCoverSelect" class="upload-btn">
          커버 사진 업로드
        </button>
      </div>

      <!-- 미리보기 -->
      <div v-else class="upload-preview">
        <img :src="coverPreview" alt="커버 이미지" />
        <button type="button" @click="triggerCoverSelect" class="upload-btn">다른 사진 선택</button>
      </div>

      <!-- 실제 파일 input (숨김) -->
      <input
        type="file"
        accept="image/*"
        ref="coverInput"
        style="display: none"
        @change="handleCoverUpload"
      />
    </div>

    <!-- 레시피 제목 -->
    <input v-model="recipe.title" placeholder="제목을 입력해주세요." />

    <!-- 레시피 소개 -->
    <textarea
      v-model="recipe.description"
      placeholder="레시피와 관련된 소개를 작성해주세요."
    ></textarea>

    <!-- 카테고리/방법/인분 -->
    <div class="select-row">
      <select v-model="recipe.category">
        <option disabled value="">카테고리 선택</option>
        <option>한식</option>
        <option>중식</option>
        <option>양식</option>
      </select>

      <select v-model="recipe.method">
        <option disabled value="">방법 선택</option>
        <option>볶음</option>
        <option>찜</option>
        <option>구이</option>
      </select>

      <select v-model="recipe.nation">
        <option disabled value="">인분 선택</option>
        <option>1인분</option>
        <option>2인분</option>
        <option>3인분+</option>
      </select>
    </div>

    <!-- 재료 -->
    <div class="ingredients">
      <h3>레시피 재료</h3>
      <div v-for="(ing, index) in recipe.ingredients" :key="index" class="ingredient-row">
        <input v-model="ing.name" placeholder="재료명" />
        <input v-model="ing.amount" placeholder="수량" />
        <button
          @click="removeIngredient(index)"
          v-if="recipe.ingredients.length > 1"
          class="recipe-remove-btn"
        >
          -
        </button>
      </div>
      <button @click="addIngredient" class="recipe-add-btn">+ 재료 추가</button>
    </div>

    <!-- 조리 과정 -->
    <div class="steps">
      <h3>레시피 과정</h3>
      <div v-for="(step, index) in recipe.steps" :key="index" class="step-row">
        <textarea
          v-model="step.description"
          :placeholder="`Step.${index + 1}`"
          class="recipe-step-description"
        ></textarea>

        <!-- 이미지 클릭 시 파일 선택 -->
        <div class="step-image-wrapper">
          <img
            :src="step.preview || '/assets/icons/ic-photo.png'"
            alt="step image"
            @click="fileInputs[index].click()"
          />
          <input
            type="file"
            accept="image/*"
            :ref="(el) => (fileInputs[index] = el)"
            style="display: none"
            @change="handleImageUpload($event, index)"
          />
        </div>

        <button @click="removeStep(index)" v-if="recipe.steps.length > 1" class="recipe-remove-btn">
          -
        </button>
      </div>
      <button @click="addStep" class="recipe-add-btn">+ 과정 추가</button>
    </div>

    <!-- 요리 팁 -->
    <textarea v-model="recipe.tip" placeholder="요리 팁을 입력해주세요."></textarea>

    <!-- 해시태그 -->
    <input v-model="recipe.hashtags" placeholder="#해시태그" />

    <!-- 제출 버튼 -->
    <button @click="submitRecipe" class="upload-btn">레시피 등록</button>
  </div>
</template>

<style scoped>
.recipe-write {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.thumbnail-upload {
  border-radius: 8px;
  text-align: center;
  padding: 80px 20px;
}

.upload-btn {
  margin-top: 20px;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-preview img {
  max-width: 100%;
}

.select-row {
  display: flex;
  gap: 10px;
}
.ingredient-row,
.step-row {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

input,
textarea {
  padding: 6px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-family: 'Arial', sans-serif;
}

input::placeholder,
textarea::placeholder {
  color: lightgray;
}

textarea:focus {
  outline: none;
}

select {
  padding: 6px;
  border: 1px solid lightgray;
  border-radius: 4px;
  color: gray;
}

.recipe-step-description {
  flex-grow: 1;
}

.step-image-wrapper img {
  border: 1px solid lightgray;
  border-radius: 4px;
  height: 100px;
}

.recipe-remove-btn {
  height: 24px;
  width: 24px;
  align-self: center;
  border: 1px solid lightgray;
  background: white;
  color: var(--color-primary);
  border-radius: 4px;
}

.recipe-add-btn {
  padding: 6px;
  background-color: white;
  color: gray;
  border: 1px solid lightgray;
  border-radius: 4px;
}
</style>
