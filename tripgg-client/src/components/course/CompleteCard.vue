<template>
  <div
    class="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
  >
    <!-- 이미지 섹션 -->
    <div class="relative">
      <!-- 이미지 -->
      <img
        :src="course.thumbnailUrl"
        :alt="course.title"
        class="w-full h-48 object-cover"
        @error="handleImageError"
      />
      <!-- 하얀색 오버레이 -->
      <div class="absolute inset-0 bg-white opacity-75"></div>
    </div>

    <!-- 텍스트 정보 섹션 -->
    <div class="p-4">
      <h3 class="font-semibold text-lg mb-2">{{ course.title }}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ course.description }}</p>

      <div class="flex justify-between items-center text-sm">
        <div class="text-gray-500">
          <p>{{ course.region }}</p>
        </div>
      </div>
    </div>

    <!-- 도장 이미지 (완료 표시) -->
    <div class="absolute top-0 left-0 w-full h-48 flex items-center justify-center">
      <img
        src="/images/stamp.png"
        alt="완료 도장"
        class="w-32 h-32 transform rotate-[-15deg] drop-shadow-lg"
      />
    </div>

    <!-- 호버 시 상세보기 버튼 -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
    >
      <router-link
        :to="{ name: 'CourseDetail', params: { id: course.id } }"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        자세히 보기
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
})

const handleImageError = (e) => {
  e.target.src = '/images/default-course.jpg'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.drop-shadow-lg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}
</style>
