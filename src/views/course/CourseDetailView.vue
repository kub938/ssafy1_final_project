<template>
  <div class="min-h-screen bg-gray-100">
    <CourseGptGuide :course-id="route.params.id"></CourseGptGuide>
    <Header />
    <main class="relative">
      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-400"></div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="text-rose-500 text-center py-8">
        {{ error }}
      </div>

      <!-- 코스 상세 정보 -->
      <div v-else-if="courseDetail" class="pb-24">
        <!-- 코스 헤더 정보 -->
        <div class="px-4 py-3 bg-white">
          <div class="flex items-center mb-2">
            <span class="px-2 py-1 bg-rose-100 text-rose-500 rounded-full text-sm font-medium"
              >코스</span
            >
          </div>
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h1 class="text-xl font-bold mb-1">{{ courseDetail.title }}</h1>
              <div class="flex items-center text-gray-500 text-sm">
                <span>{{ courseDetail.location }}</span>
              </div>
            </div>
            <CourseActionButton
              :course-id="courseDetail.id"
              :initial-status="courseDetail.status"
              @status-change="handleStatusChange"
            />
          </div>

          <p class="mt-4 text-gray-600 text-sm leading-relaxed">
            {{ courseDetail.description }}
          </p>
        </div>

        <!-- 코스 맵 -->
        <div class="relative">
          <CourseMap
            :places="courseDetail.places"
            :selected-place="selectedPlace"
            @place-select="handlePlaceSelect"
          />
        </div>

        <!-- 장소 목록 -->
        <!-- 장소 목록 부분을 수정 -->
        <div class="px-4 py-6 bg-white">
          <h2 class="text-lg font-bold mb-4">방문 장소</h2>
          <div class="overflow-x-auto pb-4" style="scrollbar-width: thin">
            <div class="flex space-x-4 min-w-max">
              <div
                v-for="(place, index) in courseDetail.places"
                :key="place.id"
                @click="handlePlaceSelect(place)"
                class="relative flex-none w-48 rounded-lg overflow-hidden cursor-pointer group"
              >
                <div class="relative h-32">
                  <img :src="place.imageUrl" class="w-full h-full object-cover" alt="" />
                  <!-- 순서 표시 -->
                  <div class="absolute top-2 left-2 bg-white/80 px-2 rounded-full text-sm">
                    {{ index + 1 }}
                  </div>
                  <!-- 인증 완료 뱃지 -->
                  <div
                    v-if="place.verified || place.isCompleted"
                    class="absolute top-2 right-2 bg-[#f64138] text-white p-1 rounded-full shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div class="p-3 bg-gray-50 group-hover:bg-gray-100">
                  <h3 class="font-medium text-gray-900 mb-1">{{ place.name }}</h3>
                  <p class="text-sm text-gray-500 truncate">{{ place.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 장소 상세 정보 모달 -->
        <!--  -->

        <CoursePlaceDetail
          v-if="selectedPlace"
          :verified="courseDetail.status"
          :place="selectedPlace"
          :course-id="courseDetail.id"
          @close="selectedPlace = null"
          @stamp-complete="handleStampComplete"
        />

        <!-- 성공 팝업 모달 -->
        <SuccessModal
          v-if="showSuccessModal"
          :message="successMessage"
          @close="showSuccessModal = false"
        />
      </div>
    </main>
    <!-- 하단 고정 버튼 -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
      <!-- 이미 완료된 코스인 경우 -->
      <button
        v-if="courseDetail?.status === 'COMPLETED'"
        disabled
        class="w-full py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
      >
        코스 완료
      </button>

      <!-- 모든 장소를 인증하여 완주가 가능한 경우 -->
      <button
        v-else-if="courseDetail?.canFinish"
        class="w-full py-3 bg-[#f64138] hover:bg-[#e4b0b0] text-white rounded-lg font-medium transition-colors"
        @click="handleCourseComplete"
      >
        코스 완주 확인
      </button>

      <!-- 진행 중이지만 아직 모든 장소를 인증하지 않은 경우 -->
      <button
        v-else-if="courseDetail?.status === 'IN_PROGRESS' && !courseDetail?.canFinish"
        disabled
        class="w-full py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
      >
        아직 인증하지 않은 지역이 있습니다
      </button>

      <!-- 코스를 시작하지 않은 경우 -->
      <button
        v-else
        disabled
        class="w-full py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
      >
        코스를 시작해주세요
      </button>
    </div>
    <div
      v-if="showScore"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-8 w-full max-w-sm mx-4 text-center">
        <div class="space-y-4">
          <div class="text-2xl font-bold text-green-600">🎉 축하합니다!</div>
          <div class="text-xl font-semibold">코스를 완료했습니다!</div>
          <div class="text-lg">
            획득한 점수: <span class="font-bold text-rose-500">{{ gainedScore }}</span> 점
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar styles */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #e4b0b0;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #fe6363;
  color: #f64138;
}
</style>

<script setup>
import axios from 'axios'

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Header from '@/components/layout/Header.vue'
import CourseMap from '@/components/course/CourseMap.vue'
import CoursePlaceDetail from '@/components/course/CoursePlaceDetail.vue'
import CourseActionButton from '@/components/course/CourseActionButton.vue'
import SuccessModal from '@/components/common/SuccessModal.vue'
import { useCourseStore } from '@/stores/courseStore'
import CourseGptGuide from '@/components/course/CourseGptGuide.vue'

const route = useRoute()
const courseStore = useCourseStore()
const { courseDetail, loading, error } = storeToRefs(courseStore) // storeToRefs 추가
const selectedPlace = ref(null)
const showSuccessModal = ref(false)
const successMessage = ref('')
const isLoading = ref(false)
const showScore = ref(false) // 점수 모달 표시용
const gainedScore = ref(0)

// 코스 상태 computed 속성
const courseState = computed(() => {
  if (!courseDetail.value) return null

  return {
    isCompleted: courseDetail.value.status === 'COMPLETED',
    isInProgress: courseDetail.value.status === 'IN_PROGRESS',
    canFinish: courseDetail.value.canFinish,
    allPlacesVerified: courseDetail.value.places?.every((place) => place.verified),
  }
})

// 장소 선택 핸들러
const handlePlaceSelect = (place) => {
  selectedPlace.value = place
}

// 스탬프 완료 핸들러
const handleStampComplete = (placeId) => {
  const place = courseDetail.value.places.find((p) => p.id === placeId)
  if (place) {
    place.isCompleted = true
  }

  showSuccessModal.value = true
  successMessage.value = '코스 인증이 완료되었습니다!'

  setTimeout(() => {
    showSuccessModal.value = false
  }, 3000)
}

// 코스 상태 변경 핸들러
const handleStatusChange = (newStatus) => {
  console.log('newStatus', newStatus)
  courseDetail.value.status = newStatus
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  try {
    await courseStore.fetchCourseDetail(route.params.id)
    console.log()
  } catch (err) {
    console.error('Failed to fetch course detail:', err)
  }
})

