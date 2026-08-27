import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 온도 단위
  const unit = ref('celsius')
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 풍속 단위 (본인 추가 - 요구사항 4: configStore에 state/getter/action 추가)
  const windUnit = ref('ms')
  const windUnitLabel = computed(() => (windUnit.value === 'ms' ? 'm/s' : 'km/h'))
  function toggleWindUnit() {
    windUnit.value = windUnit.value === 'ms' ? 'kmh' : 'ms'
  }

  return { unit, unitSymbol, toggleUnit, windUnit, windUnitLabel, toggleWindUnit }
})
