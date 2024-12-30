<<<<<<< HEAD
<!-- CourseListView.vue -->
=======
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
<template>
  <div class="min-h-screen bg-gray-50">
    <Header></Header>
    <main class="container mx-auto px-4">
      <!-- 지역 선택 메뉴 -->
      <div class="py-4 overflow-x-auto">
        <div class="flex space-x-4 min-w-max px-2">
          <button
            v-for="region in regions"
            :key="region.id"
            @click="handleRegionSelect(region.value)"
            class="flex flex-col items-center space-y-2"
            :class="selectedRegion === region.value ? 'opacity-100' : 'opacity-70'"
          >
            <div class="w-14 h-14 rounded-full flex items-center justify-center">
<<<<<<< HEAD
              <img :src="region.icon" :alt="region.name" class="w-14 h-14 rounded-full" />
=======
              <img
                :src="region.icon"
                :alt="region.name"
                class="w-14 h-14 rounded-full object-cover"
              />
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
            </div>
            <span class="text-sm">{{ region.name }}</span>
          </button>
        </div>
      </div>

<<<<<<< HEAD
      <CourseCard :selected-region="selectedRegion" />
=======
      <!-- 코스 목록 제목 -->
      <div class="mb-6">
        <div class="flex justify-between items-center mt-5">
          <h2 class="text-2xl font-bold">
            {{
              selectedRegion
                ? `${regions.find((r) => r.value === selectedRegion)?.name} `
                : '전체 코스'
            }}
          </h2>
          <div class="flex items-center space-x-4 text-sm">
            <button
              @click="handleOrderChange('latest')"
              class="py-1 rounded"
              :class="orderBy === 'latest' ? 'text-blue-600 font-semibold' : 'text-gray-500'"
            >
              최신순
            </button>
            <span class="text-gray-300">|</span>
            <button
              @click="handleOrderChange('popular')"
              class="py-1 rounded"
              :class="orderBy === 'popular' ? 'text-blue-600 font-semibold' : 'text-gray-500'"
            >
              인기순
            </button>
          </div>
        </div>
      </div>

      <!-- 코스 카드 목록 -->
      <CourseCard
        v-if="isInitialized"
        :selected-region="selectedRegion"
        :order-by="orderBy"
        :current-page="currentPage"
        @update:total-pages="totalPages = $event"
      />

      <!-- 페이지네이션 -->
      <div v-if="totalPages >= 1" class="flex justify-center mt-8">
        <div class="flex space-x-2 items-center">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md border"
            :class="getButtonClass(currentPage === 1)"
          >
            이전
          </button>

          <div class="flex space-x-1">
            <button
              v-for="pageNum in visiblePageNumbers"
              :key="pageNum"
              @click="handlePageChange(pageNum)"
              class="px-3 py-1 rounded-md"
              :class="pageNum === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'"
            >
              {{ pageNum }}
            </button>
          </div>

          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md border"
            :class="getButtonClass(currentPage === totalPages)"
          >
            다음
          </button>
        </div>
      </div>
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
    </main>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import CourseCard from '@/components/course/CourseCard.vue'

const selectedRegion = ref(null)

const regions = [
  { id: 1, name: '서울', value: 'seoul', icon: '/src/assets/images/LocalImage/seoul.jpg' }, // c
  { id: 2, name: '인천', value: 'incheon', icon: '/src/assets/images/LocalImage/incheon.jpg' },
  { id: 3, name: '대전', value: 'daejeon', icon: '/src/assets/images/LocalImage/daejeon.jpeg' }, // c
  { id: 4, name: '대구', value: 'daegoo', icon: '/src/assets/images/LocalImage/daegu.jpg' },
  { id: 5, name: '광주', value: 'gwangjoo', icon: '/src/assets/images/LocalImage/gwangjoo.jpeg' }, //c
  { id: 6, name: '부산', value: 'boosan', icon: '/src/assets/images/LocalImage/boosan.jpeg' }, //c
  { id: 7, name: '울산', value: 'ulsan', icon: '/src/assets/images/LocalImage/ulsan.jpg' },
  { id: 8, name: '세종', value: 'saejong', icon: '/src/assets/images/LocalImage/saejong.jpg' },
  { id: 9, name: '경기', value: 'gyunggi', icon: '/src/assets/images/LocalImage/gyeonggi.jpg' }, //여기부터 데이터 31
  { id: 10, name: '강원', value: 'gangwon', icon: '/src/assets/images/LocalImage/gangwon.jpg' },
  { id: 11, name: '충북', value: 'chungbuk', icon: '/src/assets/images/LocalImage/chungbuk.jpg' },
  { id: 12, name: '충남', value: 'chungnam', icon: '/src/assets/images/LocalImage/chungnam.jpg' },
  { id: 13, name: '경북', value: 'gyungbuk', icon: '/src/assets/images/LocalImage/gyeongbuk.jpg' },
  { id: 14, name: '경남', value: 'gyungnam', icon: '/src/assets/images/LocalImage/gyeongnam.jpg' },
  { id: 15, name: '전북', value: 'jeonbuk', icon: '/src/assets/images/LocalImage/jeonbuk.jpeg' },
  { id: 16, name: '전남', value: 'jeonnam', icon: '/src/assets/images/LocalImage/jeonnam.jpeg' },
  { id: 17, name: '제주', value: 'jeju', icon: '/src/assets/images/LocalImage/jeju.jpeg' }, //c
  // 필요한 지역들 추가
]

