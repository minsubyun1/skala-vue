<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import WeatherGlyph from './WeatherGlyph.vue'

const props = defineProps({
  city: { type: Object, default: null },
})
const emit = defineEmits(['close'])

function handleKeydown(event) {
  if (event.key === 'Escape' && props.city) emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="city" class="modal-backdrop" @click.self="emit('close')">
        <div class="modal-card" role="dialog" aria-modal="true">
          <button class="modal-close" aria-label="닫기" @click="emit('close')">
            <X :size="18" />
          </button>

          <WeatherGlyph :status="city.status" :size="56" />
          <h3 class="modal-city">{{ city.name }}</h3>
          <p class="modal-temp">{{ city.temp }}°C</p>
          <p class="modal-status">{{ city.status }}</p>

          <dl class="modal-stats">
            <div>
              <dt>습도</dt>
              <dd>{{ city.humidity }}%</dd>
            </div>
            <div>
              <dt>풍속</dt>
              <dd>{{ city.wind }}{{ city.unit ?? 'm/s' }}</dd>
            </div>
          </dl>

          <p class="modal-summary">
            {{ city.name }}의 현재 날씨는 [{{ city.status }}] 상태입니다. 기온
            {{ city.temp }}°C · 습도 {{ city.humidity }}% · 풍속 {{ city.wind }}{{ city.unit ?? 'm/s' }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(4px);
}

.modal-card {
  position: relative;
  width: min(360px, 90vw);
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  padding: 32px 28px 26px;
  color: #f1f5f9;
  text-align: center;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.6);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #f1f5f9;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.modal-city {
  margin-top: 10px;
  font-size: 1.2rem;
}

.modal-temp {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
}

.modal-status {
  opacity: 0.75;
  margin-bottom: 18px;
}

.modal-stats {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin: 0 0 18px;
  padding: 14px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.modal-stats dt {
  font-size: 0.72rem;
  opacity: 0.6;
}

.modal-stats dd {
  margin: 2px 0 0;
  font-size: 1rem;
  font-weight: 700;
}

.modal-summary {
  font-size: 0.8rem;
  opacity: 0.7;
  line-height: 1.5;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.92) translateY(8px);
}
</style>
