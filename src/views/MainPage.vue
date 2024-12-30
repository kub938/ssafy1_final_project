<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <Header></Header>
    <!-- 메인 이미지 섹션 -->
    <div class="container mx-auto px-4 py-6">
<<<<<<< HEAD
      <h2 class="text-2xl md:text-3xl font-bold mb-4">낭만 가득! 가을 한옥 여행</h2>
=======
      <h2 class="text-2xl md:text-3xl font-bold mb-4">여행꾹꾹과 함께하는 여행</h2>
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
      <swiper
        :modules="mainSlideModules"
        :slides-per-view="1"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
        :speed="3000"
        :loop="true"
        :pagination="{
          type: 'progressbar',
        }"
        @slideChange="onMainSlideChange"
        class="w-full h-[370px] md:h-[500px] lg:h-[600px]"
      >
        <swiper-slide v-for="slide in mainSlides" :key="slide.id">
<<<<<<< HEAD
          <div class="w-full h-full relative">
            <img
              :src="slide.imageUrl"
              :alt="slide.alt"
              class="w-full h-full object-cover rounded-2xl shadow-lg"
            />
            <div
              class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl"
            >
              <h3 class="text-white text-xl md:text-2xl font-medium">{{ slide.title }}</h3>
              <p class="text-white/90 mt-2">{{ slide.description }}</p>
            </div>
          </div>
=======
          <router-link :to="{ name: 'CourseDetail', params: { id: slide.id } }">
            <div class="w-full h-full relative">
              <img
                :src="slide.imageUrl"
                :alt="slide.alt"
                class="w-full h-full object-cover rounded-2xl shadow-lg"
              />
              <div
                class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl"
              >
                <h3 class="text-white text-xl md:text-2xl font-medium">{{ slide.title }}</h3>
                <p class="text-white/90 mt-2">{{ slide.description }}</p>
              </div>
            </div>
          </router-link>
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
        </swiper-slide>
      </swiper>
      <div class="flex items-center gap-4 mt-4">
        <div class="flex-1 bg-white h-0.5 rounded-full overflow-hidden">
          <div
            class="h-full bg-black transition-all duration-300 ease-in-out"
            :style="{ width: `${(currentSlide + 1) * 33.33}%` }"
          ></div>
        </div>
        <div class="text-sm font-medium">0{{ currentSlide + 1 }} / 03 ||</div>
      </div>
    </div>

    <!-- Swiper로 도시 그리드 섹션 -->
    <div class="container mx-auto px-4">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="16"
        :pagination="{
          clickable: true,
          bulletClass: 'custom-bullet',
          bulletActiveClass: 'custom-bullet-active',
          horizontalClass: 'custom-pagination',
        }"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
<<<<<<< HEAD
        class="w-full mb-0"
      >
        <!-- 첫 번째 페이지 -->
        <swiper-slide class="py-4">
=======
        class="w-full mb-0 pb-8"
      >
        <!-- 첫 번째 페이지 -->
        <swiper-slide class="">
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
          <div class="grid grid-cols-3 gap-4">
            <CityBlock
              v-for="city in firstPage"
              :key="city.id"
              :cityData="city"
              class="aspect-square"
            />
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <CityBlock
              v-for="city in firstPageSecondRow"
              :key="city.id"
              :cityData="city"
              class="aspect-square"
            />
          </div>
        </swiper-slide>

        <!-- 두 번째 페이지 -->
<<<<<<< HEAD
        <swiper-slide class="py-4">
=======
        <swiper-slide class="">
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
          <div class="grid grid-cols-3 gap-4">
            <CityBlock
              v-for="city in secondPage"
              :key="city.id"
              :cityData="city"
              class="aspect-square"
            />
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <CityBlock
              v-for="city in secondPageSecondRow"
              :key="city.id"
              :cityData="city"
              class="aspect-square"
            />
          </div>
        </swiper-slide>

