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

const likePost = async (payload) => {
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

const scrapPost = async (payload) => {
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

const getPresignedUrl = async (file) => {
  let data = {}
  let url = `/board/presigned-url`
  await api
    .post(url, {
      fileName: file.name,
      fileType: file.type,
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
  let url = `/board/create`
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
  likePost,
  scrapPost,
  getPresignedUrl,
  uploadImage,
  postUpload,
}
