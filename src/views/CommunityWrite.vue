<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import api from '@/api/community'
import { useRouter } from 'vue-router'

const router = useRouter()
const editorRef = ref(null)

const boardForm = reactive({
  title: '',
  content: '',
  imageList: [],
})

const titleLength = computed(() => boardForm.title.length)

const showImageUI = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const data = await api.getPresignedUrl(formData)
      if (data.success) {
        const presignedUrl = data.results
        console.log(presignedUrl)
        await api.uploadImage(presignedUrl, file)

        const imagePath = presignedUrl.split('?')[0]
        const quill = editorRef.value?.getQuill()

        quill.insertEmbed(quill.getSelection()?.index ?? 0, 'image', imagePath)
        boardForm.imageList.push(imagePath)
      } else {
        console.error('Presigned URL 발급 실패')
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err)
    }
  }
}

const handleSubmit = async () => {
  const payload = {
    title: boardForm.title,
    content: boardForm.content,
    imageList: boardForm.imageList.map(url => ({ imageUrl: url })),
  }
  await api.postUpload(payload)
  router.push('/community')
}

onMounted(() => {
  const quill = editorRef.value?.getQuill()
  if (quill) {
    quill.getModule('toolbar').addHandler('image', showImageUI)
  }
})
</script>

<template>
  <div class="content-section">
    <div class="c-content-container">
      <div class="title-input">
        <input
          type="text"
          v-model="boardForm.title"
          placeholder="제목을 입력해주세요."
          maxlength="80"
        />
        <span class="char-count">{{ titleLength }}/80</span>
      </div>

      <QuillEditor
        ref="editorRef"
        v-model:content="boardForm.content"
        contentType="html"
        class="quill-editor"
        :toolbar="[
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ]"
      />

      <button @click="handleSubmit">작성 완료</button>
    </div>
  </div>
</template>

<style scoped>
.content-section {
  padding: 20px;
}

.title-input {
  margin-bottom: 20px;
  position: relative;
}

.title-input input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  padding: 10px 0;
  padding-right: 50px;
  box-sizing: border-box;
}

.char-count {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 12px;
  color: #888;
  pointer-events: none;
}

.quill-editor {
  margin-top: 20px;
}

/* 에디터 내부 입력 공간에 높이 적용 */
::v-deep(.ql-editor) {
  min-height: 300px;
  padding: 12px;
  font-size: 16px;
  line-height: 1.6;
}
</style>
