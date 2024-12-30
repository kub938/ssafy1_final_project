<template>
  <button @click="handleLogin" class="kakao-login-btn" :disabled="auth.loading">
    {{ auth.loading ? '로그인 중...' : '카카오 계정으로 로그인' }}
  </button>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
  // 저장된 로그인 정보 확인
  if (auth.isAuthenticated()) {
    console.log('저장된 사용자 정보:', auth.user)
  }
})

const handleLogin = () => {
  auth.loginWithKakao()
}
</script>

<style scoped>
.kakao-login-btn {
  width: 100%;
  padding: 14px;
  background-color: #fee500;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.2s;
}

.kakao-login-btn:hover:not(:disabled) {
  background-color: #fdd835;
}

.kakao-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
