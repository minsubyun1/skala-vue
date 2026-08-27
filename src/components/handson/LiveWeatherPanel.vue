<script setup>
import { ref } from 'vue'
import { ElButton, ElCard, ElInput } from 'element-plus'
import { MapPin, Search } from 'lucide-vue-next'
import WeatherGlyph from './WeatherGlyph.vue'

// 실시간 조회 상태(isLoading/error/result)는 부모가 들고 있는 composable을 그대로 props로 받는다.
// (three.js 배경도 같은 result를 참조해야 해서 composable 인스턴스 자체는 부모에 둔다)
defineProps({
  isLoading: { type: Boolean, required: true },
  error: { type: String, default: '' },
  result: { type: Object, default: null },
})
const emit = defineEmits(['search'])

const liveQuery = ref('')
function submit() {
  emit('search', liveQuery.value)
}
</script>

<template>
  <div class="live-panel">
    <p class="live-title"><MapPin :size="16" /> 실시간 날씨 조회</p>
    <div class="live-form">
      <ElInput
        v-model="liveQuery"
        placeholder="도시 이름 (서울, Tokyo, London...)"
        @keyup.enter="submit"
      />
      <ElButton type="warning" plain :loading="isLoading" :icon="Search" @click="submit" />
    </div>

    <p v-if="error" class="live-error">{{ error }}</p>

    <ElCard v-if="result" shadow="never" class="live-card">
      <div class="card-top">
        <span class="city-name">
          <span class="live-badge">LIVE</span>
          {{ result.name }}
          <small>{{ result.country }}</small>
        </span>
        <WeatherGlyph :status="result.status" :size="18" />
      </div>
      <p class="temp">{{ result.temp }}°C</p>
      <p class="meta">습도 {{ result.humidity }}% · 풍속 {{ result.wind }}km/h</p>
    </ElCard>
  </div>
</template>

<style scoped>
.live-panel {
  background: rgba(255, 209, 102, 0.08);
  border: 1px solid rgba(255, 209, 102, 0.3);
  border-radius: 12px;
  padding: 14px;
}

.live-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  margin-bottom: 8px;
  color: #ffd166;
}

.live-form {
  display: flex;
  gap: 8px;
}

.live-error {
  margin-top: 10px;
  font-size: 0.78rem;
  color: #fca5a5;
}

.live-card {
  margin-top: 10px;
  border-color: rgba(255, 209, 102, 0.6) !important;
  background: rgba(15, 23, 42, 0.55);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 6px;
}

.live-badge {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  background: #ffd166;
  color: #1e293b;
  margin-right: 6px;
  vertical-align: middle;
}

.city-name small {
  opacity: 0.6;
  font-weight: 400;
  margin-left: 4px;
}

.temp {
  font-size: 1.1rem;
}

.meta {
  font-size: 0.8rem;
  opacity: 0.75;
}
</style>
