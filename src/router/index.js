import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MainPage from '@/views/MainPage.vue'
// import LoginView from '@/views/auth/LoginView.vue'
import MyPage from '@/views/profile/MyPage.vue'
import LoginView from '@/views/auth/LoginView.vue'
import CourseListView from '@/views/course/CourseListView.vue'
import OnGoingCourseView from '@/views/course/OnGoingCourseView.vue'
import CourseCompleteView from '@/views/course/CourseCompleteView.vue'
import KakaoCallback from '@/views/auth/KakaoCallback.vue'
import UserProfileView from '@/views/profile/UserProfileView.vue'
import CourseDetailView from '@/views/course/CourseDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage,
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/course/:cityId',
      name: 'CourseListByCity',
      component: CourseListView,
      props: true,
    },
    {
      path: '/ongoing-course',
      name: 'OnGoingCourse',
      component: OnGoingCourseView,
    },
    {
      path: '/complete-course',
      name: 'CourseComplete',
      component: CourseCompleteView,
    },
    {
      path: '/oauth/kakao/callback',
      name: 'kakaoCallback',
      component: KakaoCallback,
    },
    //usertest
    {
      path: '/profile',
      name: 'profile',
      component: UserProfileView,
    },
    {
      path: '/course',
      name: 'CourseList',
      component: CourseListView,
    },
    {
      path: '/course/detail/:id',
      name: 'CourseDetail',
      component: CourseDetailView,
      props: true,
    },
    // {
    //   paht: '/course-detail-view',
    //   name: 'CourseDetailView',
    //   component: CourseDetailView,
    // },

    // 코스 상세 페이지 라우트 추가
    // {
    //   path: '/course/all',
    //   name: 'courseAll',
    //   component: () => import('@/views/CourseAll.vue'), // lazy loading 적용
    // },
  ],
})

router.beforeEach((to, from, next) => {
  console.log('Route params:', to.params)
  next()
})

export default router
