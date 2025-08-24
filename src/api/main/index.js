import api from '@/plugins/axiosinterceptor'

const recipeList = async () => {
  let data = {}
  let url = 'api/recipe'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results
    })
    .catch((error) => {
      data = error.data.results
    })

  return data
}

const communityList = async () => {
  let data = {}
  let url = '/community_home.json'

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

const productList = async () => {
  let data = {}
  let url = '/api/products/list'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results
    })
    .catch((error) => {
      data = error.data.results
    })

  return data
}

export default { recipeList, communityList, productList }
