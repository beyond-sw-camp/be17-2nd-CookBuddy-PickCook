import api from '@/plugins/axiosinterceptor'

const recipeList = async (page, size) => {
  let data = {}
  let url = `api/recipe?page=${page}&size=${size}`

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

const getRecipe = async (id) => {
  let data = {}
  let url = `api/recipe/${id}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      console.error('❌ API 오류:', error)
      data = error.response?.data || { success: false }
    })

  return data
}

const registerRecipe = async (payload) => {
  let data = {}
  let url = 'api/recipe/register'

  await api
    .post(url, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      console.error(error)
      data = error.response?.data || { success: false }
    })
}

const getRecipeComments = async (recipeId) => {
  let data = {}
  let url = `api/recipe/comment?recipeId=${recipeId}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.data
    })

  return data
}

const addRecipeComment = async (formData) => {
  let data = {}
  let url = 'api/recipe/comment'

  await api
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.data
    })

  return data
}

export default { recipeList, getRecipe, registerRecipe, getRecipeComments, addRecipeComment }
