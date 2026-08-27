<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
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

    <div v-if="city" class="detail-card">
      <WeatherGlyph :status="city.status" :size="56" />
      <h3>{{ city.name }} 상세 기상관측</h3>
      <p class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

      <dl class="stat-grid">
        <div>
          <dt>날씨</dt>
          <dd>{{ city.status }}</dd>
        </div>
        <div>
          <dt>습도</dt>
          <dd>{{ city.humidity }}%</dd>
        </div>
        <div>
          <dt>풍속</dt>
          <dd>{{ displayWind }}{{ configStore.windUnitLabel }}</dd>
        </div>
        <div>
          <dt>체감기온</dt>
          <dd>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</dd>
        </div>
      </dl>

      <p class="city-id">도시 코드: {{ city.id }} (URL의 :cityId 파라미터)</p>
    </div>

    <div v-else-if="notFound" class="detail-card">
      <p>"{{ route.params.cityId }}"에 해당하는 관측 데이터를 찾을 수 없습니다.</p>
      <p class="hint">홈 화면에서 직접 추가한 도시는 이 mock 데이터에 없어서 조회되지 않습니다.</p>
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

.detail-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  text-align: left;
  padding: 14px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 12px;
}

.stat-grid dt {
  font-size: 0.75rem;
  opacity: 0.6;
}

.stat-grid dd {
  font-weight: 700;
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
