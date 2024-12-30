<!-- components/course/CourseMap.vue -->
<template>
  <div class="relative w-full h-[200px] px-2">
    <!-- 지도가 표시될 영역 -->
    <div ref="mapContainer" class="w-full h-full rounded-lg"></div>

    <!-- 줌 컨트롤 -->
    <div class="absolute top-4 right-4 bg-white rounded-lg shadow-md">
      <button @click="zoomIn" class="p-2 hover:bg-gray-100 border-b" aria-label="확대">
        <span class="text-xl">+</span>
      </button>
      <button @click="zoomOut" class="p-2 hover:bg-gray-100" aria-label="축소">
        <span class="text-xl">-</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  places: {
    type: Array,
    required: true,
  },
  selectedPlace: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['place-select'])

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const polyline = ref(null)

// 마커 이미지 설정
const createMarkerImage = (index) => {
  return {
    src: `/assets/images/markers/marker${index + 1}.png`, // 마커 이미지 경로
    size: new window.kakao.maps.Size(30, 35),
    options: {
      offset: new window.kakao.maps.Point(15, 35),
    },
  }
}

// 지도 초기화
const initMap = () => {
  if (!window.kakao || !window.kakao.maps) {
    console.error('Kakao Maps API is not loaded')
    return
  }
  const defaultCenter = new window.kakao.maps.LatLng(37.5666805, 126.9784147)
  // 초기 중심 좌표 설정 (첫 번째 장소 또는 기본 좌표)
  const initialCenter =
    props.places && props.places.length > 0 && props.places[0].latitude && props.places[0].longitude
      ? new window.kakao.maps.LatLng(props.places[0].latitude, props.places[0].longitude)
      : defaultCenter

  const options = {
    center: initialCenter,
    level: 3,
  }

  // ref를 사용하여 DOM 요소 접근
  if (mapContainer.value) {
    map.value = new window.kakao.maps.Map(mapContainer.value, options)
  }
}

// 마커와 경로 그리기
const drawMarkersAndPath = () => {
  if (!map.value || !props.places || !props.places.length) return

  markers.value.forEach((marker) => marker.setMap(null))
  if (polyline.value) polyline.value.setMap(null)

  markers.value = []
  const linePath = []

  props.places.forEach((place, index) => {
    const position = new window.kakao.maps.LatLng(place.latitude, place.longitude)
    linePath.push(position)

    // 기본 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
      // image 속성을 제거하여 기본 마커 사용
    })

    window.kakao.maps.event.addListener(marker, 'click', () => {
      emit('place-select', place)
    })

    marker.setMap(map.value)
    markers.value.push(marker)
  })

  // 경로 선 그리기
  polyline.value = new window.kakao.maps.Polyline({
    path: linePath,
    strokeWeight: 5,
    strokeColor: '#EB5E3C',
    strokeOpacity: 1,
    strokeStyle: 'solid',
  })

  polyline.value.setMap(map.value)

  // 모든 마커가 보이도록 지도 범위 조정
  if (markers.value.length > 0) {
    const bounds = new window.kakao.maps.LatLngBounds()
    markers.value.forEach((marker) => bounds.extend(marker.getPosition()))
    map.value.setBounds(bounds)
  }
}

// 줌 컨트롤 함수
const zoomIn = () => {
  if (map.value) {
    map.value.setLevel(map.value.getLevel() - 1)
  }
}

const zoomOut = () => {
  if (map.value) {
    map.value.setLevel(map.value.getLevel() + 1)
  }
}

// 카카오맵 스크립트 로드 확인
const waitForKakaoMaps = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
    } else {
      const check = () => {
        if (window.kakao && window.kakao.maps) {
          resolve()
        } else {
          setTimeout(check, 100)
        }
      }
      check()
    }
  })
}

// 선택된 장소 변경 시 해당 마커 강조
watch(
  () => props.selectedPlace,
  (newPlace) => {
    if (!newPlace || !map.value) return

    const position = new window.kakao.maps.LatLng(newPlace.latitude, newPlace.longitude)
    map.value.panTo(position)
  },
)

// places 데이터가 변경될 때마다 마커와 경로 다시 그리기

// 컴포넌트 마운트 시 지도 초기화
onMounted(async () => {
  try {
    await waitForKakaoMaps()
    await initMap()

    if (props.places && props.places.length > 0) {
      drawMarkersAndPath()
    }
  } catch (error) {
    console.error('Failed to initialize map:', error)
  }
})

watch(
  () => props.places,
  (newPlaces) => {
    if (map.value && newPlaces && newPlaces.length > 0) {
      drawMarkersAndPath()
    }
  },
  { deep: true },
)
</script>
