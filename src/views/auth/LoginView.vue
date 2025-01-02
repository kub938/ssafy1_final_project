<template>
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
      <KakaoLoginButton />
    </div>
  </div>
</template>

<script setup>
import KakaoLoginButton from '@/components/auth/KakaoLoginButton.vue'
</script>

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
}
</style>
