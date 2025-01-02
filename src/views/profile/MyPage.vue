<template>
  <div class="h-screen flex flex-col">
    <Header class="flex-shrink-0" />
    <main class="flex-1 bg-gray-50">
      <div class="h-full flex flex-col gap-4 p-4 max-w-md mx-auto">
        <!-- 프로필 섹션 -->
        <div class="bg-white rounded-2xl shadow-md p-6">
          <div class="flex flex-col items-center">
            <!-- 프로필 이미지 -->
            <div class="w-26 h-26 mb-4 overflow-hidden">
              <img :src="profileImage" alt="프로필 이미지" class="w-full h-full object-cover" />
            </div>
            <!-- 닉네임 -->
            <h2 class="text-xl font-bold mb-2">{{ userInfo.nickname }}</h2>
            <!-- "로그아웃" 버튼 -->
            <button
              @click="handleLogout"
              class="text-gray-500 text-sm bg-gray-100 px-4 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        <!-- 코스 네비게이션 버튼 -->
        <div class="bg-[#DD6B4D] rounded-2xl p-4">
          <div class="flex justify-around items-center">
            <router-link to="/course" class="flex flex-col items-center text-white">
              <div class="w-8 h-8 my-2">
                <img src="/images/mypage/CourceIcon.png" alt="미도전 코스" />
              </div>
              <span class="text-sm">전체 코스</span>
            </router-link>

            <router-link to="/ongoing-course" class="flex flex-col items-center text-white">
              <div class="w-8 h-8 my-2">
                <img src="/images/mypage/OnGoingIcon.png" alt="진행중 코스" />
              </div>
              <span class="text-sm">진행중 코스</span>
            </router-link>

            <router-link to="/complete-course" class="flex flex-col items-center text-white">
              <div class="w-8 h-8 my-2">
                <img src="/images/mypage/CompleteIcon.png" alt="완료한 코스" />
              </div>
              <span class="text-sm">완료한 코스</span>
            </router-link>
          </div>
        </div>

        <!-- 현재 스코어 섹션 -->
        <div class="bg-[#FFF6F6] rounded-2xl p-6">
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium">현재 스코어</span>
            <span class="text-xl font-bold">{{ userInfo.totalPoints }}점</span>
          </div>
        </div>

        <!-- 회원 탈퇴 버튼 -->
        <button
          @click="handleWithdrawal"
          class="bg-white rounded-2xl p-4 text-center text-gray-500 font-medium mt-auto hover:bg-gray-50 transition-colors"
        >
          회원 탈퇴
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Header from '@/components/layout/Header.vue'
import Cookies from 'js-cookie'

const router = useRouter()
const KAKAO_DEFAULT_IMAGE =
  'http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg'

const userInfo = ref({
  nickname: '',
  totalPoints: 0,
  profileImageUrl: '',
})

const profileImage = computed(() => {
  if (!userInfo.value.profileImageUrl || userInfo.value.profileImageUrl === KAKAO_DEFAULT_IMAGE) {
    return '/images/mypage/profileDefaultImage.png'
  }
  return userInfo.value.profileImageUrl
})

// 로그아웃 처리
const handleLogout = () => {
  // 로컬 스토리지 초기화
  localStorage.clear()
  // 쿠키 삭제
  Cookies.remove('accessToken')

  // 홈페이지로 리다이렉트 및 새로고침
  window.location.href = '/'
}

// 회원 탈퇴 처리
const handleWithdrawal = async () => {
  const confirmed = confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
  if (!confirmed) return

  try {
    await axios.delete('https://tripggukgguk.site/api/users/me', {
      withCredentials: true,
    })

    // 로컬 스토리지 초기화
    localStorage.clear()
    // 쿠키 삭제
    Cookies.remove('accessToken', {
      path: '/', // 쿠키의 경로
      domain: 'tripggukgguk.site', // 쿠키의 도메인 (실제 도메인으로 수정 필요)
    })

    // 홈페이지로 리다이렉트 및 새로고침

    alert('회원 탈퇴가 완료되었습니다.')
    window.location.href = '/'
  } catch (error) {
    console.error('회원 탈퇴 중 에러 발생:', error)
    alert('회원 탈퇴 중 오류가 발생했습니다.')
  }
}

// 초기 데이터 로드
onMounted(async () => {
  try {
    const response = await axios.get('https://tripggukgguk.site/api/users/me', {
      withCredentials: true,
    })

    console.log('사용자 정보:', response.data.data)
    userInfo.value = {
      nickname: response.data.data.nickname,
      totalPoints: response.data.data.totalPoints,
      profileImageUrl: response.data.data.profileImageUrl,
    }
  } catch (error) {
    console.error('사용자 정보를 불러오는데 실패했습니다:', error)
    router.push('/login') // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  }
})
</script>

<style scoped>
.router-link-active {
  @apply opacity-80;
}

button:hover {
  @apply opacity-80;
}

.profile-image {
  @apply w-full h-full object-cover;
  aspect-ratio: 1;
}

/* 버튼 호버 효과 */
.router-link-active,
button {
  transition: all 0.2s ease-in-out;
}

.router-link-active:hover,
button:hover {
  transform: translateY(-1px);
}
</style>