<<<<<<< HEAD
        <swiper-slide class="py-4">
=======
        <swiper-slide class="">
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
          <div class="grid grid-cols-3 gap-4">
            <CityBlock
              v-for="city in thirdPage"
              :key="city.id"
              :cityData="city"
              class="aspect-square"
            />
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <CityBlock
              v-for="city in thirdPageSecondRow"
              :key="city.id"
              :cityData="city"
              class="aspect-square"
            />
          </div>
        </swiper-slide>
      </swiper>
      <!-- <div class="w-full bg-gray-100 py-6 mt-2">
        <div class="container mx-auto px-4">
          <div class="custom-pagination"></div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/layout/Header.vue'
import CityBlock from '@/components/common/CityBlock.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

const mainSlideModules = [Pagination, Autoplay]
const modules = [Navigation, Pagination]
const currentSlide = ref(0)

const onMainSlideChange = (swiper) => {
  // loop가 true일 때는 realIndex를 사용해야 합니다
  currentSlide.value = swiper.realIndex
}

const mainSlides = ref([
  {
<<<<<<< HEAD
    id: 1,
    imageUrl: '/src/assets/images/Main/hanok.jpg',
=======
    id: 124,
    imageUrl: '/images/Main/hanok.jpg',
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
    alt: '한옥마을 전경',
    title: '전통과 현대가 어우러진 한옥마을',
    description: '아름다운 우리나라 전통 건축의 멋을 느껴보세요',
  },
  {
<<<<<<< HEAD
    id: 2,
    imageUrl: '/src/assets/images/Main/maple.jpg', // 두 번째 이미지
=======
    id: 106,
    imageUrl: '/images/Main/maple.jpg', // 두 번째 이미지
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
    alt: '단풍 사진',
    title: '단풍과 함께하는 산책길',
    description: '짧은 가을에만 느낄 수 있는 단풍을 만나보세요',
  },
  {
<<<<<<< HEAD
    id: 3,
    imageUrl: '/src/assets/images/Main/ocean.jpg', // 세 번째 이미지
=======
    id: 93,
    imageUrl: '/images/Main/ocean.jpg', // 세 번째 이미지
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
    alt: '제주 전경',
    title: '일상 속 작은 쉼표',
    description: '제주에서 느끼는 특별한 휴식',
  },
])

