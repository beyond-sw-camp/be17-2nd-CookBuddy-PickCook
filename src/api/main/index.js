import api from '@/plugins/axiosinterceptor'

const recipeList = async () => {
  let data = {}
  let url = 'api/recipe?page=0&size=4'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results.content
    })
    .catch((error) => {
      data = error.data.results
    })

  return data
}

const communityList = async () => {
  let data = {}

  let url = '/api/community_home.json'


  await api
    .get(url)
    .then((res) => {
      data = res.data.results.content
    })
    .catch((error) => {
      data = error.data.results
    })

  return data
}

const productList = async () => {
  let data = {}
  let url = '/api/products?page=0&size=4&sort=id&dir=ASC'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results.content
    })
    .catch((error) => {
      data = error.data.results
    })

  return data
}

export default { recipeList, communityList, productList }
