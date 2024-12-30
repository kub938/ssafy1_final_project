<<<<<<< HEAD
<script setup></script>

<template></template>

<style></style>
=======
<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <!-- 데이터가 없는 경우 -->
    <div v-else-if="courses.length === 0" class="text-center py-8 text-gray-500">
      해당하는 코스가 없습니다.
    </div>

    <!-- 코스 목록 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="course in courses"
        :key="course.id"
        :to="{ name: 'CourseDetail', params: { id: course.id } }"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
      >
        <!-- 코스 이미지 -->
        <div class="relative h-48">
          <img
            :src="course.thumbnailUrl"
            :alt="course.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div
            class="absolute top-2 right-2 bg-[#fb5e5e] text-white px-2 py-1 rounded-full text-xs"
          >
            {{ course.region }}
          </div>
        </div>

        <!-- 코스 정보 -->
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2 line-clamp-1">{{ course.title }}</h3>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ course.description }}</p>

          <div class="flex justify-between items-center text-sm text-gray-500"></div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedRegion: {
    type: String,
    default: null,
  },
  orderBy: {
    type: String,
    default: 'latest',
  },
  currentPage: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:total-pages'])

const courses = ref([])
const loading = ref(false)
const error = ref(null)

const handleImageError = (e) => {
  e.target.src = '/assets/images/default-course.jpg'
}

const fetchCourses = async () => {
  try {
    loading.value = true
    error.value = null

    const params = new URLSearchParams()
    params.append('orderBy', props.orderBy || 'latest')

    if (props.selectedRegion) {
      params.append('region', props.selectedRegion)
    }

    params.append('page', props.currentPage.toString())

    console.log('Request params:', Object.fromEntries(params))

    const response = await fetch(`https://tripggukgguk.site/api/courses/all?${params.toString()}`, {
      credentials: 'include',
    })

    const data = await response.json()

    if (data.success) {
      courses.value = data.data.content
      emit('update:total-pages', data.data.totalPages)
    } else {
      error.value = '코스 정보를 불러오는데 실패했습니다.'
    }
  } catch (err) {
    console.error('Failed to fetch courses:', err)
    error.value = '코스 정보를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

watch(
  [() => props.selectedRegion, () => props.orderBy, () => props.currentPage],
  async (newValues, oldValues) => {
    const [newRegion, newOrder, newPage] = newValues
    console.log('Props changed:', { newRegion, newOrder, newPage })

    if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
      await fetchCourses()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
