import api from '@/plugins/axiosinterceptor'
import axios from 'axios'

const getPostList = async () => {
  let data = {}
  let url = '/posts'

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

const getPostDetail = async (id) => {
  let data = {}
  let url = `/posts/${id}`

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

const addComment = async (payload) => {
  let data = {}
  let url = '/comments'

  await api
    .post(url, payload)
    .then((res) => (data = res.data))
    .catch((error) => {
      data = error
    })

  return data
}

const getComments = async (postId) => {
  let data = {}
  let url = `/comments?postId=${postId}`

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

const like = async (payload) => {
  let data = {}
  let url = '/like'

  await api
    .post(url, payload)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const scrap = async (payload) => {
  let data = {}
  let url = '/scrap'

  await api
    .post(url, payload)
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
  let url = '/image-upload'
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

const uploadImage = async (presigedUrl, file) => {
  let data = {}
  await axios
    .put(presigedUrl, file, {
      headers: {
        'Content-Type': file.type,
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

const postUpload = async (payload) => {
  let data = {}
  let url = `/posts`
  await api
    .post(url, payload)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

export default {
  getPostList,
  getPostDetail,
  addComment,
  getComments,
  like,
  scrap,
  getPresignedUrl,
  uploadImage,
  postUpload,
}
