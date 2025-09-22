import api from '@/plugins/axiosinterceptor'

const recommendedRecipeList = async () => {
  let data = {}
  let url = 'api/recipe?page=0&size=6'

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

const popularRecipeList = async () => {
  let data = {}
  let url = 'api/recipe/popular'

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

  // 수정된 URL
  let url = '/api/posts/mplist?page=0&size=6&sortType=latest&filterType=all'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results.content
    })
    .catch((error) => {
      console.error('커뮤니티 목록 조회 실패:', error)
      data = [] // 에러 시 빈 배열 반환
    })

  return data
}

const specialDealsProductList = async () => {
  let data = {}
  let url = '/api/products?page=0&size=6&sort=discount_rate&dir=DESC'

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

const bestSellerList = async () => {
  let data = {}
  let url = '/api/products?page=0&size=6&sort=review_count&dir=DESC'

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

export default {
  recommendedRecipeList,
  popularRecipeList,
  communityList,
  specialDealsProductList,
  bestSellerList,
}
