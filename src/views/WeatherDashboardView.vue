<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import WeatherScene from '@/components/handson/WeatherScene.vue'
import WeatherGlyph from '@/components/handson/WeatherGlyph.vue'
import NowPanel from '@/components/handson/NowPanel.vue'
import WeatherRouterNav from '@/components/handson/WeatherRouterNav.vue'
import WeatherMapPanel from '@/components/handson/WeatherMapPanel.vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import AddCityForm from '@/components/handson/AddCityForm.vue'
import { Loader2, MapPin, Search } from 'lucide-vue-next'
import { weatherMockData } from '@/data/weatherMockData'
import { useOpenWeatherMap } from '@/composables/useOpenWeatherMap'
import { fetchMyCity } from '@/api/ipGeolocation'
import { fetchCurrentWeather } from '@/api/openMeteo'
import { reverseGeocode } from '@/api/reverseGeocode'

const router = useRouter()

// 카드 그리드는 핸즈온 4(Weather Router/Store)와 같은 목데이터를 씀
const weatherList = ref([...weatherMockData])
const STATUS_OPTIONS = ['맑음', '구름', '비', '눈', '안개']

const STATUS_BACKGROUND = {
  맑음: {
    image:
      'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1600&q=75',
    headline: '맑고 화창한 하루',
  },
  구름: {
    image:
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=75',
    headline: '구름이 하늘을 가득 채웠어요',
  },
  비: {
    image:
      'https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&w=1600&q=75',
    headline: '강한 비가 내리고 있어요',
  },
  눈: {
    image:
      'https://images.unsplash.com/photo-1547754980-3df97fed72a8?auto=format&fit=crop&w=1600&q=75',
    headline: '하얀 눈이 소복소복 내려요',
  },
  안개: {
    image:
      'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1600&q=75',
    headline: '짙은 안개가 시야를 가려요',
  },
}

const searchQuery = ref('')
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

function withSubjectParticle(name) {
  const lastChar = name.charCodeAt(name.length - 1) - 0xac00
  const hasBatchim = lastChar >= 0 && lastChar <= 11171 && lastChar % 28 !== 0
  return `${name}${hasBatchim ? '이' : '가'}`
}

const selectedCity = ref(null)
const hoveredStatus = ref('')
const statusMessage = computed(() => {
  if (!selectedCity.value) return '카드를 클릭하거나 검색해 보세요.'
  return `${withSubjectParticle(selectedCity.value.name)} 선택되었습니다.`
})

function handleSelectCard(city) {
  selectedCity.value = city
}

// 상세보기는 핸즈온 4에서 만든 라우트를 그대로 재사용한다 (같은 목데이터를 id로 조회).
function handleClickDetail(city) {
  router.push(`/handson/weather-router/weather/${city.id}`)
}

function handleAddCity(payload) {
  weatherList.value.push({
    id: `city_custom_${Date.now()}`,
    ...payload,
    humidity: 60,
    wind: 2.0,
  })
}

// 실시간 검색(OpenWeatherMap)과 지도 클릭 결과를 같은 관심 지역 목록으로 합친다.
const cityInput = ref('')
const owm = useOpenWeatherMap()
const isLocating = ref(false)
const locateError = ref('')

const interestRegions = ref([])
const isAddingRegion = ref(false)
const mapError = ref('')

function upsertRegion(data) {
  const existing = interestRegions.value.find((region) => region.name === data.name)
  if (existing) {
    Object.assign(existing, data)
  } else {
    interestRegions.value.push({ id: `region_${Date.now()}`, ...data })
  }
}

async function performSearch(city) {
  await owm.search(city)
  if (owm.current.value) {
    upsertRegion({
      lat: owm.current.value.lat,
      lon: owm.current.value.lon,
      name: owm.current.value.name,
      temp: owm.current.value.temp,
      status: owm.current.value.status,
      humidity: owm.current.value.humidity,
      wind: owm.current.value.wind,
    })
  }
}

function handleLiveSearch() {
  performSearch(cityInput.value)
}

async function handleLocateMe() {
  isLocating.value = true
  locateError.value = ''
  try {
    const { city } = await fetchMyCity()
    cityInput.value = city
    await performSearch(city)
  } catch (error) {
    locateError.value = error.message
  } finally {
    isLocating.value = false
  }
}

async function handleMapClick({ lat, lon }) {
  isAddingRegion.value = true
  mapError.value = ''
  try {
    const [weather, name] = await Promise.all([fetchCurrentWeather(lat, lon), reverseGeocode(lat, lon)])
    upsertRegion({ lat, lon, name: name ?? `${lat.toFixed(2)}, ${lon.toFixed(2)}`, ...weather })
  } catch {
    mapError.value = '해당 위치의 날씨 정보를 가져오지 못했습니다.'
  } finally {
    isAddingRegion.value = false
  }
}

