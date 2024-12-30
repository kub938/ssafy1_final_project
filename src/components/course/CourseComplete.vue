<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const gainedScore = ref(0)
const showError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isAllPlacesVerified = ref(false)
const isAlreadyCompleted = ref(false)

onMounted(async () => {
  // 코스 상세 정보 조회하여 완료 여부 확인
  try {
    const response = await axios.get(`https://tripggukgguk.site/api/courses/${route.params.id}`, {
      withCredentials: true,
    })

    if (response.data.success) {
      const courseData = response.data.data
      isAlreadyCompleted.value = courseData.status === 'COMPLETED'

      // 모든 장소의 인증 여부 확인
      isAllPlacesVerified.value = courseData.places.every(
        (place) => place.isVerified || (place.canPhotoVerify ? place.isPhotoVerified : true),
      )
    }
  } catch (error) {
    console.error('코스 정보 조회 실패:', error)
  }
})

const completeCourse = async () => {
  if (!isAllPlacesVerified.value) {
    showError.value = true
    errorMessage.value = '모든 장소의 인증이 필요합니다'
    return
  }

  try {
    isLoading.value = true
    showError.value = false
    errorMessage.value = ''

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

    if (response.data.success) {
      gainedScore.value = response.data.data.gainedScore
      isAlreadyCompleted.value = true
    } else {
      showError.value = true
      errorMessage.value = '아직 완료되지 않은 코스가 있습니다'
    }
  } catch (error) {
    showError.value = true
    errorMessage.value = error.response?.data?.message || '아직 완료되지 않은 코스가 있습니다'
    console.error('코스 완료 처리 중 에러 발생:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-4 mt-8">
    <div
      class="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div v-if="gainedScore > 0" class="mb-4 p-4 bg-green-100 rounded-md text-green-700">
        <div class="text-center">
          <p class="font-semibold text-lg">🎉 축하합니다! 코스를 완료했습니다!</p>
          <p class="mt-2 text-green-600">
            획득한 점수: <span class="font-bold text-xl">{{ gainedScore }}</span
            >점
          </p>
        </div>
      </div>

      <div v-if="showError" class="mb-4 p-4 bg-red-100 rounded-md text-red-700">
        <p class="text-center">{{ errorMessage }}</p>
      </div>

      <button
        v-if="isAlreadyCompleted"
        disabled
        class="w-full py-3 px-6 text-white font-semibold rounded-lg bg-gray-500 opacity-50 cursor-not-allowed"
      >
        이미 완료된 코스입니다
      </button>
      <button
        v-else
        @click="completeCourse"
        :disabled="isLoading || !isAllPlacesVerified || gainedScore > 0"
        class="w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-blue-600 enabled:active:bg-blue-700"
        :class="{
          'bg-green-500': gainedScore > 0,
          'bg-blue-500': !gainedScore,
        }"
      >
        <template v-if="isLoading">
          <span class="inline-flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            처리중...
          </span>
        </template>
        <template v-else-if="gainedScore > 0">완료됨</template>
        <template v-else-if="!isAllPlacesVerified">모든 장소 인증이 필요합니다</template>
        <template v-else>코스 완료하기</template>
      </button>
    </div>
  </div>
</template>
