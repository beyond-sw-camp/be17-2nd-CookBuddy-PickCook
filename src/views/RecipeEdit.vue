<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/recipe'
import { useRouter, useRoute } from 'vue-router'
import CustomDropdown from '@/components/CustomDropdown.vue'

const router = useRouter()
const route = useRoute()
const recipeId = route.params.recipeId

// 기본 데이터 구조
const recipe = ref({
  coverImage: null, // 새로 업로드한 이미지 파일
  title: '',
  description: '',
  category: '',
  method: '',
  ingredients: [{ name: '', amount: '', type: '주재료' }],
  steps: [{ description: '', image: null, preview: null }],
  tip: '',
  hashtags: '',
  time_taken: '',
  serving_size: '',
  difficulty_level: '',
})

// 커버 이미지 미리보기 & 업로드 ref
const coverPreview = ref(null)
const coverInput = ref(null)

// step별 file input refs
const fileInputs = ref([])

// 드롭다운 옵션
const categories = [
  '밥','죽/스프','국/찌개','탕/전골','반찬','무침','전/부침','샐러드',
  '면 요리','빵/과자','디저트','음료','소스/양념','기타'
]
const methods = [
  '볶음','찜','구이','튀김','조림','무침','삶기','전자레인지 조리','에어프라이기 조리','기타'
]
const times = ['5분','10분','20분','30분','40분','50분','1시간','2시간','3시간+']
const servings = ['1인분','2인분','3인분+']
const difficulties = ['어려움','보통','쉬움']
const ingredientType = ['주재료','양념']

// 커버 파일 선택
const triggerCoverSelect = () => {
  coverInput.value.click()
}

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    recipe.value.coverImage = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

// 재료 추가/삭제
const addIngredient = () => {
  recipe.value.ingredients.push({ name: '', amount: '', type: '주재료' })
}
const removeIngredient = (index) => {
  recipe.value.ingredients.splice(index, 1)
}

// 단계 추가/삭제
const addStep = () => {
  recipe.value.steps.push({ description: '', image: null, preview: null })
}
const removeStep = (index) => {
  recipe.value.steps.splice(index, 1)
}

// step 이미지 업로드
const handleImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    recipe.value.steps[index].image = file
    recipe.value.steps[index].preview = URL.createObjectURL(file)
  }
}

const submitRecipe = async () => {
  try {
    if (!recipe.value.title?.trim()) return alert('레시피 제목을 입력해주세요.')
    if (!recipe.value.steps.length || !recipe.value.steps.some(s => s.description?.trim())) return alert('조리 단계를 최소 1개 이상 입력해주세요.')
    if (!recipe.value.ingredients.length) return alert('재료를 최소 1개 이상 입력해주세요.')

    // DTO 생성
    const recipeDto = {
      title: recipe.value.title,
      description: recipe.value.description,
      cooking_method: recipe.value.method,
      category: recipe.value.category,
      serving_size: recipe.value.serving_size,
      time_taken: recipe.value.time_taken,
      difficulty_level: recipe.value.difficulty_level,
      hashtags: recipe.value.hashtags,
      tip: recipe.value.tip,
      steps: recipe.value.steps.map((s, idx) => ({ stepNumber: idx + 1, description: s.description })),
      ingredients: recipe.value.ingredients.map(i => ({ ingredient_name: i.name, quantity: i.amount, isMainIngredient: i.type === '주재료' })),
      nutrition: null,
    }

    // FormData 생성
    const formData = new FormData()
    formData.append('recipe', new Blob([JSON.stringify(recipeDto)], { type: 'application/json' }))

    // 커버 이미지 (small, large)
    const emptyFile = new Blob([], { type: 'application/octet-stream' })
    formData.append('files', recipe.value.coverImage || emptyFile) // small
    formData.append('files', recipe.value.coverImage || emptyFile) // large

    // step 이미지
    recipe.value.steps.forEach(s => formData.append('files', s.image || emptyFile))

    // PUT 요청
    await api.recipeUpload(recipeId, formData)

    alert('레시피가 성공적으로 수정되었습니다.')
    router.replace('/recipe')
  } catch (error) {
    console.error('레시피 수정 실패:', error)
    if (error.response) alert(`수정 실패: ${error.response.data?.message || error.response.statusText}`)
    else if (error.request) alert('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.')
    else alert(`알 수 없는 오류: ${error.message}`)
  }
}


// 페이지 로딩 시 기존 레시피 데이터 불러오기
onMounted(async () => {
  const data = await api.getRecipe(recipeId)  

  if (!data) {
    alert('레시피 데이터를 불러오는 데 실패했습니다.')
    router.back()
    return
  }

  // 기본 정보 세팅
  recipe.value.title = data.title || ''
  recipe.value.description = data.description || ''
  recipe.value.category = data.category || ''
  recipe.value.method = data.cooking_method || ''
  recipe.value.time_taken = data.time_taken || ''
  recipe.value.serving_size = data.serving_size || ''
  recipe.value.difficulty_level = data.difficulty_level || ''
  recipe.value.hashtags = data.hashtags || ''
  recipe.value.tip = data.tip || ''

  // 커버 이미지
  coverPreview.value = data.image_large_url || null
  recipe.value.coverImage = null

  // 재료 세팅
  recipe.value.ingredients = (data.ingredients || []).map(i => ({
    name: i.ingredient_name,
    amount: i.quantity,
    type: i.isMainIngredient ? '주재료' : '양념'
  }))

  // 단계 세팅
  recipe.value.steps = (data.steps || []).map(s => ({
    description: s.description,
    image: null,
    preview: s.image_url
  }))
})
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
        <CustomDropdown :options="ingredientType" v-model="ing.type" placeholder="재료 타입" />
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
    <button @click="submitRecipe" class="upload-btn">수정 완료</button>
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

.upload-preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-preview img {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 5px;
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
  width: 108px;
  object-fit: cover;
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
