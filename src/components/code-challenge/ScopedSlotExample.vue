<script setup>
import SlotCard from './SlotCard.vue'

const fruits = ['사과', '바나나', '딸기']
</script>

<template>
  <div class="practice-section">
    <h2>Scoped Slot Example</h2>
    <p class="hint">
      자식 컴포넌트가 <code>v-slot="{ item, index }"</code>로 자신이 가진 데이터를 부모 쪽 슬롯
      콘텐츠에 넘겨줍니다. 부모는 그 데이터를 받아서 원하는 모양으로 렌더링만 하면 됩니다.
    </p>

    <SlotCard :items="fruits">
      <template #header>🍎 과일 목록 (Scoped Slot)</template>
      <template #item="{ item, index }">
        <p class="fruit-row">{{ index + 1 }}번째 과일: <strong>{{ item }}</strong></p>
      </template>
    </SlotCard>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 14px;
}

.fruit-row {
  margin: 4px 0;
}
</style>
