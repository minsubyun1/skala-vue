<script setup>
import WeatherGlyph from '@/components/handson/WeatherGlyph.vue'

// 선택된(=이 카드에 배정된) 도시 객체를 props로 받아 표시한다.
defineProps({
  city: { type: Object, required: true },
})

// 카드 선택과 상세보기를 각각 별도 이벤트로 부모에게 전달한다.
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article class="weather-card" @click="emit('select-card', city)">
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

    <button class="detail-btn" @click.stop="emit('click-detail', city)">상세보기</button>
  </article>
</template>

<style scoped>
.weather-card {
  cursor: pointer;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  padding: 16px;
  transition:
    transform 0.12s ease-out,
    border-color 0.15s ease;
}

.weather-card:hover {
  border-color: #ffd166;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 6px;
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
</style>
