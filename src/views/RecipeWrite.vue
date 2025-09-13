<script setup>
import { ref } from 'vue'
import api from '@/api/recipe'
import { useRouter } from 'vue-router'
import CustomDropdown from '@/components/CustomDropdown.vue'

const router = useRouter()

// 기본 데이터 구조
const recipe = ref({
  coverImage: null,
  title: '',
  description: '',
  category: '',
  method: '',
  ingredients: [{ name: '', amount: '' }],
  steps: [{ description: '', image: null, preview: null }],
  tip: '',
  hashtags: '',
  time_taken: '',
  serving_size: '',
  difficulty_level: '',
})

const coverPreview = ref(null)
const coverInput = ref(null)
const fileInputs = ref([]) // step별 file input refs
const categories = ['한식', '중식', '양식']
const methods = ['볶음', '찜', '구이']
const nations = ['1인분', '2인분', '3인분+']
const times = ['5분', '10분', '20분', '30분', '40분', '50분', '1시간', '2시간', '3시간+']
const servings = ['1인분', '2인분', '3인분+']
const difficulties = ['어려움', '보통', '쉬움']

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
const submitRecipe = async () => {
  if (!recipe.value.title?.trim()) {
    alert('레시피 제목을 입력해주세요.')
    return
  }
  if (!recipe.value.steps.length || !recipe.value.steps.some((s) => s.description?.trim())) {
    alert('조리 단계를 최소 1개 이상 입력해주세요.')
    return
  }
  if (!recipe.value.ingredients.length) {
    alert('재료를 최소 1개 이상 입력해주세요.')
    return
  }

  const recipeDto = {
    title: recipe.value.title,
    cooking_method: recipe.value.method,
    category: recipe.value.category,
    serving_size: recipe.value.nation,
    time_taken: recipe.value.time_taken,
    difficulty_level: recipe.value.difficulty_level,
    hashtags: recipe.value.hashtags,
    tip: recipe.value.tip,
    steps: recipe.value.steps.map((s, idx) => ({
      stepNumber: idx + 1,
      description: s.description,
      // 이미지 파일은 files 배열로 따로 보냄
    })),
    ingredients: recipe.value.ingredients.map((i) => ({
      ingredient_name: i.name, // 기존 name → ingredient_name
      quantity: i.amount, // 기존 amount → quantity
    })),
    nutrition: null, // 아직 nutrition 입력 UI가 없으니 null
  }

  // FormData 생성
  const formData = new FormData()
  formData.append('dto', new Blob([JSON.stringify(recipeDto)], { type: 'application/json' }))

  if (recipe.value.coverImage) {
    formData.append('files', recipe.value.coverImage) // small
    formData.append('files', recipe.value.coverImage) // large
  }

  recipe.value.steps.forEach((s) => {
    if (s.image) formData.append('files', s.image)
  })

  await api.registerRecipe(formData)
  router.push('/recipe')
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
    <div class="recipe-write-label-container">
      <label class="recipe-write-label">레시피 제목</label>
      <input v-model="recipe.title" placeholder="제목을 입력해주세요." />
    </div>

    <!-- 레시피 소개 -->
    <div class="recipe-write-label-container">
      <label class="recipe-write-label">레시피 소개</label>
      <textarea
        v-model="recipe.description"
        placeholder="레시피와 관련된 소개를 작성해주세요."
      ></textarea>
    </div>

    <!-- 조리시간 -->
    <div class="recipe-write-label-container">
      <label class="recipe-write-label">조리시간 / 인분 / 난이도</label>
      <div class="time-taken-and-level-and-amount">
        <!-- 조리시간 드롭다운 -->
        <CustomDropdown :options="times" v-model="recipe.time_taken" placeholder="조리시간" />

        <!-- 인분 드롭다운 -->
        <CustomDropdown :options="servings" v-model="recipe.serving_size" placeholder="인분" />

        <!-- 난이도 드롭다운 -->
        <CustomDropdown
          :options="difficulties"
          v-model="recipe.difficulty_level"
          placeholder="난이도"
        />
      </div>
    </div>

    <!-- 카테고리/방법/인분 -->
    <div class="recipe-category-and-cook-info recipe-write-label-container">
      <label class="recipe-write-label">카테고리 / 요리정보</label>
      <div class="select-row">
        <!-- 카테고리 드롭다운 -->
        <CustomDropdown
          :options="categories"
          v-model="recipe.category"
          placeholder="카테고리 선택"
        />

        <!-- 방법 드롭다운 -->
        <CustomDropdown :options="methods" v-model="recipe.method" placeholder="방법 선택" />
      </div>
    </div>

    <!-- 재료 -->
    <div class="ingredients recipe-write-label-container">
      <label class="recipe-write-label">재료 정보</label>
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
    <div class="steps recipe-write-label-container">
      <label class="recipe-write-label">요리 순서</label>
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
    <div class="recipe-write-label-container">
      <label class="recipe-write-label">요리팁 / 주의사항</label>
      <textarea v-model="recipe.tip" placeholder="요리 팁을 입력해주세요."></textarea>
    </div>

    <!-- 해시태그 -->
    <div class="recipe-write-label-container">
      <label class="recipe-write-label">해시태그</label>
      <input v-model="recipe.hashtags" placeholder="#해시태그" />
    </div>

    <!-- 제출 버튼 -->
    <button @click="submitRecipe" class="upload-btn">레시피 등록</button>
  </div>
</template>

<style scoped>
.recipe-write-label-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recipe-write-label {
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
}

.recipe-write {
  max-width: 800px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
  background-color: white;
  padding: 30px 25px 40px;
  border-radius: 10px;
}

.thumbnail-upload {
  border-radius: 8px;
  text-align: center;
  padding: 80px 20px;
  background-color: #f7f7f7;
  margin-bottom: 10px;
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

.ingredient-row,
.step-row {
  display: flex;
  gap: 10px;
}

input,
textarea {
  padding: 8px 10px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-family: 'Arial', sans-serif;
}

input::placeholder,
textarea::placeholder {
  color: lightgray;
}

textarea {
  resize: none;
  min-height: 80px;
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
  max-height: 108px;
}

.step-image-wrapper img {
  border: 1px solid lightgray;
  border-radius: 4px;
  height: 108px;
  max-width: 108px;
}

.recipe-remove-btn {
  height: 33px;
  width: 33px;
  align-self: center;
  border: 1px solid lightgray;
  background: white;
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 22px;
  padding-bottom: 3px;
  cursor: pointer;
}

.recipe-add-btn {
  padding: 8px;
  background-color: white;
  color: gray;
  border: 1px solid lightgray;
  border-radius: 4px;
  margin-top: 5px;
}

.upload-placeholder > p {
  font-size: 15px;
}

.ingredient-row > input {
  flex: 2;
}

select,
button {
  cursor: pointer;
}

.recipe-add-btn:hover {
  background-color: #f5f5f5;
}

.time-taken-and-level-and-amount {
  display: flex;
  gap: 10px;
}

.time-taken-and-level-and-amount > input {
  flex: 1;
}

.select-row {
  display: flex;
  gap: 10px;
}
</style>
