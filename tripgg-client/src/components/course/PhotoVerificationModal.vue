<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start sm:items-center overflow-y-auto"
  >
    <div
      class="bg-white rounded-lg w-full max-w-3xl mx-auto my-4 min-h-[calc(100vh-2rem)] sm:min-h-0 sm:max-h-[90vh] flex flex-col relative"
    >
      <!-- 헤더 - 고정 -->
      <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h3 class="text-xl font-bold">사진 인증</h3>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- 컨텐츠 - 스크롤 가능 -->
      <div class="p-4 space-y-6 overflow-y-auto flex-1">
        <!-- 예시 사진 -->
        <div class="space-y-2">
          <h4 class="font-semibold text-lg">예시 사진</h4>
          <div class="relative h-48 md:h-64 rounded-lg overflow-hidden bg-gray-100">
            <img :src="placeImageUrl" :alt="placeName" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- 안내 메시지 -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-blue-700 font-medium">{{ placeName }}</p>
          <p class="text-blue-600 mt-2">비슷한 구도로 사진을 찍어서 제출해 주세요</p>
        </div>

        <!-- 업로드된 사진 미리보기 -->
        <div v-if="previewUrl" class="space-y-2">
          <h4 class="font-semibold text-lg">내가 찍은 사진</h4>
          <div class="relative h-48 md:h-64 rounded-lg overflow-hidden bg-gray-100">
            <img :src="previewUrl" alt="미리보기" class="w-full h-full object-cover" />
            <!-- 삭제 버튼 -->
            <button
              @click="clearSelectedFile"
              class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
            >
              <span>&times;</span>
            </button>
          </div>
        </div>

        <!-- 여분의 공간 추가 -->
        <div class="h-20 sm:h-0"></div>
      </div>

      <!-- 하단 버튼 영역 - 고정 -->
      <div class="p-4 border-t bg-white sticky bottom-0 left-0 right-0 z-10">
        <div class="space-y-3">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            @change="handleFileChange"
            class="hidden"
            ref="fileInput"
          />

          <!-- 사진 선택 버튼 -->
          <button
            @click="$refs.fileInput.click()"
            class="w-full py-3 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
            :disabled="isSubmitting"
          >
            {{ previewUrl ? '다른 사진 선택하기' : '사진 선택하기' }}
          </button>

          <!-- 제출 버튼 -->
          <button
            v-if="selectedFile"
            @click="submitPhoto"
            :disabled="isSubmitting"
            class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <span
                class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></span>
              제출 중...
            </span>
            <span v-else>사진 제출하기</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true,
  },
  placeId: {
    type: [String, Number],
    required: true,
  },
  placeName: {
    type: String,
    required: true,
  },
  placeImageUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close', 'verification-success'])

const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)
const isSubmitting = ref(false)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value) // 이전 미리보기 URL 해제
    }
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const clearSelectedFile = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedFile.value = null
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = '' // input 초기화
  }
}

const submitPhoto = async () => {
  if (!selectedFile.value) return

  try {
    console.log(selectedFile.value)
    isSubmitting.value = true
    const formData = new FormData()
    formData.append('photo', selectedFile.value)
    console.log(formData)
    const response = await axios.post(
      `https://tripggukgguk.site/api/verify/photo/courses/${props.courseId}/places/${props.placeId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    if (response.data.success) {
      emit('verification-success')
      emit('close')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  } catch (error) {
    alert('사진 인증에 실패했습니다.')
    console.error('Photo submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 컴포넌트 언마운트 시 메모리 정리
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<style scoped>
/* 모바일 Safari에서 오버스크롤 방지 */
.fixed {
  -webkit-overflow-scrolling: touch;
}

/* 모바일에서 스크롤 부드럽게 */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
