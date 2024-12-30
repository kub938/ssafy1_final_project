// auth.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import axios from 'axios'

<<<<<<< HEAD
=======
const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI
const kakaoId = import.meta.env.VITE_KAKAO_CLIENT_ID
const api_url = import.meta.env.VITE_API_URL

>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
export const useAuthStore = defineStore('auth', () => {
  // localStorage에서 초기 상태를 가져옴
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)
  const token = ref(localStorage.getItem('token') || null)

  // Axios 인스턴스 생성
  const api = axios.create({
<<<<<<< HEAD
    baseURL: 'http://localhost:8080/api',
=======
    baseURL: api_url,
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
    withCredentials: true,
  })

  // user 상태 변경 감지하여 localStorage에 저장
  watch(
    user,
    (newUser) => {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('user')
      }
    },
    { deep: true },
  )

  // token 상태 변경 감지하여 localStorage에 저장
  watch(token, (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  })

  // API 요청에 토큰 자동 포함
  api.interceptors.request.use((config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  const loginWithKakao = () => {
<<<<<<< HEAD
    const KAKAO_CLIENT_ID = '659a1fb9c5d56f43fad03fbe7ca24eb1'
    const KAKAO_REDIRECT_URI = 'http://localhost:3000/oauth/kakao/callback'
=======
    const KAKAO_CLIENT_ID = kakaoId
    const KAKAO_REDIRECT_URI = redirect_uri + '/oauth/kakao/callback'
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`
    window.location.href = kakaoAuthUrl
  }

  const handleKakaoCallback = async (code) => {
    try {
      loading.value = true
      const response = await api.post('/oauth/kakao', { code })

      if (response.data.success) {
        // 사용자 정보와 토큰 저장
        const userData = response.data.data
        user.value = userData.user || userData // 서버 응답 구조에 따라 조정
        token.value = userData.token // 서버가 토큰을 제공하는 경우

        console.log('로그인 성공:', user.value)
        return response.data.data
      }
    } catch (err) {
      console.error('로그인 에러:', err)
      throw new Error('로그인 처리 중 오류가 발생했습니다.')
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    try {
      // 서버에 로그아웃 요청 (필요한 경우)
      // await api.post('/logout')

      // 로컬 상태 초기화
      user.value = null
      token.value = null

      // localStorage 클리어
      localStorage.removeItem('user')
      localStorage.removeItem('token')

      console.log('로그아웃 완료')
    } catch (error) {
      console.error('로그아웃 에러:', error)
    }
  }

  // 로그인 상태 확인
  const isAuthenticated = () => {
    return !!user.value
  }

  return {
    user,
    token,
    loading,
    loginWithKakao,
    handleKakaoCallback,
    logout,
    isAuthenticated,
  }
})
