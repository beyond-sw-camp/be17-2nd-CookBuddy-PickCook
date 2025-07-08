<script setup>
import RecipeStep from '@/components/RecipeStep.vue'
import RelatedProducts from './RelatedProducts.vue'
import api from '@/api/recipe'
import { onMounted, ref, reactive } from 'vue'

const recipeSteps = ref([])
const recipe = reactive({
  title: '',
  time: '',
  difficulty: '',
  thumbnail: '',
  ingredients: {
    main: [],
    seasoning: [],
  },
  steps: [],
})

const getRecipe = async () => {
  const data = await api.getRecipe()
  if (data) {
    Object.assign(recipe, data)
  }
}

onMounted(() => {
  getRecipe()
})
</script>

<template>
  <div class="rd-container">
    <section class="recipe-image">
      <img
        src="http://www.nongsaro.go.kr/cms_contents/855/99674_MF_BIMG_01.jpg"
        alt="레시피 이미지"
      />
      <h2 class="recipe-title">{{ recipe.title }}</h2>
      <p class="recipe-description">{{ recipe.description }}</p>
      <div>
        <span>⏱️ {{ recipe.time }}</span>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <span>👤 {{ recipe.difficulty }}</span>
      </div>
    </section>

    <section class="rd-ingredients-section">
      <div class="rd-ingredients-group">
        <h3>[주재료]</h3>
        <table class="rd-ingredients-table">
          <tbody>
            <tr v-for="(item, i) in recipe.ingredients.main" :key="'main-' + i">
              <td class="rd-td">{{ item.name }}</td>
              <td class="rd-td">{{ item.amount }}</td>
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

    <RelatedProducts title="찹쌀전병을 품은 삼색밀쌈" />

    <section class="recipe-steps">
      <h2>요리 순서</h2>
      <RecipeStep
        v-for="(step, i) in recipe.steps"
        :key="i"
        :stepNumber="step.stepNumber"
        :text="step.text"
        :image="step.image"
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
  padding: 24px;
  background-color: white;
  border-radius: 10px;
}
.recipe-title {
  padding: 12px;
}
.recipe-image {
  text-align: center;
  margin-bottom: 40px;
}
.recipe-image img {
  width: 60%;
  border-radius: 8px;
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
  font-size: 1.1rem;
  font-weight: bold;
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
</style>
