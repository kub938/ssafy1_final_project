<template>
  <div class="city-grid">
    <router-link
      :to="{
<<<<<<< HEAD
        name: 'CourseList',
=======
        name: 'CourseListByCity',
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
        params: { cityId: cityData.id },
      }"
      class="city-block"
    >
      <div
        class="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg"
        :style="{
          backgroundImage: `url(${cityData.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-40 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
        >
          <span class="text-white font-bold text-center korean-font">
            {{ cityData.name }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  cityData: {
    type: Object,
    required: true,
    validator: (prop) => {
      return prop.id !== undefined && prop.name !== undefined && prop.imageUrl !== undefined
    },
  },
})
</script>

<style scoped>
.city-block {
  @apply block w-full cursor-pointer transition-all duration-300 ease-in-out;
}

.city-block:hover {
  @apply transform scale-105;
  filter: brightness(1.1);
}

.korean-font {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-family: 'Nanum Gothic Coding', monospace;
  font-weight: 800; /* 볼드체 */
  letter-spacing: 0.005em;
}

/* 그리드 레이아웃을 위한 스타일 */
.city-grid {
  @apply p-2;
}

/* 반응형 조정 */
@media (max-width: 640px) {
  .korean-font {
    font-size: clamp(1.25rem, 3.5vw, 2rem);
  }
}
</style>
