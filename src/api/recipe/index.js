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
  try {
    const res = await api.get(`api/recipe/${id}`)
    console.log("받은 데이터 ", res)
    return res.data
  } catch (error) {
    console.error('❌ API 오류:', error)
    return error.response?.data || { success: false }
  }
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

const deleteRecipe = async (recipeId) => {
  try {
    const res = await api.delete(`/api/recipe/${recipeId}`)
    return res.data
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    console.error(error)
    return { success: false, message: '알 수 없는 오류 발생' }
  }
}

const recipeUpload = async (recipeId, formData) => {
  try {
    const res = await api.put(`/api/recipe/${recipeId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (error) {
    console.error(error)
    return error.response?.data || { success: false }
  }
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
  deleteRecipe,
  recipeUpload,
}
