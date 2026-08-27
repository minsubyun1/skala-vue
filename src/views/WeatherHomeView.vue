<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import WeatherScene from '@/components/handson/WeatherScene.vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import AddCityForm from '@/components/handson/AddCityForm.vue'
import LiveWeatherPanel from '@/components/handson/LiveWeatherPanel.vue'
import NowPanel from '@/components/handson/NowPanel.vue'
import WeatherRouterNav from '@/components/handson/WeatherRouterNav.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import { weatherMockData } from '@/data/weatherMockData'
import { useLiveWeather } from '@/composables/useLiveWeather'

const router = useRouter()

// WeatherParent(핸즈온 3)와 거의 동일한 상태. 목데이터는 WeatherDetailView와 같이 쓰는
// 공용 모듈(weatherMockData)에서 초기값을 가져온다.
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

// 요구사항 3: 상세보기는 모달/alert 대신 Programmatic Navigation으로 처리한다.
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

const liveWeather = useLiveWeather()
function handleLiveSearch(query) {
  liveWeather.search(query)
}

const activeStatus = computed(
  () =>
    hoveredStatus.value || liveWeather.result.value?.status || selectedCity.value?.status || '맑음',
)
const heroBackground = computed(
  () => STATUS_BACKGROUND[activeStatus.value] ?? STATUS_BACKGROUND['맑음'],
)
const heroReadout = computed(() => {
  if (liveWeather.result.value) return { ...liveWeather.result.value, source: 'LIVE', unit: 'km/h' }
  if (selectedCity.value) return { ...selectedCity.value, source: '선택된 카드', unit: 'm/s' }
  return null
})
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Router / Store / UI Library</h2>
    <div class="nav-row">
      <WeatherRouterNav />
      <UnitToggler />
    </div>
    <p class="note">
      핸즈온 3(WeatherParent)을 그대로 가져오되, 상세보기 버튼을 모달 대신
      <code>router.push('/handson/weather-router/weather/' + city.id)</code>로 바꿨습니다. 온도·풍속
      단위는 오른쪽 토글(<code>stores/configStore.js</code>)로 전환됩니다. 핸즈온 7(Weather UI
      Library)에서는 이 화면을 포함한 4개 화면(홈/소개/상세/통계) 전체에 Element
      Plus(<code>ElCard</code>, <code>ElButton</code>, <code>ElInput</code>, <code>ElForm</code>,
      <code>ElSwitch</code>, <code>ElDescriptions</code>, <code>ElTag</code> 등)를 적용했습니다.
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
