<script setup>
import { ref } from 'vue'
import { Loader2, MapPin, Search } from 'lucide-vue-next'
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
    <form class="live-form" @submit.prevent="submit">
      <input v-model="liveQuery" type="text" placeholder="도시 이름 (서울, Tokyo, London...)" />
      <button type="submit" :disabled="isLoading">
        <Loader2 v-if="isLoading" :size="16" class="spin" />
        <Search v-else :size="16" />
      </button>
    </form>

    <p v-if="error" class="live-error">{{ error }}</p>

    <article v-if="result" class="live-card">
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
    </article>
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

.live-form input {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
}

.live-form button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ffd166;
  background: rgba(255, 209, 102, 0.15);
  color: #ffd166;
  cursor: pointer;
}

.live-form button:disabled {
  opacity: 0.6;
  cursor: progress;
}

.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.live-error {
  margin-top: 10px;
  font-size: 0.78rem;
  color: #fca5a5;
}

.live-card {
  margin-top: 10px;
  border: 1px solid rgba(255, 209, 102, 0.6);
  border-radius: 14px;
  padding: 16px;
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
