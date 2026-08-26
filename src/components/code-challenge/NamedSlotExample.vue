<script setup>
import SlotCard from './SlotCard.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot Example</h2>
    <p class="hint">
      <code>v-slot:header</code> (축약형 <code>#header</code>)로, 이름이 붙은 슬롯 자리를 골라서
      채울 수 있습니다.
    </p>

    <SlotCard>
      <template #header>
        <strong>🎯 이름 있는 헤더 슬롯</strong>
      </template>
      <p>본문은 기본 슬롯 그대로 사용합니다.</p>
    </SlotCard>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 14px;
}
</style>
