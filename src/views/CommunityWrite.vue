<script setup>
import { ref, computed } from 'vue'

const title = ref('')
const content = ref('')

// 제목 글자 수 카운트 (computed로 처리)
const titleLength = computed(() => title.value.length);

</script>

<template>
    <!-- 컨텐츠 섹션 -->
    <div class="content-section">
        <div class="c-content-container">
            <!-- 커버 사진 업로드 -->
            <div class="cover-upload">
                <p>
                    <strong>드래그 앤 드롭이나 추가하기 버튼으로<br>커버 사진을 업로드해주세요.</strong>
                </p>
                <button class="upload-btn">커버 사진 추가하기</button>
            </div>

            <!-- 제목 입력 -->
            <div class="title-input">
                <input type="text" v-model="title" placeholder="제목을 입력해주세요." maxlength="80" />
                <span class="char-count">{{ titleLength }}/80</span>
            </div>

            <!-- 에디터 -->
            <QuillEditor
                :toolbar="[{ header: [1, 2, 3, false] }, 'bold', 'italic', 'underline', 'link', { list: 'ordered' }, { list: 'bullet' }, 'strike', 'image']"
                v-model="content" class="quill-editor" :modules="modules" />
        </div>
    </div>

</template>

<style scoped>
.cover-upload {
    border-radius: 8px;
    text-align: center;
    padding: 80px 20px;
}

.upload-btn {
    margin-top: 20px;
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.title-input {
    margin-top: 40px;
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
    /* 오른쪽 여백 확보 */
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

::v-deep(.ql-editor) {
    min-height: 300px;
}
</style>