<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElButton, ElCard, ElDescriptions, ElDescriptionsItem } from 'element-plus'
import WeatherGlyph from '@/components/handson/WeatherGlyph.vue'
import WeatherRouterNav from '@/components/handson/WeatherRouterNav.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import { weatherMockData } from '@/data/weatherMockData'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const city = ref(null)
const notFound = ref(false)
const configStore = useConfigStore()

// 요구사항: 동적 경로 매칭(cityId)을 기반으로 Mount 시점에 Mock Data에서 도시 객체를 선택한다.
onMounted(() => {
  const found = weatherMockData.find((item) => item.id === route.params.cityId)
  if (found) {
    city.value = found
  } else {
    // 홈 화면에서 새로 추가한 도시(city_custom_...)는 이 mock 데이터에는 없다.
    notFound.value = true
  }
})

const displayTemp = computed(() => {
  if (!city.value) return null
  const rawTemp = city.value.temp
  return configStore.unit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : rawTemp
})
const displayFeelsLike = computed(() => {
  if (!city.value) return null
  const rawFeelsLike = city.value.temp - city.value.wind * 0.5
  const converted = configStore.unit === 'fahrenheit' ? (rawFeelsLike * 9) / 5 + 32 : rawFeelsLike
  return converted.toFixed(1)
})
const displayWind = computed(() => {
  if (!city.value) return null
  return configStore.windUnit === 'kmh' ? (city.value.wind * 3.6).toFixed(1) : city.value.wind
})
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Router / Store</h2>
    <div class="nav-row">
      <WeatherRouterNav />
      <UnitToggler />
    </div>

    <ElCard v-if="city" shadow="never" class="detail-card">
      <WeatherGlyph :status="city.status" :size="56" />
      <h3>{{ city.name }} 상세 기상관측</h3>
      <p class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

      <ElDescriptions :column="2" border size="small" class="stat-grid">
        <ElDescriptionsItem label="날씨">{{ city.status }}</ElDescriptionsItem>
        <ElDescriptionsItem label="습도">{{ city.humidity }}%</ElDescriptionsItem>
        <ElDescriptionsItem label="풍속">{{ displayWind }}{{ configStore.windUnitLabel }}</ElDescriptionsItem>
        <ElDescriptionsItem label="체감기온">{{ displayFeelsLike }}{{ configStore.unitSymbol }}</ElDescriptionsItem>
      </ElDescriptions>

      <p class="city-id">도시 코드: {{ city.id }} (URL의 :cityId 파라미터)</p>
    </ElCard>

    <ElCard v-else-if="notFound" shadow="never" class="detail-card">
      <p>"{{ route.params.cityId }}"에 해당하는 관측 데이터를 찾을 수 없습니다.</p>
      <p class="hint">홈 화면에서 직접 추가한 도시는 이 mock 데이터에 없어서 조회되지 않습니다.</p>
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

.detail-card {
  max-width: 420px;
  text-align: center;
  margin-bottom: 16px;
}

.temp {
  font-size: 2.4rem;
  font-weight: 800;
  margin: 6px 0 16px;
}

.stat-grid {
  text-align: left;
  margin-bottom: 12px;
}

.city-id {
  font-size: 0.75rem;
  opacity: 0.6;
}

.hint {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 8px;
}
</style>
