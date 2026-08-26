<script setup>
import SlotCard from './SlotCard.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot Example</h2>
    <p class="hint">
      이름 없는 <code>&lt;slot&gt;</code> 자리에, 부모가 태그 사이에 적은 내용이 그대로 들어갑니다.
    </p>

    <SlotCard>
      <p>부모가 전달한 기본 슬롯 내용입니다.</p>
      <button>부모가 넣은 버튼도 그대로 렌더링됩니다</button>
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
