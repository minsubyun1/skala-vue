<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { Loader2, MapPin, Search } from 'lucide-vue-next'
import WeatherScene from './WeatherScene.vue'
import WeatherGlyph from './WeatherGlyph.vue'
import WeatherDetailModal from './WeatherDetailModal.vue'
import { useLiveWeather } from '@/composables/useLiveWeather'

// 예시 도시(서울/수원/부산)와 겹치지 않도록 다른 도시로 구성
// 습도·풍속 필드 추가
const weatherList = ref([
  { id: 'city_incheon', name: '인천', temp: 27, status: '맑음', humidity: 55, wind: 3.1 },
  { id: 'city_daejeon', name: '대전', temp: 31, status: '맑음', humidity: 40, wind: 1.8 },
  { id: 'city_gwangju', name: '광주', temp: 23, status: '비', humidity: 82, wind: 4.4 },
  { id: 'city_ulsan', name: '울산', temp: 26, status: '구름', humidity: 61, wind: 2.6 },
  { id: 'city_jeju', name: '제주', temp: 19, status: '안개', humidity: 88, wind: 5.2 },
  { id: 'city_gangneung', name: '강릉', temp: 4, status: '눈', humidity: 70, wind: 3.9 },
  { id: 'city_jeonju', name: '전주', temp: 22, status: '구름', humidity: 58, wind: 2.1 },
  { id: 'city_pohang', name: '포항', temp: 29, status: '비', humidity: 76, wind: 6.0 },
])

const STATUS_OPTIONS = ['맑음', '구름', '비', '눈', '안개']

// 날씨 상태별 배경 이미지 (Unsplash 직링크), 링크별 이미지 내용 확인 후 적용
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

// v-model 대신 :value + @input 수동 바인딩 (과제 요구사항)
const searchQuery = ref('')
function updateSearchQuery(event) {
  searchQuery.value = event.target.value
}

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

// watchEffect로 검색어 변경 감지 및 로그 출력
watchEffect(() => {
  console.log(
    `[watchEffect] 검색어 "${searchQuery.value}" → ${filteredWeatherList.value.length}개 도시 표시 중`,
  )
})

// 이름 마지막 글자 받침 유무에 따른 조사(이/가) 처리
// "부산이" / "여수가" 처럼 받침 여부에 따라 결과가 달라짐
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

function selectCity(city) {
  selectedCity.value = city
}

// 상세보기 버튼 클릭 시 카드 클릭 이벤트 전파 방지 (.stop)
// alert 대신 모달 컴포넌트로 표시
const detailCity = ref(null)
function showDetail(city) {
  detailCity.value = city
}

// 선택 도시 변경 감지 (watch), 이전/이후 값 함께 로깅
watch(selectedCity, (next, prev) => {
  if (!next) return
  console.log(`[watch] 선택된 도시: ${prev?.name ?? '(없음)'} → ${next.name}`)
})

// 도시 추가 기능 (하드코딩 데이터 외 런타임 확장)
const newCity = ref({ name: '', temp: 20, status: '맑음' })
function addCity() {
  const name = newCity.value.name.trim()
  if (!name) return
  weatherList.value.push({
    id: `city_custom_${Date.now()}`,
    name,
    temp: Number(newCity.value.temp),
    status: newCity.value.status,
    humidity: 60,
    wind: 2.0,
  })
  newCity.value = { name: '', temp: 20, status: '맑음' }
}

// 실시간 날씨 API 연동 (Open-Meteo, API Key 불필요)
const liveQuery = ref('')
const liveWeather = useLiveWeather()

function searchLiveWeather() {
  liveWeather.search(liveQuery.value)
}

// 배경(three.js + 사진) 표시 우선순위: hover 카드 > 실시간 조회 결과 > 선택 카드
const activeStatus = computed(
  () =>
    hoveredStatus.value || liveWeather.result.value?.status || selectedCity.value?.status || '맑음',
)
const heroBackground = computed(
  () => STATUS_BACKGROUND[activeStatus.value] ?? STATUS_BACKGROUND['맑음'],
)

// 상단 요약 패널, 실시간 조회 결과 우선 표시
const heroReadout = computed(() => {
  if (liveWeather.result.value) return { ...liveWeather.result.value, source: 'LIVE', unit: 'km/h' }
  if (selectedCity.value) return { ...selectedCity.value, source: '선택된 카드', unit: 'm/s' }
  return null
})

