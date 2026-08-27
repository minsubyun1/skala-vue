<script setup>
import { computed } from 'vue'
import { ElSwitch } from 'element-plus'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

// el-switch는 boolean 하나로 두 상태를 오가는 컴포넌트라, unit/windUnit 값을
// boolean으로 변환해서 연결하고 change 시점에 다시 store의 action을 호출한다.
const isFahrenheit = computed(() => configStore.unit === 'fahrenheit')
const isKmh = computed(() => configStore.windUnit === 'kmh')
</script>

<template>
  <div class="unit-toggler">
    <ElSwitch
      :model-value="isFahrenheit"
      active-text="℉"
      inactive-text="℃"
      inline-prompt
      @change="configStore.toggleUnit"
    />
    <ElSwitch
      :model-value="isKmh"
      active-text="km/h"
      inactive-text="m/s"
      inline-prompt
      style="--el-switch-on-color: #42b883"
      @change="configStore.toggleWindUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