const cities = ref([
<<<<<<< HEAD
  { id: 1, name: '서울', imageUrl: '/src/assets/images/LocalImage/seoul.jpg' }, // c
  { id: 2, name: '인천', imageUrl: '/src/assets/images/LocalImage/incheon.jpg' },
  { id: 3, name: '대전', imageUrl: '/src/assets/images/LocalImage/daejeon.jpeg' }, // c
  { id: 4, name: '대구', imageUrl: '/src/assets/images/LocalImage/daegu.jpg' },
  { id: 5, name: '광주', imageUrl: '/src/assets/images/LocalImage/gwangjoo.jpeg' }, //c
  { id: 6, name: '부산', imageUrl: '/src/assets/images/LocalImage/boosan.jpeg' }, //c
  { id: 7, name: '울산', imageUrl: '/src/assets/images/LocalImage/ulsan.jpg' },
  { id: 8, name: '세종', imageUrl: '/src/assets/images/LocalImage/saejong.jpg' },
  { id: 9, name: '경기', imageUrl: '/src/assets/images/LocalImage/gyeonggi.jpg' }, //여기부터 데이터 31
  { id: 10, name: '강원', imageUrl: '/src/assets/images/LocalImage/gangwon.jpg' },
  { id: 11, name: '충북', imageUrl: '/src/assets/images/LocalImage/chungbuk.jpg' },
  { id: 12, name: '충남', imageUrl: '/src/assets/images/LocalImage/chungnam.jpg' },
  { id: 13, name: '경북', imageUrl: '/src/assets/images/LocalImage/gyeongbuk.jpg' },
  { id: 14, name: '경남', imageUrl: '/src/assets/images/LocalImage/gyeongnam.jpg' },
  { id: 15, name: '전북', imageUrl: '/src/assets/images/LocalImage/jeonbuk.jpeg' },
  { id: 16, name: '전남', imageUrl: '/src/assets/images/LocalImage/jeonnam.jpeg' },
  { id: 17, name: '제주', imageUrl: '/src/assets/images/LocalImage/jeju.jpeg' }, //c
=======
  { id: 1, name: '서울', imageUrl: '/images/LocalImage/seoul.jpg' }, // c
  { id: 2, name: '인천', imageUrl: '/images/LocalImage/incheon.jpg' },
  { id: 3, name: '대전', imageUrl: '/images/LocalImage/daejeon.jpeg' }, // c
  { id: 4, name: '대구', imageUrl: '/images/LocalImage/daegu.jpg' },
  { id: 5, name: '광주', imageUrl: '/images/LocalImage/gwangjoo.jpeg' }, //c
  { id: 6, name: '부산', imageUrl: '/images/LocalImage/boosan.jpeg' }, //c
  { id: 7, name: '울산', imageUrl: '/images/LocalImage/ulsan.jpg' },
  { id: 8, name: '세종', imageUrl: '/images/LocalImage/saejong.jpg' },
  { id: 9, name: '경기', imageUrl: '/images/LocalImage/gyeonggi.jpg' }, //여기부터 데이터 31
  { id: 10, name: '강원', imageUrl: '/images/LocalImage/gangwon.jpg' },
  { id: 11, name: '충북', imageUrl: '/images/LocalImage/chungbuk.jpg' },
  { id: 12, name: '충남', imageUrl: '/images/LocalImage/chungnam.jpg' },
  { id: 13, name: '경북', imageUrl: '/images/LocalImage/gyeongbuk.jpg' },
  { id: 14, name: '경남', imageUrl: '/images/LocalImage/gyeongnam.jpg' },
  { id: 15, name: '전북', imageUrl: '/images/LocalImage/jeonbuk.jpeg' },
  { id: 16, name: '전남', imageUrl: '/images/LocalImage/jeonnam.jpeg' },
  { id: 17, name: '제주', imageUrl: '/images/LocalImage/jeju.jpeg' }, //c
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
])

// 페이지별 데이터 계산
const firstPage = computed(() => cities.value.slice(0, 3))
const firstPageSecondRow = computed(() => cities.value.slice(3, 6))
const secondPage = computed(() => cities.value.slice(6, 9))
const secondPageSecondRow = computed(() => cities.value.slice(9, 12))
const thirdPage = computed(() => cities.value.slice(12, 15))
const thirdPageSecondRow = computed(() => cities.value.slice(15))
</script>

<style>
/* 메인 슬라이더 관련 스타일 */
.swiper-pagination-progressbar {
  @apply hidden;
}

.swiper-slide {
  @apply h-auto;
}

/* 커스텀 프로그레스바 스타일 */
.progress-container {
  @apply flex items-center gap-4 mt-4;
}

.progress-bar {
  @apply flex-1 bg-gray-200/30 h-1 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-white transition-all duration-300 ease-in-out;
}

/* 도시 그리드 페이지네이션 스타일 */
.custom-pagination {
  @apply flex justify-center items-center; /* 마진 제거 */
}

.custom-bullet {
  @apply w-2 h-2 mx-2 rounded-full bg-gray-300 opacity-100 cursor-pointer inline-block transition-all duration-300;
}

.custom-bullet-active {
  @apply bg-black w-2 h-2; /* 활성화된 점 크기 살짝 크게 */
}

/* 기존 dot 페이지네이션 숨김 */
.swiper-pagination-bullet,
.swiper-pagination-bullet-active {
  @apply hidden;
}
</style>