// 카드 호버 시 커서 위치 기반 3D 틸트 효과
function handleTilt(event) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const relX = (event.clientX - rect.left) / rect.width - 0.5
  const relY = (event.clientY - rect.top) / rect.height - 0.5
  card.style.transform = `perspective(700px) rotateX(${relY * -8}deg) rotateY(${relX * 8}deg) translateY(-4px) scale(1.02)`
}
function resetTilt(event) {
  event.currentTarget.style.transform = ''
}
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Mockup</h2>

    <section class="hero" @mouseleave="hoveredStatus = ''">
      <Transition name="photo-fade">
        <img :key="heroBackground.image" :src="heroBackground.image" class="hero-photo" alt="" />
      </Transition>
      <div class="hero-scrim"></div>
      <WeatherScene :status="activeStatus" />

      <div class="hero-grid">
        <aside class="hero-sidebar">
          <Transition name="fade" mode="out-in">
            <div v-if="heroReadout" :key="heroReadout.id" class="now-panel">
              <WeatherGlyph :status="heroReadout.status" :size="48" />
              <div class="now-info">
                <p class="now-name">
                  {{ heroReadout.name }}
                  <span v-if="heroReadout.source === 'LIVE'" class="live-badge">LIVE</span>
                  <span v-else class="now-source">{{ heroReadout.source }}</span>
                </p>
                <p class="now-temp">{{ heroReadout.temp }}°C</p>
                <p class="now-meta">
                  {{ heroReadout.status }} · 습도 {{ heroReadout.humidity }}% · 풍속
                  {{ heroReadout.wind }}{{ heroReadout.unit }}
                </p>
              </div>
            </div>
            <div v-else class="now-panel now-placeholder">
              <WeatherGlyph status="맑음" :size="40" />
              <p>카드를 클릭하거나 실시간 검색을 해보면 여기에 요약이 표시됩니다.</p>
            </div>
          </Transition>

          <div class="live-panel">
            <p class="live-title"><MapPin :size="16" /> 실시간 날씨 조회</p>
            <form class="live-form" @submit.prevent="searchLiveWeather">
              <input
                v-model="liveQuery"
                type="text"
                placeholder="도시 이름 (서울, Tokyo, London...)"
              />
              <button type="submit" :disabled="liveWeather.isLoading.value">
                <Loader2 v-if="liveWeather.isLoading.value" :size="16" class="spin" />
                <Search v-else :size="16" />
              </button>
            </form>

            <p v-if="liveWeather.error.value" class="live-error">{{ liveWeather.error.value }}</p>

            <article
              v-if="liveWeather.result.value"
              class="weather-card live-card"
              @mouseenter="hoveredStatus = liveWeather.result.value.status"
            >
              <div class="card-top">
                <span class="city-name">
                  <span class="live-badge">LIVE</span>
                  {{ liveWeather.result.value.name }}
                  <small>{{ liveWeather.result.value.country }}</small>
                </span>
                <span class="status-icon">
                  <WeatherGlyph :status="liveWeather.result.value.status" :size="18" />
                </span>
              </div>
              <p class="temp">{{ liveWeather.result.value.temp }}°C</p>
              <p class="meta">
                습도 {{ liveWeather.result.value.humidity }}% · 풍속
                {{ liveWeather.result.value.wind }}km/h
              </p>
            </article>
          </div>

          <div class="search-row">
            <label class="search-label">🔍 도시 검색 (실습 데이터)</label>
            <input
              :value="searchQuery"
              @input="updateSearchQuery"
              type="text"
              placeholder="검색할 도시 이름 입력"
            />
            <p class="search-hint">검색 중인 도시: {{ searchQuery || '전체' }}</p>
          </div>

          <form class="add-city" @submit.prevent="addCity">
            <p class="add-city-title">➕ 나만의 도시 추가하기</p>
            <input v-model="newCity.name" type="text" placeholder="도시 이름" required />
            <div class="add-city-row">
              <input v-model.number="newCity.temp" type="number" placeholder="기온(°C)" />
              <select v-model="newCity.status">
                <option v-for="status in STATUS_OPTIONS" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
            <button type="submit">추가</button>
          </form>
        </aside>

        <div class="hero-stage">
          <Transition name="fade" mode="out-in">
            <h3 :key="heroBackground.headline" class="hero-headline">
              {{ heroBackground.headline }}
            </h3>
          </Transition>

          <TransitionGroup name="card" tag="div" class="card-grid">
            <article
              v-for="city in filteredWeatherList"
              :key="city.id"
              class="weather-card"
              @click="selectCity(city)"
              @mouseenter="hoveredStatus = city.status"
              @mousemove="handleTilt"
              @mouseleave="resetTilt"
            >
              <div class="card-top">
                <span class="city-name">{{ city.name }}</span>
                <span class="status-icon">
                  <WeatherGlyph :status="city.status" />
                  {{ city.status }}
                </span>
              </div>
              <p class="temp">현재 기온: {{ city.temp }}°C</p>
              <p class="meta">습도 {{ city.humidity }}% · 풍속 {{ city.wind }}m/s</p>

              <p v-if="city.temp >= 30" class="badge badge-hot">🔥 폭염 (30도 이상)</p>
              <p v-else-if="city.temp >= 25" class="badge badge-warm">🌡️ 더움 (25도 이상)</p>
              <p v-else-if="city.temp >= 18" class="badge badge-cool">🍃 선선함 (18~24도)</p>
              <p v-else class="badge badge-cold">🧊 쌀쌀함 (18도 미만)</p>

              <button class="detail-btn" @click.stop="showDetail(city)">상세보기</button>
            </article>

            <p v-if="filteredWeatherList.length === 0" key="empty" class="empty">
              검색 결과가 없습니다.
            </p>
          </TransitionGroup>

          <p class="status-bar">{{ statusMessage }}</p>
        </div>
      </div>
    </section>

    <WeatherDetailModal :city="detailCity" @close="detailCity = null" />
  </div>
