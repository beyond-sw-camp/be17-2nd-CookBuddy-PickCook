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

  // 수정된 URL
  let url = '/api/posts/mplist?page=0&size=4&sortType=latest&filterType=all'

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