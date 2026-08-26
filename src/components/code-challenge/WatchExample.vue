<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const log = ref([])

watch(count, (newValue, oldValue) => {
  log.value.unshift(`count: ${oldValue} → ${newValue}`)
})
</script>

<template>
  <div class="practice-section">
    <h2>watch() Example</h2>

    <p>count: {{ count }}</p>
    <button @click="count++">count++</button>

    <h3>watch 콜백 로그 (이전값 → 새값)</h3>
    <ul>
      <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
    </ul>
  </div>
</template>