</template>

<style scoped>
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

.now-panel {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 16px 18px;
  min-height: 84px;
}

.now-placeholder {
  color: rgba(241, 245, 249, 0.6);
  font-size: 0.85rem;
}

.now-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 700;
}

.now-source {
  font-size: 0.68rem;
  font-weight: 400;
  opacity: 0.6;
}

.now-temp {
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.15;
}

.now-meta {
  font-size: 0.8rem;
  opacity: 0.75;
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

.spin {
  animation: glyph-spin 1s linear infinite;
}

@keyframes glyph-spin {
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
  border-color: rgba(255, 209, 102, 0.6) !important;
  cursor: default;
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

.city-name small {
  opacity: 0.6;
  font-weight: 400;
  margin-left: 4px;
}

.search-row {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 14px;
}

.search-label {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 6px;
  opacity: 0.85;
}

.search-row input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
}

.search-hint {
  margin-top: 6px;
  font-size: 0.75rem;
  opacity: 0.7;
}

.card-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.weather-card {
  cursor: pointer;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  padding: 16px;
  transform-style: preserve-3d;
  will-change: transform;
  transition:
    transform 0.12s ease-out,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.weather-card:hover {
  border-color: #ffd166;
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.5);
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

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 6px;
}

.city-name {
  display: flex;
  align-items: center;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 400;
  font-size: 0.85rem;
}

.temp {
  font-size: 1.1rem;
  margin-bottom: 2px;
}

.meta {
  font-size: 0.8rem;
  opacity: 0.75;
  margin-bottom: 10px;
}

.badge {
  display: inline-block;
  font-size: 0.78rem;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
}

.badge-hot {
  background: #ef4444;
}
.badge-warm {
  background: #f97316;
}
.badge-cool {
  background: #38bdf8;
  color: #0f172a;
}
.badge-cold {
  background: #60a5fa;
  color: #0f172a;
}

.detail-btn {
  display: block;
  width: 100%;
  padding: 6px 0;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  cursor: pointer;
}

.detail-btn:hover {
  border-color: #ffd166;
  color: #ffd166;
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

.add-city {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 12px 14px;
}

.add-city-title {
  font-size: 0.8rem;
  opacity: 0.85;
}

.add-city-row {
  display: flex;
  gap: 8px;
}

.add-city input,
.add-city select {
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
  min-width: 0;
}

.add-city input[type='text'] {
  width: 100%;
}

.add-city-row input {
  flex: 1;
}

.add-city button {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #ffd166;
  background: transparent;
  color: #ffd166;
  cursor: pointer;
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
</style>
