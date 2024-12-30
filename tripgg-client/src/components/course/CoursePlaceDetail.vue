<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto"
  >
    <!-- GPS 인증 모달 내용 -->
    <div
      v-if="!showPhotoVerification"
      class="bg-white rounded-lg max-w-3xl w-full mx-4 my-4 max-h-fit"
    >
      <!-- 헤더 -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-xl font-bold">{{ place.name }}</h3>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- 컨텐츠 -->
      <div class="p-4 space-y-4">
        <!-- 이미지 섹션 -->
        <div class="relative h-64 rounded-lg overflow-hidden">
          <img
            :src="place.imageUrl"
            :alt="place.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>

        <!-- 장소 정보 -->
        <div class="space-y-4">
          <!-- 기본 정보 -->
          <div>
            <h4 class="font-semibold text-lg mb-2">상세 정보</h4>
            <div class="relative">
              <p
                :class="[
                  'text-gray-600',
                  { 'line-clamp-5': !isExpanded },
                  { 'cursor-pointer': description.length > maxLength },
                ]"
                @click="toggleDescription"
              >
                {{ place.description }}
              </p>
              <button
                v-if="description.length > maxLength"
                @click="toggleDescription"
                class="text-blue-600 hover:text-blue-700 text-sm mt-1"
              >
                {{ isExpanded ? '접기' : '더보기' }}
              </button>
            </div>
          </div>

          <!-- 주소 및 메타 정보 -->
          <div class="gap-4 text-sm">
            <div>
              <p class="text-gray-500">주소</p>
              <p>{{ place.address }}</p>
            </div>
          </div>

          <!-- 방문 인증 섹션 -->
          <div class="space-y-2">
            <h4 class="font-semibold text-lg">방문 인증</h4>
            <!-- 진행 중인 경우 -->
            <div v-if="verified === 'IN_PROGRESS'">
              <button
                @click="verifyLocation"
                :disabled="isVerifying"
                class="w-full py-2 px-4 bg-[#fb5e5e] text-white rounded-lg hover:bg-[#ff4646] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {{ isVerifying ? '인증 중...' : '스탬프 찍기' }}
              </button>
            </div>

            <!-- 시작하지 않은 경우 -->

            <div
              v-else-if="
                verified === null ||
                verified === 'null' ||
                verified === 'GIVEUP' ||
                verified === 'ABANDONED'
              "
            >
              <button
                disabled
                class="w-full py-2 px-4 bg-gray-400 text-white rounded-lg cursor-not-allowed"
              >
                도전하기 버튼을 먼저 눌러주세요!
              </button>
            </div>

            <!-- 이미 완료된 경우 -->
            <div v-else-if="verified === 'COMPLETED'">
              <button
                disabled
                class="w-full py-2 px-4 bg-gray-400 text-white rounded-lg cursor-not-allowed"
              >
                이미 인증한 장소입니다!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 사진 인증 모달 -->
    <PhotoVerificationModal
      v-if="showPhotoVerification"
      :courseId="courseId"
      :placeId="place.id"
      :placeName="place.name"
      :placeImageUrl="place.imageUrl"
      @close="handlePhotoModalClose"
      @verification-success="handleVerificationSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import PhotoVerificationModal from './PhotoVerificationModal.vue'

const props = defineProps({
  verified: {
    type: String,
    required: true,
  },
  place: {
    type: Object,
    required: true,
  },
  courseId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['close', 'stamp-complete'])

const isVerifying = ref(false)
const isExpanded = ref(false)
const maxLength = 200
const showPhotoVerification = ref(false)

const description = computed(() => props.place.description || '')

const handlePhotoModalClose = () => {
  showPhotoVerification.value = false
}

const handleVerificationSuccess = () => {
  emit('stamp-complete', props.place.id)
  emit('close')
}

const toggleDescription = () => {
  if (description.value.length > maxLength) {
    isExpanded.value = !isExpanded.value
  }
}

const handleImageError = (e) => {
  e.target.src = '/assets/images/default-place.jpg'
}

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (err) => reject(err),
      { enableHighAccuracy: true },
    )
  })
}

const verifyLocation = async () => {
  try {
    isVerifying.value = true
    const position = await getCurrentPosition()
    const response = await axios.post(
      `https://tripggukgguk.site/api/verify/gps/courses/${props.courseId}/places/${props.place.id}`,
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      {
        withCredentials: true,
      },
    )

    if (response.data.success) {
      if (props.place.canPhotoVerify) {
        showPhotoVerification.value = true
      } else {
        emit('stamp-complete', props.place.id)
        emit('close')
      }
    }
  } catch (error) {
    let errorMessage = '위치 인증에 실패했습니다.'

    if (error.name === 'GeolocationPositionError') {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '위치 정보 접근 권한이 거부되었습니다.'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = '위치 정보를 사용할 수 없습니다.'
          break
        case error.TIMEOUT:
          errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
          break
      }
    } else if (error.response && error.response.data) {
      // 서버에서 보낸 에러 메시지가 있다면 사용
      errorMessage = error.response.data.message || errorMessage
    }

    alert(errorMessage)
    console.error('Verification error:', error)
  } finally {
    isVerifying.value = false
  }
}
</script>

<style>
.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
