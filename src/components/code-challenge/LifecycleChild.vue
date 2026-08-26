<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

const emit = defineEmits(['log'])

const count = ref(0)

function log(msg) {
  emit('log', msg)
}

onBeforeMount(() => log('onBeforeMount - DOM에 붙기 직전'))
onMounted(() => log('onMounted - DOM에 붙은 직후'))
onBeforeUpdate(() => log('onBeforeUpdate - 리렌더링 직전'))
onUpdated(() => log('onUpdated - 리렌더링 직후'))
onBeforeUnmount(() => log('onBeforeUnmount - 제거되기 직전'))
onUnmounted(() => log('onUnmounted - 제거된 직후'))
</script>

<template>
  <div class="child-box">
    <p>자식 컴포넌트 (count: {{ count }})</p>
    <button @click="count++">count++ (onUpdated 유발)</button>
  </div>
</template>

<style scoped>
.child-box {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
}
</style>