const handleRegionSelect = (region) => {
  selectedRegion.value = region
}
=======
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import CourseCard from '@/components/course/CourseCard.vue'

const route = useRoute()
const selectedRegion = ref(null)
const orderBy = ref('latest')
const currentPage = ref(1)
const totalPages = ref(0)
const isInitialized = ref(false)

// 페이지네이션 관련
const maxVisiblePages = 5

const visiblePageNumbers = computed(() => {
  if (totalPages.value <= maxVisiblePages) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }

  let start = Math.max(currentPage.value - Math.floor(maxVisiblePages / 2), 1)
  let end = start + maxVisiblePages - 1

  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(end - maxVisiblePages + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const regions = [
  { id: 1, name: '서울', value: 'seoul', icon: '/images/LocalImage/seoul.jpg' },
  { id: 2, name: '인천', value: 'incheon', icon: '/images/LocalImage/incheon.jpg' },
  { id: 3, name: '대전', value: 'daejeon', icon: '/images/LocalImage/daejeon.jpeg' },
  { id: 4, name: '대구', value: 'daegu', icon: '/images/LocalImage/daegu.jpg' },
  { id: 5, name: '광주', value: 'gwangju', icon: '/images/LocalImage/gwangjoo.jpeg' },
  { id: 6, name: '부산', value: 'busan', icon: '/images/LocalImage/boosan.jpeg' },
  { id: 7, name: '울산', value: 'ulsan', icon: '/images/LocalImage/ulsan.jpg' },
  { id: 8, name: '세종', value: 'sejong', icon: '/images/LocalImage/saejong.jpg' },
  { id: 9, name: '경기', value: 'gyeonggi', icon: '/images/LocalImage/gyeonggi.jpg' },
  { id: 10, name: '강원', value: 'gangwon', icon: '/images/LocalImage/gangwon.jpg' },
  { id: 11, name: '충북', value: 'chungbuk', icon: '/images/LocalImage/chungbuk.jpg' },
  { id: 12, name: '충남', value: 'chungnam', icon: '/images/LocalImage/chungnam.jpg' },
  { id: 13, name: '경북', value: 'gyeongbuk', icon: '/images/LocalImage/gyeongbuk.jpg' },
  { id: 14, name: '경남', value: 'gyeongnam', icon: '/images/LocalImage/gyeongnam.jpg' },
  { id: 15, name: '전북', value: 'jeonbuk', icon: '/images/LocalImage/jeonbuk.jpeg' },
  { id: 16, name: '전남', value: 'jeonnam', icon: '/images/LocalImage/jeonnam.jpeg' },
  { id: 17, name: '제주', value: 'jeju', icon: '/images/LocalImage/jeju.jpeg' },
]

const getButtonClass = (isDisabled) => {
  return isDisabled
    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
    : 'text-blue-500 border-blue-500 hover:bg-blue-50'
}

const handleRegionSelect = (region) => {
  console.log('Selected region:', region)
  selectedRegion.value = region
  currentPage.value = 1
}

const handleOrderChange = (type) => {
  orderBy.value = type
  currentPage.value = 1
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const initializeRegion = () => {
  const cityId = route.params.cityId
  if (cityId) {
    const regionMapping = {
      1: 'seoul',
      2: 'incheon',
      3: 'daejeon',
      4: 'daegu',
      5: 'gwangju',
      6: 'busan',
      7: 'ulsan',
      8: 'sejong',
      9: 'gyeonggi',
      10: 'gangwon',
      11: 'chungbuk',
      12: 'chungnam',
      13: 'gyeongbuk',
      14: 'gyeongnam',
      15: 'jeonbuk',
      16: 'jeonnam',
      17: 'jeju',
    }

    const regionValue = regionMapping[cityId]
    if (regionValue) {
      selectedRegion.value = regionValue
      console.log('Initial region set to:', regionValue)
      isInitialized.value = true
    } else {
      isInitialized.value = true
    }
  } else {
    selectedRegion.value = null
    isInitialized.value = true
  }
}

onMounted(() => {
  initializeRegion()
})
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
</script>
