<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { Search, Star } from 'lucide-vue-next'
import WeatherGlyph from './WeatherGlyph.vue'
import WeatherDetailModal from './WeatherDetailModal.vue'

// 데이터는 Weather Mockup 과제와 동일한 목록 재사용
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

// 요구사항 1 - 반응형 상태
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 콘솔 로그를 화면에도 함께 출력 (디버깅용 로그 패널)
const logs = ref([])
function pushLog(tag, msg) {
  console.log(tag, msg)
  logs.value.unshift({ key: Date.now() + Math.random(), tag, msg })
  if (logs.value.length > 12) logs.value.pop()
}

// 요구사항 2 - computed로 필터링 (검색어 없으면 원본 그대로 반환)
const filteredWeatherList = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return weatherList.value
  return weatherList.value.filter((c) => c.name.includes(q))
})

// 요구사항 3 - watch: selectedCityInfo(상태바 문구) 바뀔 때마다
watch(selectedCityInfo, (next) => {
  pushLog('👁️ watch', `상태바 문구 변경 -> "${next}"`)
})

// 요구사항 3 - watchEffect: searchQuery 타이핑할 때마다 자동으로 다시 실행됨
watchEffect(() => {
  pushLog('🔔 watchEffect', `검색어 "${searchQuery.value}" 로 필터링 -> ${filteredWeatherList.value.length}건`)
})

function selectCity(city) {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// alert 대신 Weather Mockup에서 만든 모달 컴포넌트 재사용
const detailCity = ref(null)
function showDetail(city) {
  detailCity.value = city
}

// 요구사항 5 - 추가 반응형 상태 + computed + watcher (즐겨찾기 기능)
const favoriteIds = ref([])
const favoriteCount = computed(() => favoriteIds.value.length)
function toggleFavorite(city) {
  const idx = favoriteIds.value.indexOf(city.id)
  if (idx === -1) favoriteIds.value.push(city.id)
  else favoriteIds.value.splice(idx, 1)
}
watch(
  favoriteIds,
  (list) => pushLog('⭐ watch', `즐겨찾기 ${list.length}개로 변경됨`),
  { deep: true },
)
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Composition</h2>

    <p class="note">
      💡 computed / watch / watchEffect 로직은 Weather Mockup 과제에서도 동일하게 사용했습니다.
      해당 과제는 UI가 화려해서 로직이 눈에 잘 띄지 않을 수 있어, 이 페이지에서는 반응형 로직만
      따로 정리해서 보여드립니다.
    </p>

    <div class="panel">
      <div class="search-row">
        <Search :size="16" class="search-icon" />
        <input
          :value="searchQuery"
          @input="searchQuery = $event.target.value"
          type="text"
          placeholder="도시 이름 검색"
        />
      </div>
      <p class="hint">검색 중인 도시: {{ searchQuery || '(전체)' }}</p>

      <div class="list-title">
        <span>📍 지역별 날씨 현황</span>
        <span v-if="favoriteCount" class="fav-count">⭐ 즐겨찾기 {{ favoriteCount }}개</span>
      </div>

      <TransitionGroup v-if="filteredWeatherList.length > 0" name="card" tag="div" class="card-grid">
        <article v-for="city in filteredWeatherList" :key="city.id" class="city-card" @click="selectCity(city)">
          <button
            class="star"
            :class="{ on: favoriteIds.includes(city.id) }"
            @click.stop="toggleFavorite(city)"
          >
            <Star :size="16" :fill="favoriteIds.includes(city.id) ? 'currentColor' : 'none'" />
          </button>

          <WeatherGlyph :status="city.status" :size="30" />
          <p class="city-name">{{ city.name }}</p>
          <p class="city-temp">{{ city.temp }}°C</p>
          <span class="badge" :class="city.temp < 25 ? 'cool' : 'warm'">
            {{ city.temp < 25 ? '선선함 (25도 미만)' : '더움 (25도 이상)' }}
          </span>

          <button class="detail-btn" @click.stop="showDetail(city)">상세보기</button>
        </article>
      </TransitionGroup>
      <p v-else class="empty">검색 결과와 일치하는 도시가 없습니다.</p>
    </div>

    <p class="status-bar">{{ selectedCityInfo }}</p>

    <div class="console-box">
      <p class="console-title">console (watch / watchEffect 로그를 여기에서도 확인할 수 있습니다)</p>
      <p v-if="logs.length === 0" class="console-empty">
        아직 출력된 로그가 없습니다. 검색하거나 카드를 클릭해 보세요.
      </p>
      <p v-for="log in logs" :key="log.key" class="console-line">
        <span class="tag">{{ log.tag }}</span>{{ log.msg }}
      </p>
    </div>

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

.panel {
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 14px;
  background: var(--color-background-soft);
}

.search-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
}

.search-icon {
  opacity: 0.5;
  flex-shrink: 0;
}

.search-row input {
  flex: 1;
  border: none;
  background: none;
  color: var(--color-text);
}

.search-row input:focus {
  outline: none;
}

.hint {
  margin: 6px 0 18px;
  font-size: 0.82rem;
  opacity: 0.65;
}

.list-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 12px;
}

.fav-count {
  font-weight: 400;
  font-size: 0.8rem;
  opacity: 0.7;
}

.card-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.city-card {
  position: relative;
  cursor: pointer;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px 14px;
  text-align: center;
  background: var(--color-background);
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}

.city-card:hover {
  transform: translateY(-3px);
  border-color: #42b883;
}

.card-move,
.card-enter-active,
.card-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: scale(0.88);
}
.card-leave-active {
  position: absolute;
}

.star {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: none;
  color: var(--color-border-hover);
  cursor: pointer;
  padding: 2px;
}

.star.on {
  color: #f5a623;
}

.city-name {
  font-weight: 700;
  margin-top: 6px;
}

.city-temp {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 2px 0 8px;
}

.badge {
  display: inline-block;
  font-size: 0.72rem;
  padding: 2px 9px;
  border-radius: 999px;
  margin-bottom: 10px;
}

.badge.warm {
  background: #f97316;
  color: white;
}

.badge.cool {
  background: #38bdf8;
  color: #0f172a;
}

.detail-btn {
  display: block;
  width: 100%;
  padding: 6px 0;
  border-radius: 6px;
  border: 1px solid var(--color-border-hover);
  background: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.85rem;
}

.detail-btn:hover {
  border-color: #42b883;
  color: #42b883;
}

.empty {
  opacity: 0.7;
  padding: 12px 4px;
}

.status-bar {
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(74, 222, 128, 0.15);
  border: 1px solid rgba(74, 222, 128, 0.4);
  margin-bottom: 14px;
}

.console-title {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 0.85rem;
  opacity: 0.8;
}

.console-box {
  background: #0f172a;
  color: #d1d5db;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.8rem;
  padding: 14px 16px;
  border-radius: 10px;
  max-height: 220px;
  overflow-y: auto;
}

.console-empty {
  opacity: 0.5;
}

.console-line {
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
}

.console-line .tag {
  margin-right: 6px;
  opacity: 0.85;
}
</style>
