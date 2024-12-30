<template>
  <div class="profile-container">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="profile" class="profile-data">
      <pre>{{ profile }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

<<<<<<< HEAD
=======
const api_url = 'https://tripggukgguk.site/api'
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
const profile = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchProfile = async () => {
  loading.value = true
  error.value = null

  try {
<<<<<<< HEAD
    const response = await axios.get('http://localhost:8080/api/users/me', {
=======
    const response = await axios.get(api_url + '/users/me', {
>>>>>>> 54e8a26b20a2228b0dfacf1381928bf8acb32401
      withCredentials: true, // 쿠키 전송을 위해 필요
    })

    if (response.data.success) {
      profile.value = response.data.data
    }
  } catch (err) {
    console.error('Profile fetch error:', err)
    error.value = '프로필을 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-data {
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
