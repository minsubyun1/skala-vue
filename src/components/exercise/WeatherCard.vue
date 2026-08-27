<script setup>
import { computed } from 'vue'
import { ElButton, ElCard, ElTag } from 'element-plus'
import WeatherGlyph from '@/components/handson/WeatherGlyph.vue'
import { useConfigStore } from '@/stores/configStore'

// 선택된(=이 카드에 배정된) 도시 객체를 props로 받아 표시한다.
const props = defineProps({
  city: { type: Object, required: true },
})

// 카드 선택과 상세보기를 각각 별도 이벤트로 부모에게 전달한다.
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

// 슬라이드의 displayTemp 패턴 그대로: 원본은 섭씨로 두고, 화면에 보여줄 때만 변환한다.
const displayTemp = computed(() => {
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
const displayWind = computed(() => {
  if (configStore.windUnit === 'kmh') return (props.city.wind * 3.6).toFixed(1)
  return props.city.wind
})

// 배지 분류는 표시 단위와 무관하게 항상 섭씨 원본 기준으로 판단한다.
const badge = computed(() => {
  const temp = props.city.temp
  if (temp >= 30) return { text: '🔥 폭염 (30도 이상)', type: 'danger' }
  if (temp >= 25) return { text: '🌡️ 더움 (25도 이상)', type: 'warning' }
  if (temp >= 18) return { text: '🍃 선선함 (18~24도)', type: 'primary' }
  return { text: '🧊 쌀쌀함 (18도 미만)', type: 'info' }
})
</script>

<template>
  <ElCard shadow="hover" class="weather-card" @click="emit('select-card', city)">
    <template #header>
      <div class="card-top">
        <span class="city-name">{{ city.name }}</span>
        <span class="status-icon">
          <WeatherGlyph :status="city.status" />
          {{ city.status }}
        </span>
      </div>
    </template>

    <p class="temp">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <p class="meta">
      습도 {{ city.humidity }}% · 풍속 {{ displayWind }}{{ configStore.windUnitLabel }}
    </p>
    <ElTag :type="badge.type" size="small" round class="badge">{{ badge.text }}</ElTag>

    <ElButton class="detail-btn" @click.stop="emit('click-detail', city)">상세보기</ElButton>
  </ElCard>
</template>

<style scoped>
.weather-card {
  cursor: pointer;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.18);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
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
  display: block;
  width: fit-content;
  margin-bottom: 10px;
}

.detail-btn {
  display: block;
  width: 100%;
}
</style>
