<!-- components/course/CoursePlaceList.vue -->
<template>
  <div class="space-y-4">
    <!-- 장소 목록을 감싸는 스크롤 컨테이너 -->
    <div class="overflow-x-auto">
      <div class="flex space-x-4 py-2">
        <div
          v-for="place in places"
          :key="place.id"
          @click="handlePlaceClick(place)"
          class="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          :class="{ 'ring-2 ring-blue-500': isSelected(place) }"
        >
          <!-- 장소 이미지 -->
          <div class="relative h-40">
            <img
              :src="place.imageUrl"
              :alt="place.name"
              class="w-full h-full object-cover rounded-t-lg"
              @error="handleImageError"
            />
            <!-- 완료 뱃지 (verified 또는 isCompleted가 true일 때) -->
            <div
              v-if="place.verified || place.isCompleted"
              class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs"
            >
              완료
            </div>
          </div>

          <!-- 장소 정보 -->
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-1">{{ place.name }}</h3>
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">
              {{ place.description }}
            </p>

            <!-- 장소 메타 정보 -->
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>{{ place.category }}</span>
              <div class="flex items-center gap-2">
                <span>{{ formatProgress(place.sequence) }}</span>
                <!-- 인증 상태 표시 추가 -->
                <span v-if="place.verified" class="text-green-500">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 스크롤 네비게이션 버튼 -->
    <div class="flex justify-center space-x-4 mt-4">
      <button
        @click="scrollLeft"
        class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        :disabled="isAtStart"
        :class="{ 'opacity-50 cursor-not-allowed': isAtStart }"
      >
        <span class="text-xl">←</span>
      </button>
      <button
        @click="scrollRight"
        class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        :disabled="isAtEnd"
        :class="{ 'opacity-50 cursor-not-allowed': isAtEnd }"
      >
        <span class="text-xl">→</span>
      </button>
    </div>

    <div class="space-y-4">
      <!-- <CoursePlaceList
        :places="places"
        :selectedPlace="selectedPlace"
        @place-select="handlePlaceSelect"
      /> -->

      <CourseCompletion />
    </div>
  </div>

  <div v-if="totalPages >= 1" class="flex justify-center mt-8">
    <div class="flex space-x-2 items-center">
      <!-- 첫 페이지 -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded-md border"
        :class="getButtonClass(currentPage === 1)"
      >
        &lt;&lt;
      </button>

      <!-- 이전 페이지 -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded-md border"
        :class="getButtonClass(currentPage === 1)"
      >
        이전
      </button>

      <!-- 페이지 번호들 -->
      <div class="flex space-x-1">
        <button
          v-for="pageNum in visiblePageNumbers"
          :key="pageNum"
          @click="goToPage(pageNum)"
          class="px-3 py-1 rounded-md"
          :class="pageNum === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'"
        >
          {{ pageNum }}
        </button>
      </div>

      <!-- 다음 페이지 -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded-md border"
        :class="getButtonClass(currentPage === totalPages)"
      >
        다음
      </button>

      <!-- 마지막 페이지 -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded-md border"
        :class="getButtonClass(currentPage === totalPages)"
      >
        &gt;&gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CoursePlaceList from '@/components/course/CoursePlaceList.vue'
import CourseCompletion from '@/components/course/CourseComplete.vue'

const props = defineProps({
  places: {
    type: Array,
    required: true,
  },
  selectedPlace: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['place-select'])

const scrollContainer = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

// 장소 클릭 핸들러
const handlePlaceClick = (place) => {
  emit('place-select', place)
}

// 장소 선택 여부 확인
const isSelected = (place) => {
  return props.selectedPlace?.id === place.id
}

// 이미지 에러 핸들러
const handleImageError = (e) => {
  e.target.src = '/assets/images/default-place.jpg' // 기본 이미지 경로로 수정해주세요
}

// 진행 순서 포맷팅
const formatProgress = (order) => {
  return `${order}번째 장소`
}

// 스크롤 컨트롤
const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }
}

// 스크롤 위치 감지
const handleScroll = () => {
  if (scrollContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
    isAtStart.value = scrollLeft <= 0
    isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 10
  }
}

// 컴포넌트 마운트 시 스크롤 이벤트 리스너 등록
onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
    // 초기 스크롤 상태 체크
    handleScroll()
  }
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
/* 스크롤바 숨기기 */
.overflow-x-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.overflow-x-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 선택된 카드 호버 효과 */
.selected {
  @apply ring-2 ring-blue-500;
}
</style>
