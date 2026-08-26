<script setup>
// Props: 부모 -> 자식 (하행선)
defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
})

// Emits: 자식 -> 부모 (상행선)
const emit = defineEmits(['increment', 'reset'])
</script>

<template>
  <div class="child-card">
    <p class="child-title">{{ title }}</p>
    <p class="child-count">{{ count }}</p>
    <button @click="emit('increment')">+1 (부모에게 이벤트 전달)</button>
    <button @click="emit('reset')">reset</button>
  </div>
</template>

<style scoped>
.child-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 14px 16px;
  text-align: center;
}

.child-title {
  font-weight: 700;
}

.child-count {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 6px 0;
}
</style>
