import api from '@/plugins/axiosinterceptor'

const getIngredients = async () => {
  let data = {}
  let url = '/refrigerator.json'

  await api
    .get(url)
    .then((res) => {
      data = res.data.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

export default { getIngredients }
