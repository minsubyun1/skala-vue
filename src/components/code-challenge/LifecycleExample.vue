<script setup>
import { ref } from 'vue'
import LifecycleChild from './LifecycleChild.vue'

const showChild = ref(true)
const log = ref([])

function handleLog(msg) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}
</script>

<template>
  <div class="practice-section">
    <h2>Component Lifecycle Hook Example</h2>

    <button @click="showChild = !showChild">
      {{ showChild ? '자식 컴포넌트 제거 (unmount)' : '자식 컴포넌트 다시 표시 (mount)' }}
    </button>

    <LifecycleChild v-if="showChild" @log="handleLog" />

    <h3>Lifecycle 로그</h3>
    <ul class="log-list">
      <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
    </ul>
  </div>
</template>

<style scoped>
.log-list {
  font-size: 0.9rem;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
