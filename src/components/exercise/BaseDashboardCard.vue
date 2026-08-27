<script setup>
import { ElCard } from 'element-plus'

// 검색박스/리스트박스가 공통으로 쓰는 카드 레이아웃. 내용물은 전부 slot으로 주입받는다.
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <ElCard shadow="never" class="dashboard-card">
    <template v-if="title" #header>
      <span class="dashboard-card-title">{{ title }}</span>
    </template>
    <slot></slot>
  </ElCard>
</template>

<style scoped>
.dashboard-card {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.dashboard-card-title {
  font-weight: 700;
  font-size: 0.85rem;
}
</style>
