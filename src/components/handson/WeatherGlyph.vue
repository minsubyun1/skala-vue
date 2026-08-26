<script setup>
import { computed } from 'vue'
import { Cloud, CloudFog, CloudRain, CloudSnow, Sun } from 'lucide-vue-next'

const props = defineProps({
  status: { type: String, required: true },
  size: { type: Number, default: 22 },
})

const ICON_MAP = {
  맑음: Sun,
  구름: Cloud,
  비: CloudRain,
  눈: CloudSnow,
  안개: CloudFog,
}

const CLASS_MAP = {
  맑음: 'glyph-sunny',
  구름: 'glyph-cloud',
  비: 'glyph-rain',
  눈: 'glyph-snow',
  안개: 'glyph-fog',
}

const icon = computed(() => ICON_MAP[props.status] ?? Cloud)
const glyphClass = computed(() => CLASS_MAP[props.status] ?? 'glyph-cloud')
</script>

<template>
  <component :is="icon" :size="size" class="weather-glyph" :class="glyphClass" />
</template>

<style scoped>
.weather-glyph {
  flex-shrink: 0;
}

.glyph-sunny {
  color: #ffd166;
  animation: glyph-spin 8s linear infinite;
}

.glyph-rain {
  color: #5da9ff;
  animation: glyph-bob 1.4s ease-in-out infinite;
}

.glyph-cloud {
  color: #cfd8e3;
  animation: glyph-drift 4s ease-in-out infinite;
}

.glyph-snow {
  color: #ffffff;
  animation: glyph-spin 6s linear infinite;
}

.glyph-fog {
  color: #9aa5b1;
  animation: glyph-drift 5s ease-in-out infinite;
}

@keyframes glyph-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes glyph-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3px);
  }
}

@keyframes glyph-drift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
}
</style>