// 코스 완주 처리 핸들러

// const completeCourse = async () => {
//   if (!isAllPlacesVerified.value) {
//     showError.value = true
//     errorMessage.value = '모든 장소의 인증이 필요합니다'
//     return
//   }

//   try {
//     isLoading.value = true
//     showError.value = false
//     errorMessage.value = ''

//     const response = await axios.post(
//       `https://tripggukgguk.site/api/courses/${route.params.id}/finish`,
//       {},
//       {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     )
//     console.log(response.data)
//     if (response.data.data.success) {
//       gainedScore.value = response.data.data.gainedScore
//       isAlreadyCompleted.value = true
//     } else {
//       showError.value = true
//       errorMessage.value = '아직 완료되지 않은 코스가 있습니다'
//     }
//   } catch (error) {
//     showError.value = true
//     errorMessage.value = error.response?.data?.message || '아직 완료되지 않은 코스가 있습니다'
//     console.error('코스 완료 처리 중 에러 발생:', error)
//   } finally {
//     isLoading.value = false
//   }
// }

const handleCourseComplete = async () => {
  try {
    if (!courseDetail.value?.canFinish) return

    isLoading.value = true

    const response = await axios.post(
      `https://tripggukgguk.site/api/courses/${route.params.id}/finish`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('API Response:', response.data) // 응답 데이터 확인

    // response.data.data.gainedScore가 있는지 확인
    if (
      response.data.success &&
      response.data.data &&
      response.data.data.gainedScore !== undefined
    ) {
      // 점수 저장
      gainedScore.value = response.data.data.gainedScore

      // 성공 시 축하 모달 표시
      showSuccessModal.value = true
      showScore.value = true

      successMessage.value = `🎉 축하합니다! 코스를 완료했습니다!\n획득한 점수: ${gainedScore.value}점`

      // 상태 업데이트
      courseDetail.value.status = 'COMPLETED'

      // 3초 후 모달 닫고 페이지 새로고침
      setTimeout(() => {
        showSuccessModal.value = false
        showScore.value = false

        window.location.reload()
      }, 3000)
    } else {
      // 실패 시 처리
      showSuccessModal.value = true
      successMessage.value = response.data.message || '아직 완료되지 않은 코스가 있습니다.'
      setTimeout(() => {
        showSuccessModal.value = false
      }, 3000)
    }
  } catch (error) {
    // 에러 처리
    showSuccessModal.value = true
    successMessage.value = error.response?.data?.message || '코스 완료 처리 중 오류가 발생했습니다.'
    setTimeout(() => {
      showSuccessModal.value = false
    }, 3000)
    console.error('코스 완주 처리 중 에러:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