function removeRegion(id) {
  interestRegions.value = interestRegions.value.filter((region) => region.id !== id)
}

const activeStatus = computed(
  () => hoveredStatus.value || owm.current.value?.status || selectedCity.value?.status || '맑음',
)
const heroBackground = computed(
  () => STATUS_BACKGROUND[activeStatus.value] ?? STATUS_BACKGROUND['맑음'],
)
const heroReadout = computed(() => {
  if (owm.current.value) return { ...owm.current.value, source: 'LIVE', unit: 'm/s' }
  if (selectedCity.value) return { ...selectedCity.value, source: '선택된 카드', unit: 'm/s' }
  return null
})
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Dashboard (통합)</h2>
    <div class="nav-row">
      <WeatherRouterNav />
      <UnitToggler />
    </div>
    <p class="note">
      핸즈온 1(Weather Mockup)의 디자인 위에, Router 이동(<code>router.push</code>), Pinia 단위
      전환, Element Plus 컴포넌트, OpenWeatherMap·ipwho.is·Open-Meteo·Nominatim 외부 API, Leaflet
      지도까지 지금까지 만든 핸즈온 기능을 한 화면에 모았습니다.
    </p>

    <section class="hero" @mouseleave="hoveredStatus = ''">
      <Transition name="photo-fade">
        <img :key="heroBackground.image" :src="heroBackground.image" class="hero-photo" alt="" />
      </Transition>
      <div class="hero-scrim"></div>
      <WeatherScene :status="activeStatus" />

      <div class="hero-grid">
        <aside class="hero-sidebar">
          <NowPanel :readout="heroReadout" />

          <div class="live-panel">
            <p class="live-title"><MapPin :size="16" /> 실시간 날씨 조회 (OpenWeatherMap)</p>
            <div class="live-form">
              <input
                v-model="cityInput"
                type="text"
                placeholder="도시 이름 (서울, Tokyo, London...)"
                @keyup.enter="handleLiveSearch"
              />
              <button type="button" :disabled="owm.isLoading.value" @click="handleLiveSearch">
                <Loader2 v-if="owm.isLoading.value" :size="16" class="spin" />
                <Search v-else :size="16" />
              </button>
            </div>
            <button
              type="button"
              class="locate-btn"
              :disabled="isLocating"
              @click="handleLocateMe"
            >
              {{ isLocating ? '위치 확인 중...' : '📍 내 위치로 조회' }}
            </button>

            <p v-if="owm.error.value" class="live-error">{{ owm.error.value }}</p>
            <p v-if="locateError" class="live-error">{{ locateError }}</p>

            <div v-if="owm.current.value" class="live-card">
              <div class="card-top">
                <span class="city-name">
                  <span class="live-badge">LIVE</span>
                  {{ owm.current.value.name }}
                  <small>{{ owm.current.value.country }}</small>
                </span>
                <WeatherGlyph :status="owm.current.value.status" :size="18" />
              </div>
              <p class="temp">{{ owm.current.value.temp }}°C</p>
              <p class="meta">
                {{ owm.current.value.description }} · 체감 {{ owm.current.value.feelsLike }}°C
              </p>
              <p class="meta">
                습도 {{ owm.current.value.humidity }}% · 풍속 {{ owm.current.value.wind }}m/s
              </p>
            </div>
          </div>

          <BaseDashboardCard>
            <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />
          </BaseDashboardCard>

          <AddCityForm :status-options="STATUS_OPTIONS" @add-city="handleAddCity" />
        </aside>

        <div class="hero-stage">
          <Transition name="fade" mode="out-in">
            <h3 :key="heroBackground.headline" class="hero-headline">
              {{ heroBackground.headline }}
            </h3>
          </Transition>

          <BaseDashboardCard title="📍 지역별 날씨 현황">
            <TransitionGroup name="card" tag="div" class="card-grid">
              <WeatherCard
                v-for="city in filteredWeatherList"
                :key="city.id"
                :city="city"
                @select-card="handleSelectCard"
                @click-detail="handleClickDetail"
              />
              <p v-if="filteredWeatherList.length === 0" key="empty" class="empty">
                검색 결과가 없습니다.
              </p>
            </TransitionGroup>
          </BaseDashboardCard>

          <p class="status-bar">{{ statusMessage }}</p>
        </div>
      </div>
    </section>

    <section class="map-panel-section">
      <h3>🗺️ 지도에서 관심 지역 추가</h3>
      <p class="note">
        위 실시간 검색 결과와 지도 클릭 결과가 같은 목록에 모입니다. 좌표는 Open-Meteo, 지명은
        Nominatim으로 가져옵니다.
      </p>

      <div class="map-layout">
        <WeatherMapPanel class="leaflet-panel" :regions="interestRegions" @map-click="handleMapClick" />

        <div class="region-sidebar">
          <p v-if="isAddingRegion" class="hint">위치 정보를 불러오는 중...</p>
          <p v-if="mapError" class="live-error">{{ mapError }}</p>
          <p v-if="!interestRegions.length && !isAddingRegion" class="hint">
            검색하거나 지도를 클릭해서 관심 지역을 추가해 보세요.
          </p>

          <TransitionGroup name="region" tag="ul" class="region-list">
            <li v-for="region in interestRegions" :key="region.id" class="region-item">
              <div>
                <p class="region-name">
                  <WeatherGlyph :status="region.status" :size="16" /> {{ region.name }}
                </p>
                <p class="region-meta">
                  {{ region.temp }}°C · {{ region.status }} · 습도 {{ region.humidity }}%
                </p>
              </div>
              <button type="button" class="remove-btn" @click="removeRegion(region.id)">✕</button>
            </li>
          </TransitionGroup>
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

