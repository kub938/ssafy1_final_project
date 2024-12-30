<template>
<<<<<<< HEAD
  <div class="login-container">
    <div class="logo-section">
      <img src="@/assets/images/logo.png" alt="여행꼭꼭 로고" class="logo" />
    </div>
    <p class="subtitle">함께 여행을 떠나봐요</p>
    <div class="login-buttons">
=======
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50"
  >
    <!-- 로고 섹션 -->
    <div class="flex flex-col items-center mb-8 animate-fade-in">
      <img
        src="/images/logo.png"
        alt="여행꼭꼭 로고"
        class="w-[200px] h-[200px] object-contain mb-4 transition-transform hover:scale-105 duration-300 md:w-[300px] md:h-[300px] sm:w-[200px] sm:h-[200px]"
      />
    </div>

    <!-- 서브타이틀 -->
    <p
      class="text-lg text-gray-600 mb-12 font-medium tracking-wide sm:text-base animate-fade-in-up delay-200"
    >
      함께 여행을 떠나봐요
    </p>

    <!-- 로그인 버튼 -->
    <div class="w-full max-w-sm px-4 animate-fade-in-up delay-300">
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
      <KakaoLoginButton />
    </div>
  </div>
</template>

<script setup>
import KakaoLoginButton from '@/components/auth/KakaoLoginButton.vue'
</script>

<<<<<<< HEAD
<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: white;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 400px;
  height: 400px;
  margin-bottom: 12px;
  object-fit: contain; /* 이미지 비율 유지 */
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.login-buttons {
  width: 100%;
  max-width: 320px;
}

/* 모바일 대응을 위한 미디어 쿼리 추가 */
@media (max-width: 768px) {
  .logo {
    width: 64px;
    height: 64px;
  }

  .logo-text {
    font-size: 20px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 32px;
  }
=======
<style>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
}
</style>
