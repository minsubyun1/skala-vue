<script setup>
import { computed } from 'vue'
import WeatherRouterNav from '@/components/handson/WeatherRouterNav.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import { weatherMockData } from '@/data/weatherMockData'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

function toDisplayTemp(rawTemp) {
  return configStore.unit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : rawTemp
}

// 요구사항 6: 기존 4개 view 외에 본인이 추가한 view.
// 통계 페이지라 별도 상태 없이 mock 데이터를 computed로 가공만 한다.
const cityCount = computed(() => weatherMockData.length)
const averageTemp = computed(() => {
  const sum = weatherMockData.reduce((acc, city) => acc + city.temp, 0)
  return toDisplayTemp(sum / weatherMockData.length).toFixed(1)
})
const hottest = computed(() => [...weatherMockData].sort((a, b) => b.temp - a.temp)[0])
const coldest = computed(() => [...weatherMockData].sort((a, b) => a.temp - b.temp)[0])
const countByStatus = computed(() => {
  const counts = {}
  weatherMockData.forEach((city) => {
    counts[city.status] = (counts[city.status] ?? 0) + 1
  })
  return counts
})
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Router / Store</h2>
    <div class="nav-row">
      <WeatherRouterNav />
      <UnitToggler />
    </div>

    <div class="stats-card">
      <h3>전체 통계 ({{ cityCount }}개 도시)</h3>

      <dl class="stat-grid">
        <div>
          <dt>평균 기온</dt>
          <dd>{{ averageTemp }}{{ configStore.unitSymbol }}</dd>
        </div>
        <div>
          <dt>최고 기온</dt>
          <dd>{{ hottest.name }} ({{ toDisplayTemp(hottest.temp) }}{{ configStore.unitSymbol }})</dd>
        </div>
        <div>
          <dt>최저 기온</dt>
          <dd>{{ coldest.name }} ({{ toDisplayTemp(coldest.temp) }}{{ configStore.unitSymbol }})</dd>
        </div>
      </dl>

      <h3>날씨 상태별 도시 수</h3>
      <ul class="status-list">
        <li v-for="(count, status) in countByStatus" :key="status">{{ status }}: {{ count }}곳</li>
      </ul>
    </div>

    <RouterLink to="/handson/weather-router" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.stats-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  max-width: 420px;
  margin-bottom: 16px;
}

.stats-card h3 {
  margin-bottom: 10px;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.stat-grid dt {
  font-size: 0.75rem;
  opacity: 0.6;
}

.stat-grid dd {
  font-weight: 700;
}

.status-list {
  list-style: none;
  line-height: 1.9;
}

.back-link {
  display: inline-block;
  color: #42b883;
  text-decoration: none;
  font-weight: 700;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
