<script setup>
import { ref } from 'vue'
import { useOpenWeatherMap } from '@/composables/useOpenWeatherMap'
import { fetchMyCity } from '@/api/ipGeolocation'

const cityInput = ref('')
const owm = useOpenWeatherMap()

const isLocating = ref(false)
const locateError = ref('')

function handleSearch() {
  owm.search(cityInput.value)
}

// API 3 (기타 외부 API): 브라우저의 공인 IP로 도시를 추정해서 바로 검색해준다.
async function handleLocateMe() {
  isLocating.value = true
  locateError.value = ''
  try {
    const { city } = await fetchMyCity()
    cityInput.value = city
    await owm.search(city)
  } catch (error) {
    locateError.value = error.message
  } finally {
    isLocating.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Axios</h2>
    <p class="note">
      OpenWeatherMap의 현재 날씨(Current Weather Data) + 5일 예보(5 Day / 3 Hour Forecast) 2개
      API와, 위치 추정용 외부 API(ipwho.is)까지 총 3개의 외부 API를 axios로 호출합니다.
    </p>

    <form class="search-row" @submit.prevent="handleSearch">
      <input v-model="cityInput" type="text" placeholder="도시 이름 (예: Seoul, Tokyo)" />
      <button type="submit" :disabled="owm.isLoading.value">조회</button>
      <button type="button" :disabled="isLocating" @click="handleLocateMe">
        {{ isLocating ? '위치 확인 중...' : '📍 내 위치로 조회' }}
      </button>
    </form>

    <p v-if="locateError" class="error">{{ locateError }}</p>
    <p v-if="owm.error.value" class="error">{{ owm.error.value }}</p>

    <div v-if="owm.current.value" class="current-card">
      <img
        :src="`https://openweathermap.org/img/wn/${owm.current.value.icon}@2x.png`"
        :alt="owm.current.value.description"
      />
      <div>
        <h3>{{ owm.current.value.name }}, {{ owm.current.value.country }}</h3>
        <p class="temp">{{ owm.current.value.temp }}°C</p>
        <p class="desc">{{ owm.current.value.description }} · 체감 {{ owm.current.value.feelsLike }}°C</p>
        <p class="meta">습도 {{ owm.current.value.humidity }}% · 풍속 {{ owm.current.value.wind }}m/s</p>
      </div>
    </div>

    <div v-if="owm.forecast.value.length" class="forecast-row">
      <div v-for="day in owm.forecast.value" :key="day.date" class="forecast-card">
        <p class="date">{{ day.date.slice(5) }}</p>
        <img :src="`https://openweathermap.org/img/wn/${day.icon}.png`" :alt="day.description" />
        <p class="temp">{{ day.temp }}°C</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 14px;
  line-height: 1.5;
}

.search-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.search-row input {
  flex: 1;
  min-width: 180px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
}

.search-row button {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border-hover);
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
}

.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.current-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  max-width: 420px;
}

.current-card img {
  width: 64px;
  height: 64px;
}

.current-card .temp {
  font-size: 1.8rem;
  font-weight: 800;
}

.current-card .desc {
  font-size: 0.9rem;
  opacity: 0.85;
}

.current-card .meta {
  font-size: 0.8rem;
  opacity: 0.7;
}

.forecast-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.forecast-card {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
  min-width: 90px;
}

.forecast-card .date {
  font-size: 0.75rem;
  opacity: 0.7;
}

.forecast-card img {
  width: 40px;
  height: 40px;
}

.forecast-card .temp {
  font-weight: 700;
}
</style>
