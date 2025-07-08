import api from '@/plugins/axiosinterceptor'

const recipeList = async () => {
  let data = {}
  let url = '/recipe.json'

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const getRecipe = async () => {
  let data = {}
  let url = '/recipes/recipe-detail.json'

  await api
    .get(url, {
      responseType: 'json',
    })
    .then((res) => {
      data = res.data.results[0]
    })
    .catch((error) => {
      console.error('❌ API 오류:', error)
      data = error.response?.data || { success: false }
    })

  return data
}

export default { recipeList, getRecipe }
