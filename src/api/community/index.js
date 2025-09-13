import api from '@/plugins/axiosinterceptor'
import axios from 'axios'

const getPostList = async (page, direction, keyword) => {
  let data = {}

  let url = `/api/posts/list?page=${page}&size=10&dir=${direction}&keyword=${keyword}`


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

  let url = `/api/posts/${id}`


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

  let url = '/api/comments'


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

  let url = `/api/comments?postId=${postId}`


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

  let url = '/api/like'


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

  let url = '/api/scrap'


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

  let url = '/api/image-upload'

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

const deletePost = async (postId) => {
  try {
    const res = await api.delete(`/api/posts/${postId}`)
    return res.data
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    console.error(error)
    return { success: false, message: '알 수 없는 오류 발생' }
  }
}

const postUpload = async (payload) => {
  let data = {}

  let url = `/api/posts`

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

const communityList = async () => {
  let data = {}

  let url = '/api/posts/mplist?page=0&size=4&sortType=latest&filterType=all'

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      console.error('커뮤니티 목록 조회 실패:', error)
      data = { success: false, results: { content: [] } }
    })

  return data
}

const updatePost = async (postId, payload) => {
  try {
    const res = await api.put(`/api/posts/${postId}`, payload)
    return res.data
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    console.error(error)
    return { success: false, message: '알 수 없는 오류 발생' }
  }
}

export default {
  communityList,
  getPostList,
  getPostDetail,
  addComment,
  getComments,
  like,
  scrap,
  getPresignedUrl,
  uploadImage,
  postUpload,
  updatePost,
  deletePost,
}
