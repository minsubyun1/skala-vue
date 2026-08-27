<script setup>
import { ref } from 'vue'
import { useOpenWeatherMap } from '@/composables/useOpenWeatherMap'
import { fetchMyCity } from '@/api/ipGeolocation'
import { fetchCurrentWeather } from '@/api/openMeteo'
import { reverseGeocode } from '@/api/reverseGeocode'
import { getStatusStyle } from '@/utils/weatherStatusStyle'
import WeatherMapPanel from '@/components/handson/WeatherMapPanel.vue'

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

// 요구사항(외부 API 3개)과는 별개로 추가한 기능: 지도를 클릭하면 그 좌표의 실시간 날씨를
// Open-Meteo로 가져오고, Nominatim(OpenStreetMap) 역지오코딩으로 지명을 붙여 관심 지역에 담는다.
const interestRegions = ref([])
const isAddingRegion = ref(false)
const mapError = ref('')

async function handleMapClick({ lat, lon }) {
  isAddingRegion.value = true
  mapError.value = ''
  try {
    const [weather, name] = await Promise.all([fetchCurrentWeather(lat, lon), reverseGeocode(lat, lon)])
    interestRegions.value.push({
      id: `region_${Date.now()}`,
      lat,
      lon,
      name: name ?? `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      ...weather,
    })
  } catch {
    mapError.value = '해당 위치의 날씨 정보를 가져오지 못했습니다.'
  } finally {
    isAddingRegion.value = false
  }
}

function removeRegion(id) {
  interestRegions.value = interestRegions.value.filter((region) => region.id !== id)
}
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Axios</h2>
    <p class="note">
      OpenWeatherMap의 현재 날씨(Current Weather Data) + 5일 예보(5 Day / 3 Hour Forecast) 2개
      API와, 위치 추정용 외부 API(ipwho.is)까지 총 3개의 외부 API를 axios로 호출합니다.
    </p>

    <section class="axios-panel">
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

      <div class="map-section">
        <h3>🗺️ 지도에서 관심 지역 추가</h3>
        <p class="note">지도를 클릭하면 그 좌표의 실시간 날씨(Open-Meteo)를 가져와 관심 지역 목록에 추가합니다.</p>

        <div class="map-layout">
          <WeatherMapPanel class="map-panel" :regions="interestRegions" @map-click="handleMapClick" />

          <div class="region-sidebar">
            <p v-if="isAddingRegion" class="hint">위치 정보를 불러오는 중...</p>
            <p v-if="mapError" class="error">{{ mapError }}</p>
            <p v-if="!interestRegions.length && !isAddingRegion" class="hint">
              지도를 클릭해서 관심 지역을 추가해 보세요.
            </p>

            <TransitionGroup name="region" tag="ul" class="region-list">
              <li v-for="region in interestRegions" :key="region.id" class="region-item">
                <div>
                  <p class="region-name">{{ getStatusStyle(region.status).emoji }} {{ region.name }}</p>
                  <p class="region-meta">
                    {{ region.temp }}°C · {{ region.status }} · 습도 {{ region.humidity }}%
                  </p>
                </div>
                <button type="button" class="remove-btn" @click="removeRegion(region.id)">✕</button>
              </li>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.note {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 14px;
  line-height: 1.5;
}

.axios-panel {
  background: #0f172a;
  border-radius: 16px;
  padding: 24px;
  color: #f1f5f9;
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
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
}

.search-row button {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  cursor: pointer;
  white-space: nowrap;
}

.search-row button:hover {
  background: rgba(56, 189, 248, 0.25);
}

.error {
  color: #fca5a5;
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.current-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
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
  margin-bottom: 8px;
}

.forecast-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
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

.map-section {
  margin-top: 24px;
}

.map-section h3 {
  margin-bottom: 6px;
}

.map-section .note {
  color: rgba(241, 245, 249, 0.75);
}

.hint {
  font-size: 0.85rem;
  opacity: 0.7;
}

.map-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.map-panel {
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.region-sidebar {
  width: 260px;
  flex-shrink: 0;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 2px;
}

.region-list {
  position: relative;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.region-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 12px;
  transition: background 0.15s ease;
}

.region-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.region-name {
  font-weight: 700;
  font-size: 0.88rem;
}

.region-meta {
  font-size: 0.76rem;
  opacity: 0.75;
  margin-top: 2px;
}

.remove-btn {
  border: none;
  background: transparent;
  color: #f1f5f9;
  opacity: 0.55;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 2px 6px;
  border-radius: 6px;
  flex-shrink: 0;
}

.remove-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

.region-move,
.region-enter-active,
.region-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.region-enter-from,
.region-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.region-leave-active {
  position: absolute;
  width: 100%;
}

@media (max-width: 760px) {
  .map-layout {
    flex-direction: column;
  }

  .region-sidebar {
    width: 100%;
    max-height: none;
  }
}
</style>
