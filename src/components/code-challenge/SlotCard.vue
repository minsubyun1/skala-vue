<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="slot-card">
    <div class="slot-card-header">
      <!-- Named Slot: 이름표(header)가 붙은 구역, 부모가 원하는 마크업으로 채운다 -->
      <slot name="header">기본 헤더 (부모가 채우지 않으면 이 텍스트가 보임)</slot>
    </div>

    <div class="slot-card-body">
      <!-- Default Slot: 이름 없는 기본 구역 -->
      <slot>기본 내용 (부모가 채우지 않으면 이 텍스트가 보임)</slot>
    </div>

    <div v-if="items.length" class="slot-card-list">
      <!-- Scoped Slot: 자식이 가진 데이터(item, index)를 부모 쪽 슬롯 콘텐츠에 넘겨준다 -->
      <slot name="item" v-for="(item, index) in items" :item="item" :index="index" :key="index">
        {{ item }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
.slot-card {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}

.slot-card-header {
  padding: 10px 14px;
  background: var(--color-background-mute);
  font-weight: 700;
}

.slot-card-body {
  padding: 14px;
}

.slot-card-list {
  padding: 0 14px 14px;
}
</style>
