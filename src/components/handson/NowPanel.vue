<script setup>
import WeatherGlyph from './WeatherGlyph.vue'

// 상단 "지금 날씨" 요약. readout이 null이면 안내 문구를 대신 보여준다.
defineProps({
  readout: { type: Object, default: null },
})
</script>

<template>
  <div v-if="readout" class="now-panel">
    <WeatherGlyph :status="readout.status" :size="48" />
    <div class="now-info">
      <p class="now-name">
        {{ readout.name }}
        <span v-if="readout.source === 'LIVE'" class="live-badge">LIVE</span>
        <span v-else class="now-source">{{ readout.source }}</span>
      </p>
      <p class="now-temp">{{ readout.temp }}°C</p>
      <p class="now-meta">
        {{ readout.status }} · 습도 {{ readout.humidity }}% · 풍속 {{ readout.wind }}{{ readout.unit }}
      </p>
    </div>
  </div>
  <div v-else class="now-panel now-placeholder">
    <WeatherGlyph status="맑음" :size="40" />
    <p>카드를 클릭하거나 실시간 검색을 해보면 여기에 요약이 표시됩니다.</p>
  </div>
</template>

<style scoped>
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

.live-badge {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  background: #ffd166;
  color: #1e293b;
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
</style>
