import api from '@/plugins/axiosinterceptor'

const recipeList = async (params) => {
  let data = {}

  const queryString = new URLSearchParams(params).toString()
  const url = `api/recipe?${queryString}`

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

const uploadImage = async (presigedUrl, file) => {
  let data = {}
  await api
    .put(presigedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      withCredentials: false,
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}


const addComment = async (payload) => {
  let data = {}

  let url = '/api/recipe/comment'

  await api
    .post(url, payload)
    .then((res) => (data = res.data))
    .catch((error) => {
      data = error
    })

  return data
}


const getComments = async (recipeId) => {
  let data = {}

  let url = `/api/recipe/comment?recipeId=${recipeId}`

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

const getPresignedUrl = async (formData) => {
  let data = {}

  let url = '/api/image-upload'

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
      data = error.data
    })

  return data
}

export default {
  recipeList,
  getRecipe,
  registerRecipe,
  getRecipeComments,
  addRecipeComment,
  uploadImage,
  addComment,
  getComments,
  getPresignedUrl,
}
