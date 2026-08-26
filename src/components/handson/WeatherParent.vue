<script setup>
import { computed, ref } from 'vue'
import WeatherScene from './WeatherScene.vue'
import WeatherDetailModal from './WeatherDetailModal.vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import AddCityForm from './AddCityForm.vue'
import LiveWeatherPanel from './LiveWeatherPanel.vue'
import NowPanel from './NowPanel.vue'
import { useLiveWeather } from '@/composables/useLiveWeather'

// 1. 모든 반응형 데이터는 WeatherParent가 유지한다 (요구사항 1)
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

const STATUS_BACKGROUND = {
  맑음: {
    image: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1600&q=75',
    headline: '맑고 화창한 하루',
  },
  구름: {
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=75',
    headline: '구름이 하늘을 가득 채웠어요',
  },
  비: {
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&w=1600&q=75',
    headline: '강한 비가 내리고 있어요',
  },
  눈: {
    image: 'https://images.unsplash.com/photo-1547754980-3df97fed72a8?auto=format&fit=crop&w=1600&q=75',
    headline: '하얀 눈이 소복소복 내려요',
  },
  안개: {
    image: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1600&q=75',
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

// 2. BaseDashboardCard, 3. SearchBar, 4. WeatherCard 에서 올라오는 이벤트 처리
function handleSelectCard(city) {
  selectedCity.value = city
}

const detailCity = ref(null)
function handleClickDetail(city) {
  detailCity.value = city
}

function handleAddCity(payload) {
  weatherList.value.push({
    id: `city_custom_${Date.now()}`,
    ...payload,
    humidity: 60,
    wind: 2.0,
  })
}

const liveWeather = useLiveWeather()
function handleLiveSearch(query) {
  liveWeather.search(query)
}

const activeStatus = computed(
  () => hoveredStatus.value || liveWeather.result.value?.status || selectedCity.value?.status || '맑음',
)
const heroBackground = computed(() => STATUS_BACKGROUND[activeStatus.value] ?? STATUS_BACKGROUND['맑음'])
const heroReadout = computed(() => {
  if (liveWeather.result.value) return { ...liveWeather.result.value, source: 'LIVE', unit: 'km/h' }
  if (selectedCity.value) return { ...selectedCity.value, source: '선택된 카드', unit: 'm/s' }
  return null
})
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Component</h2>
    <p class="note">
      💡 Weather Mockup과 기능은 완전히 동일하지만, WeatherParent(상태) /
      BaseDashboardCard(공통 카드 레이아웃) / SearchBar / WeatherCard 4개로 나누고, 추가로
      AddCityForm / LiveWeatherPanel / NowPanel까지 컴포넌트로 분리했습니다.
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

          <LiveWeatherPanel
            :is-loading="liveWeather.isLoading.value"
            :error="liveWeather.error.value"
            :result="liveWeather.result.value"
            @search="handleLiveSearch"
          />

          <!-- BaseDashboardCard(슬롯) 안에 SearchBar를 넣어도, :search-query/@update-query는
               BaseDashboardCard가 아니라 WeatherParent 스코프에서 그대로 평가된다 -->
          <BaseDashboardCard>
            <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />
          </BaseDashboardCard>

          <AddCityForm :status-options="STATUS_OPTIONS" @add-city="handleAddCity" />
        </aside>

        <div class="hero-stage">
          <Transition name="fade" mode="out-in">
            <h3 :key="heroBackground.headline" class="hero-headline">{{ heroBackground.headline }}</h3>
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

    <WeatherDetailModal :city="detailCity" @close="detailCity = null" />
  </div>
</template>

<style scoped>
.note {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 14px;
  line-height: 1.5;
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
