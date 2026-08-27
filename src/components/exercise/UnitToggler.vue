<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <button @click="configStore.toggleUnit">🌡️ {{ configStore.unitSymbol }}</button>
    <button @click="configStore.toggleWindUnit">💨 {{ configStore.windUnitLabel }}</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  gap: 8px;
}

.unit-toggler button {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
}

.unit-toggler button:hover {
  border-color: #42b883;
  color: #42b883;
}
</style>
