<script setup>
import { computed } from 'vue'
import { ElButton, ElCard, ElDescriptions, ElDescriptionsItem, ElTag } from 'element-plus'
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
    <h2>Hands on - Weather Router / Store / UI Library</h2>
    <div class="nav-row">
      <WeatherRouterNav />
      <UnitToggler />
    </div>

    <ElCard shadow="never" class="stats-card">
      <h3>전체 통계 ({{ cityCount }}개 도시)</h3>

      <ElDescriptions :column="1" border size="small" class="stat-grid">
        <ElDescriptionsItem label="평균 기온">{{ averageTemp }}{{ configStore.unitSymbol }}</ElDescriptionsItem>
        <ElDescriptionsItem label="최고 기온">
          {{ hottest.name }} ({{ toDisplayTemp(hottest.temp) }}{{ configStore.unitSymbol }})
        </ElDescriptionsItem>
        <ElDescriptionsItem label="최저 기온">
          {{ coldest.name }} ({{ toDisplayTemp(coldest.temp) }}{{ configStore.unitSymbol }})
        </ElDescriptionsItem>
      </ElDescriptions>

      <h3>날씨 상태별 도시 수</h3>
      <div class="status-tags">
        <ElTag v-for="(count, status) in countByStatus" :key="status">{{ status }}: {{ count }}곳</ElTag>
      </div>
    </ElCard>

    <ElButton tag="router-link" to="/handson/weather-router" text>← 메인 대시보드로 돌아가기</ElButton>
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
  max-width: 420px;
  margin-bottom: 16px;
}

.stats-card h3 {
  margin-bottom: 10px;
}

.stat-grid {
  margin-bottom: 20px;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
