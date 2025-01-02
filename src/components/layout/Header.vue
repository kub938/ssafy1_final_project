<template>
  <header
    class="flex-shrink-0 px-4 py-2 flex items-center justify-between bg-white border-b relative"
  >
    <!-- 뒤로가기 버튼 -->
    <button class="p-2 z-10 w-10 hover:bg-gray-100 rounded-full transition-colors" @click="goBack">
      <span class="text-xl">←</span>
    </button>

    <!-- 중앙 로고/제목 -->
    <div @click="goToHome" class="flex-1 flex justify-center items-center max-w-[200px] mx-auto">
      <img src="/images/SimpleLogo.png" alt="여행 꾹꾹" class="h-7 w-auto min-w-[120px]" />
    </div>

    <!-- MyPage 버튼 -->
    <button class="p-2 z-10 w-12" @click="goToMyPage">
      <img :src="profileImage" alt="프로필" class="w-8 h-8 rounded-full object-cover 0" />
    </button>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import defaultProfileImage from '/images/userIcon.png'

const router = useRouter()
const authStore = useAuthStore()

const profileImage = computed(() => {
  return authStore.user?.profileImage || defaultProfileImage
})

// 뒤로가기 함수 추가
const goBack = () => {
  // 라우터 히스토리가 있는 경우 뒤로가기
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    // 히스토리가 없는 경우 메인 페이지로 이동
    router.push({ name: 'MainPage' })
  }
}

const goToMyPage = () => {
  if (authStore.user) {
    router.push({ name: 'MyPage' })
  } else {
    router.push({ name: 'Login' })
  }
}

const goToHome = () => {
  router.push({ name: 'MainPage' })
}
</script>

<style scoped>
button:hover img {
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
}

img {
  aspect-ratio: 1;
}

/* 뒤로가기 버튼 호버 효과 추가 */
button:hover span {
  transform: translateX(-2px);
  transition: transform 0.2s ease-in-out;
}
</style>
