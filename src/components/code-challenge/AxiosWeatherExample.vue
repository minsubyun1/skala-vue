<script setup>
import { ref } from 'vue'
import axios from 'axios'

const temperature = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

// API Key가 필요 없는 Open-Meteo로 axios 기본 사용법(GET + params)을 확인한다.
async function fetchSeoulWeather() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: 37.5665,
        longitude: 126.978,
        current: 'temperature_2m',
      },
    })
    temperature.value = data.current.temperature_2m
  } catch {
    errorMessage.value = '날씨 정보를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>Axios Weather Example</h2>

    <button :disabled="isLoading" @click="fetchSeoulWeather">
      {{ isLoading ? '조회 중...' : '서울 현재 기온 조회' }}
    </button>

    <p v-if="temperature !== null">서울 현재 기온: {{ temperature }}°C</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.error {
  color: #ef4444;
}
</style>