.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #0f172a;
  min-height: 720px;
}

.hero-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-fade-enter-active,
.photo-fade-leave-active {
  transition: opacity 0.6s ease;
}
.photo-fade-enter-from,
.photo-fade-leave-to {
  opacity: 0;
}
.photo-fade-leave-active {
  position: absolute;
  inset: 0;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    rgba(2, 6, 23, 0.94) 0%,
    rgba(2, 6, 23, 0.75) 32%,
    rgba(2, 6, 23, 0.35) 65%,
    rgba(2, 6, 23, 0.55) 100%
  );
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  min-height: 720px;
  color: #f1f5f9;
}

.hero-sidebar {
  width: 320px;
  flex-shrink: 0;
  background: rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.hero-stage {
  flex: 1;
  min-width: 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-headline {
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 800;
  line-height: 1.25;
  max-width: 34ch;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.55);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.live-panel {
  background: rgba(255, 209, 102, 0.08);
  border: 1px solid rgba(255, 209, 102, 0.3);
  border-radius: 12px;
  padding: 14px;
}

.live-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  margin-bottom: 8px;
  color: #ffd166;
}

.live-form {
  display: flex;
  gap: 8px;
}

.live-form input {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
}

.live-form button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ffd166;
  background: rgba(255, 209, 102, 0.15);
  color: #ffd166;
  cursor: pointer;
}

.live-form button:disabled {
  opacity: 0.6;
  cursor: progress;
}

.locate-btn {
  width: 100%;
  margin-top: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #f1f5f9;
  font-size: 0.8rem;
  cursor: pointer;
}

.locate-btn:disabled {
  opacity: 0.6;
  cursor: progress;
}

.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.live-error {
  margin-top: 10px;
  font-size: 0.78rem;
  color: #fca5a5;
}

.live-card {
  margin-top: 10px;
  border: 1px solid rgba(255, 209, 102, 0.6);
  border-radius: 10px;
  padding: 10px 12px;
  background: rgba(15, 23, 42, 0.55);
}

.live-badge {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  background: #ffd166;
  color: #1e293b;
  margin-right: 6px;
  vertical-align: middle;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 6px;
}

.city-name small {
  opacity: 0.6;
  font-weight: 400;
  margin-left: 4px;
}

.temp {
  font-size: 1.1rem;
}

.meta {
  font-size: 0.8rem;
  opacity: 0.75;
}

.card-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.card-move,
.card-enter-active,
.card-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(12px);
}
.card-leave-active {
  position: absolute;
}

.empty {
  opacity: 0.7;
  padding: 20px 0;
}

.status-bar {
  margin-top: auto;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.18);
  border: 1px solid rgba(74, 222, 128, 0.4);
  font-size: 0.9rem;
  width: fit-content;
}

.map-panel-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 24px;
  color: #f1f5f9;
  margin-top: 20px;
}

.map-panel-section .note {
  color: rgba(241, 245, 249, 0.75);
}

.map-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.leaflet-panel {
  flex: 1;
  min-width: 0;
  min-height: 360px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.region-sidebar {
  width: 260px;
  flex-shrink: 0;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 2px;
}

.hint {
  font-size: 0.85rem;
  opacity: 0.7;
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
  display: flex;
  align-items: center;
  gap: 6px;
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

@media (max-width: 860px) {
  .hero-grid {
    flex-direction: column;
  }
  .hero-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 760px) {
  .map-layout {
    flex-direction: column;
  }
  .leaflet-panel {
    width: 100%;
  }
  .region-sidebar {
    width: 100%;
    max-height: none;
  }
}
</style>
