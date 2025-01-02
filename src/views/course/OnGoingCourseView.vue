<template>
  <div class="min-h-screen bg-gray-50">
    <Header></Header>
    <main class="container mx-auto px-4 py-8">
      <!-- 페이지 제목과 필터 -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">진행중인 코스</h1>
        <div class="flex items-center space-x-4">
          <!-- 정렬 옵션 -->
          <select
            v-model="orderBy"
            @change="handleFiltersChange"
            class="px-2 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fe6363] focus:border-transparent cursor-pointer hover:border-[#fe6363] transition-colors"
          >
            <option value="">전체</option>
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>

          <!-- 지역 필터 -->
          <select
            v-model="selectedRegion"
            @change="handleFiltersChange"
            class="px-2 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fe6363] focus:border-transparent cursor-pointer hover:border-[#fe6363] transition-colors"
          >
            <option value="">전체 지역</option>
            <option v-for="region in regions" :key="region.value" :value="region.value">
              {{ region.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- 에러 메시지 -->
      <div v-else-if="error" class="text-red-500 text-center py-8">
        {{ error }}
      </div>

      <!-- 데이터가 없을 때 -->
      <div v-else-if="courses.length === 0" class="text-center py-8 text-gray-500">
        진행중인 코스가 없습니다.
      </div>

      <!-- 코스 목록 -->
      <div v-else>
        <!-- 총 코스 수 표시 -->
        <p class="text-gray-600 mb-4">총 {{ totalElements }}개의 진행중인 코스가 있습니다.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="course in courses"
            :key="course.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div class="relative">
              <!-- 썸네일 이미지 -->
              <img
                :src="course.thumbnailUrl"
                :alt="course.title"
                class="w-full h-48 object-cover rounded-t-lg"
                @error="handleImageError"
              />
              <!-- 진행률 뱃지 -->
              <div
                class="absolute top-2 right-2 bg-[#fe6363] text-white px-2 py-1 rounded-full text-sm"
              >
                {{ Math.round((course.verifiedPlaceNum / course.totalPlaceNum) * 100) }}% 완료
              </div>
            </div>

            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2">{{ course.title }}</h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ course.description }}</p>

              <div class="flex justify-between items-center text-sm">
                <div class="text-gray-500">
                  <p>{{ course.region }}</p>
                  <!-- <p>시작일: {{ formatDate(course.startedAt) }}</p> -->
                </div>
                <div class="text-gray-500">
                  {{ course.verifiedPlaceNum }}/{{ course.totalPlaceNum }} 완료
                </div>
              </div>

              <router-link
                :to="{ name: 'CourseDetail', params: { id: course.id } }"
                class="mt-4 block text-center py-2 px-4 bg-[#fb5e5e] text-white rounded-lg hover:bg-[#fc4444] transition-colors"
              >
                자세히 보기
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="isFirstPage"
            class="px-3 py-1 rounded-md border"
            :class="getButtonClass(isFirstPage)"
          >
            이전
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in visiblePageNumbers"
              :key="page"
              @click="goToPage(page)"
              class="px-3 py-1 rounded-md"
              :class="page === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="isLastPage"
            class="px-3 py-1 rounded-md border"
            :class="getButtonClass(isLastPage)"
          >
            다음
          </button>
        </nav>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import { format } from 'date-fns'
import Header from '@/components/layout/Header.vue'

const courses = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(0)
const totalElements = ref(0)
const orderBy = ref('')
const selectedRegion = ref('')
const isFirstPage = ref(true)
const isLastPage = ref(true)

// 지역 목록
const regions = [
  { name: '서울', value: 'seoul' },
  { name: '인천', value: 'incheon' },
  { name: '대전', value: 'daejeon' },
  { name: '대구', value: 'daegu' },
  { name: '광주', value: 'gwangju' },
  { name: '부산', value: 'busan' },
  { name: '울산', value: 'ulsan' },
  { name: '세종', value: 'sejong' },
  { name: '경기', value: 'gyeonggi' },
  { name: '강원', value: 'gangwon' },
  { name: '충북', value: 'chungbuk' },
  { name: '충남', value: 'chungnam' },
  { name: '경북', value: 'gyeongbuk' },
  { name: '경남', value: 'gyeongnam' },
  { name: '전북', value: 'jeonbuk' },
  { name: '전남', value: 'jeonnam' },
  { name: '제주', value: 'jeju' },
]

// 페이지 번호 계산
const visiblePageNumbers = computed(() => {
  const maxVisible = 5
  const halfVisible = Math.floor(maxVisible / 2)
  const totalPagesNum = totalPages.value

  if (totalPagesNum <= maxVisible) {
    return Array.from({ length: totalPagesNum }, (_, i) => i + 1)
  }

  let start = currentPage.value - halfVisible
  let end = currentPage.value + halfVisible

  if (start < 1) {
    start = 1
    end = maxVisible
  }

  if (end > totalPagesNum) {
    end = totalPagesNum
    start = Math.max(totalPagesNum - maxVisible + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// API 호출
const fetchCourses = async () => {
  try {
    loading.value = true
    error.value = null

    const params = new URLSearchParams()
    if (orderBy.value) params.append('orderBy', orderBy.value)
    if (selectedRegion.value) params.append('region', selectedRegion.value)
    params.append('page', currentPage.value)

    const response = await fetch(
      `https://tripggukgguk.site/api/courses/in-progress?${params.toString()}`,
      {
        credentials: 'include',
      },
    )

    const data = await response.json()

    if (data.success) {
      const {
        content,
        pageNumber,
        totalPages: total,
        totalElements: elements,
        first,
        last,
      } = data.data
      courses.value = content
      currentPage.value = pageNumber
      totalPages.value = total
      totalElements.value = elements
      isFirstPage.value = first
      isLastPage.value = last
    }
  } catch (err) {
    error.value = '코스 정보를 불러오는데 실패했습니다.'
    console.error('Failed to fetch courses:', err)
  } finally {
    loading.value = false
  }
}

// 유틸리티 함수들
// const formatDate = (dateString) => {
//   return format(new Date(dateString), 'yyyy.MM.dd')
// }

const handleImageError = (e) => {
  e.target.src = '/images/default-course.jpg'
}

const getButtonClass = (isDisabled) => {
  return isDisabled
    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
    : 'text-blue-500 border-blue-500 hover:bg-blue-50'
}

// 이벤트 핸들러
const handleFiltersChange = () => {
  currentPage.value = 1
  fetchCourses()
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchCourses()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 초기 데이터 로드
fetchCourses()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
