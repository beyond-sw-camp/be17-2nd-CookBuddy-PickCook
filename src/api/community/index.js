import api from '@/plugins/axiosinterceptor'

const communityList = async () => {
  let data = {}
  let url = '/api/community.json'

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

const communityDetail = async (id) => {
  let data = {}
  let url = `/api/communityDetail/${id}.json`

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



export default { communityList, communityDetail }
