<template>
  <div class="callback-container">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else class="loading-message">카카오 로그인 처리 중...</div>
<<<<<<< HEAD
=======

    <!-- 환영 모달 -->
    <div
      v-if="showWelcomeModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-8 w-full max-w-sm mx-4 text-center">
        <div class="space-y-4">
          <div class="text-2xl font-bold text-[#fe6363]">환영합니다! 👋</div>
          <div class="text-xl">
            <span class="font-semibold">{{ userName }}</span
            >님
          </div>
          <div v-if="isNewUser" class="text-gray-600">
            여행꾹꾹의 새로운 멤버가 되신 것을 환영합니다!
          </div>
          <div v-else class="text-gray-600">다시 만나서 반갑습니다!</div>
        </div>
      </div>
    </div>
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const error = ref(null)
<<<<<<< HEAD
=======
const showWelcomeModal = ref(false)
const userName = ref('')
const isNewUser = ref(false)
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401

onMounted(async () => {
  const code = new URL(window.location.href).searchParams.get('code')

  if (!code) {
    error.value = '인증 코드를 찾을 수 없습니다.'
    setTimeout(() => router.push('/'), 3000)
    return
  }

  try {
    const data = await auth.handleKakaoCallback(code)
<<<<<<< HEAD
    // 로그인 성공 후 메인 페이지로 이동
    console.log(1243);
    router.push({
      path: '/',
      query: {
        loginSuccess: true,
        isNew: data.isNew,
      },
    })
=======

    // 유저 정보 설정 및 모달 표시
    userName.value = auth.user?.nickname || '게스트'
    isNewUser.value = data.isNew
    showWelcomeModal.value = true

    // 3초 후 모달 닫고 메인 페이지로 이동
    setTimeout(() => {
      showWelcomeModal.value = false
      router.push({
        path: '/',
        query: {
          loginSuccess: true,
          isNew: data.isNew,
        },
      })
    }, 2000)
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
  } catch (err) {
    error.value = err.message
    setTimeout(() => router.push('/'), 3000)
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.loading-message {
  color: #4caf50;
  font-size: 1.2em;
}

.error-message {
  color: #f44336;
  font-size: 1.2em;
}
<<<<<<< HEAD
=======

/* 모달 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
</style>
