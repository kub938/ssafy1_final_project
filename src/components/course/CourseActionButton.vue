<!-- components/course/CourseActionButton.vue -->
<template>
  <div>
    <!-- 도전/포기 버튼 -->
    <button
      v-if="currentStatus !== 'COMPLETED'"
      @click="handleAction"
      :disabled="isLoading"
      :class="[
        'px-4 py-2 rounded-lg font-semibold transition-colors duration-200',
        buttonStyles[currentStatus] || buttonStyles['default'],
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
      ]"
    >
      <span v-if="isLoading" class="flex items-center gap-2">
        <span
          class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        처리 중...
      </span>
      <span v-else>{{ buttonText[currentStatus] || buttonText['default'] }}</span>
    </button>

    <!-- 완료 상태 배지 -->
    <div v-else class="px-6 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-center">
      코스 완료
    </div>

    <!-- 확인 모달 -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ confirmModalTitle }}</h3>
        <p class="text-gray-600 mb-6">{{ confirmModalMessage }}</p>
        <div class="flex justify-end gap-4">
          <button
            @click="showConfirmModal = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            @click="confirmAction"
            :disabled="isLoading"
            :class="[
              'px-4 py-2 rounded-lg text-white',
              currentStatus === 'IN_PROGRESS'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600',
              isLoading ? 'opacity-50 cursor-not-allowed' : '',
            ]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // Auth 스토어 import

const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true,
  },
  initialStatus: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['status-change'])
const authStore = useAuthStore()

const currentStatus = ref(null) // 초기값을 null로 설정
const isLoading = ref(false)
const showConfirmModal = ref(false)

onMounted(() => {
  currentStatus.value = props.initialStatus || 'default'
})

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 쿠키를 포함하여 요청
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 버튼 스타일 매핑
const buttonStyles = {
  default: 'bg-[#ff4646] text-white',
  IN_PROGRESS: 'bg-[#f64949] text-white', // 'INPROGRESS' -> 'IN_PROGRESS'로 수정
  GIVEUP: 'bg-[#ff4646] text-white',
  COMPLETED: 'bg-green-100 text-green-800',
}

// 버튼 텍스트 매핑
const buttonText = {
  default: '도전하기',
  IN_PROGRESS: '포기하기', // 'INPROGRESS' -> 'IN_PROGRESS'로 수정
  GIVEUP: '다시 도전하기',
  COMPLETED: '완료',
}

// 모달 텍스트 계산
const confirmModalTitle = computed(() => {
  return currentStatus.value === 'IN_PROGRESS' ? '코스 포기하기' : '코스 도전하기'
})

const confirmModalMessage = computed(() => {
  return currentStatus.value === 'IN_PROGRESS'
    ? '정말로 이 코스를 포기하시겠습니까?'
    : '이 코스에 도전하시겠습니까?'
})

// 액션 핸들러
const handleAction = () => {
  if (!authStore.isAuthenticated) {
    // 로그인이 필요한 경우 처리
    alert('로그인이 필요한 서비스입니다.')
    // 로그인 페이지로 리다이렉트 또는 로그인 모달 표시
    return
  }
  showConfirmModal.value = true
}

// 액션 확인
const confirmAction = async () => {
  try {
    isLoading.value = true
    let response

    if (currentStatus.value === 'IN_PROGRESS') {
      console.log('Calling giveup API')
      response = await api.post(
        `/courses/${props.courseId}/giveup`,
        {},
        {
          withCredentials: true,
        },
      )
      console.log('Giveup response:', response)

      if (response.data.success) {
        currentStatus.value = 'GIVEUP'
      }
    } else {
      console.log('Calling challenge API')
      response = await api.post(
        `/courses/${props.courseId}/challenge`,
        {},
        {
          withCredentials: true,
        },
      )
      console.log('Challenge response:', response)

      if (response.data.success) {
        currentStatus.value = 'IN_PROGRESS'
      }
    }

    emit('status-change', currentStatus.value)
    showConfirmModal.value = false
  } catch (error) {
    console.error('API Error:', error)
    let errorMessage = '요청 처리 중 오류가 발생했습니다.'

    if (error.response) {
      console.log('Error response:', error.response)
      if (error.response.status === 401) {
        errorMessage = '로그인이 필요하거나 세션이 만료되었습니다.'
      } else {
        errorMessage = error.response.data.message || errorMessage
      }
    }

    alert(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 필요한 경우 추가 스타일링 */
</style>
