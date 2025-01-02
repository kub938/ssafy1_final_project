<template>
  <div class="min-h-screen bg-gray-50">
    <Header></Header>
    <main class="container mx-auto px-4 py-8">
      <!-- 페이지 제목과 필터 -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">완료한 코스</h1>
        <div class="flex items-center space-x-4">
          <!-- 정렬 옵션 -->
          <select
            v-model="orderBy"
            class="px-2 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fe6363] focus:border-transparent cursor-pointer hover:border-[#fe6363] transition-colors"
            @change="handleFiltersChange"
          >
            <option value="">전체</option>
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>

          <!-- 지역 필터 -->
          <select
            v-model="selectedRegion"
            class="px-2 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fe6363] focus:border-transparent cursor-pointer hover:border-[#fe6363] transition-colors"
            @change="handleFiltersChange"
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
        완료한 코스가 없습니다.
      </div>

      <!-- 코스 목록 -->
      <div v-else>
        <!-- 총 코스 수 표시 -->
        <p class="text-gray-600 mb-4">총 {{ totalElements }}개의 완료한 코스가 있습니다.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <CompleteCard v-for="course in courses" :key="course.id" :course="course" />
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
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
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/layout/Header.vue'
import CourseCard from '@/components/course/CourseCard.vue'
import CompleteCard from '@/components/course/CompleteCard.vue'

const courses = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(0)
const totalElements = ref(0)
const orderBy = ref('')
const selectedRegion = ref('')

// 페이지당 표시할 아이템 수와 최대 표시 페이지 수
const maxVisiblePages = 5

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

// 보이는 페이지 번호 계산
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

// API 호출
const fetchCourses = async () => {
  try {
    loading.value = true
    error.value = null

    const params = new URLSearchParams()
    if (orderBy.value) params.append('orderBy', orderBy.value)
    if (selectedRegion.value) params.append('region', selectedRegion.value)
    params.append('page', currentPage.value - 1) // 백엔드는 0-based pagination

    const response = await fetch(
      `https://tripggukgguk.site/api/courses/completed?${params.toString()}`,
      {
        credentials: 'include',
      },
    )

    const data = await response.json()

    if (data.success) {
      courses.value = data.data.content
      totalPages.value = data.data.totalPages
      totalElements.value = data.data.totalElements
      currentPage.value = data.data.pageNumber + 1 // 프론트엔드는 1-based pagination
    }
  } catch (err) {
    error.value = '코스 정보를 불러오는데 실패했습니다.'
    console.error('Failed to fetch courses:', err)
  } finally {
    loading.value = false
  }
}

// 유틸리티 함수
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
