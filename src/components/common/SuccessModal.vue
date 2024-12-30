<!-- components/common/SuccessModal.vue -->
<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click="handleBackdropClick"
    >
      <!-- 배경 오버레이 -->
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <!-- 모달 컨텐츠 -->
      <div
        class="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all"
        @click.stop
      >
        <!-- 성공 아이콘 -->
        <div class="flex justify-center pt-6">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              class="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <!-- 메시지 -->
        <div class="mt-4 px-6 pb-6">
          <div class="text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
              {{ title || '성공!' }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ message }}
              </p>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="mt-5 flex justify-center">
            <button
              @click="handleClose"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
            >
              {{ buttonText || '확인' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 3000, // 3초
  },
})

const emit = defineEmits(['close'])

// 자동 닫기 타이머
let autoCloseTimer = null

// 모달이 표시될 때마다 자동 닫기 타이머 설정
watch(
  () => props.show,
  (newValue) => {
    if (newValue && props.autoClose) {
      autoCloseTimer = setTimeout(() => {
        handleClose()
      }, props.duration)
    } else {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    }
  },
)

// 배경 클릭 처리
const handleBackdropClick = () => {
  if (!props.autoClose) {
    handleClose()
  }
}

// 닫기 처리
const handleClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
  emit('close')
}

// 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>

<style scoped>
/* 트랜지션 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-from .modal-overlay,
.modal-leave-to .modal-overlay {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.9);
}
</style>
