import api from '@/plugins/axiosinterceptor'

const getUUID = async () => {
  let data = {}
  let url = '/order/start'

  await api
    .get(url)
    .then((res) => {
      data = res.data.results
    })
    .catch((error) => {
      data = error.data.resulsts
    })

  return data
}


export default { getUUID }
