<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
})

const isModalOpen = ref(false)
const isLoading = ref(false)
const error = ref(null)
const gptData = ref(null)

const fetchGptGuide = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await axios.get(
      `https://tripggukgguk.site/api/courses/${props.courseId}/gpt`,
      {
        withCredentials: true,
      },
    )

    if (response.data.success) {
      gptData.value = response.data.data
    }
  } catch (err) {
    error.value = '가이드 정보를 불러오는데 실패했습니다.'
    console.error('GPT 가이드 로드 실패:', err)
  } finally {
    isLoading.value = false
  }
}

const toggleModal = async () => {
  if (!isModalOpen.value) {
    isModalOpen.value = true // 먼저 모달을 열고
    if (!gptData.value) {
      await fetchGptGuide() // 데이터를 가져옴
    }
  } else {
    isModalOpen.value = false
  }
}
</script>

<template>
  <!-- 고정된 봇 버튼 -->
  <div class="fixed bottom-[95px] right-4 z-50">
    <button
      @click="toggleModal"
      class="w-12 h-12 bg-[#ffffff] hover:bg-blue-100 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
      :disabled="isLoading"
    >
      <img src="/images/bot-icon.png" alt="AI 가이드" class="w-6 h-6" />
    </button>
  </div>

  <!-- GPT 가이드 모달 -->
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="isModalOpen"
      class="fixed bottom-28 right-8 z-50 w-80 bg-white rounded-lg shadow-xl overflow-hidden"
    >
      <!-- 모달 헤더 -->
      <div class="flex justify-between items-center p-4 bg-blue-500 text-white">
        <h3 class="font-semibold">여행 가이드</h3>
        <button @click="toggleModal" class="p-1 hover:bg-blue-600 rounded">
          <img src="/images/close-icon.png" alt="닫기" class="w-5 h-5" />
        </button>
      </div>

      <!-- 모달 컨텐츠 -->
      <div class="p-4 max-h-96 overflow-y-auto">
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <div
            class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"
          ></div>
          <p class="text-gray-600">여행 가이드를 불러오는 중...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          <p>{{ error }}</p>
          <button
            @click="fetchGptGuide"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            다시 시도하기
          </button>
        </div>

        <!-- 데이터 표시 -->
        <div v-else-if="gptData" class="space-y-4">
          <!-- 날씨 정보 -->
          <div class="bg-blue-50 p-3 rounded-lg">
            <h4 class="font-semibold text-blue-700 mb-1">현재 날씨</h4>
            <p class="text-sm text-blue-600">{{ gptData.weatherInfo }}</p>
          </div>

          <!-- GPT 가이드 -->
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">추천 가이드</h4>
            <div class="text-sm text-gray-600 space-y-2" v-html="gptData.gptGuide"></div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 스피너 애니메이션 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
