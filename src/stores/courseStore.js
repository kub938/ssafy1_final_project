// stores/courseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const api_url = 'https://tripggukgguk.site/api'
// axios 인스턴스 생성 (baseURL 설정)
const api = axios.create({
  baseURL: api_url, // 실제 백엔드 서버 주소로 변경해주세요
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const useCourseStore = defineStore('course', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const courseDetail = ref(null)

  const fetchCourses = async (region = null, orderBy = 'latest', page = 1) => {
    try {
      loading.value = true
      // 실제 백엔드 API 엔드포인트에 맞게 수정

      const response = await api.get(`courses/all`, {
        params: {
          region: region,
          orderBy: orderBy,
          page: page,
        },
      })

      courses.value = response.data.data.content // 또는 response.data.data 등 실제 데이터 구조에 맞게 수정
    } catch (err) {
      console.error('API Error:', err)
      error.value = '코스 정보를 불러오는데 실패했습니다.'

      if (err.response) {
        // 서버가 응답을 반환한 경우
        console.error('Error status:', err.response.status)
        console.error('Error data:', err.response.data)
      } else if (err.request) {
        // 요청이 전송되었으나 응답을 받지 못한 경우
        console.error('No response received:', err.request)
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('Error config:', err.message)
      }
    } finally {
      loading.value = false
    }
  }

  const fetchCourseDetail = async (courseId) => {
    try {
      loading.value = true
      const response = await api.get(`courses/${courseId}`)

      console.log('response = ', response.data)
      courseDetail.value = response.data.data
      return response.data.data
    } catch (err) {
      console.error('API Error:', err)
      error.value = '코스 상세 정보를 불러오는데 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    courseDetail,
    loading,
    error,
    currentPage,
    fetchCourses,
    fetchCourseDetail,
  }
})
