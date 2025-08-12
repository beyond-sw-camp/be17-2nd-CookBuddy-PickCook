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

const productList1 = async () => {
  let data = {}
  let url = '/products1_home.json'

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

const productList2 = async () => {
  let data = {}
  let url = '/products2_home.json'

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

export default { recipeList, communityList, productList1, productList2 }
