<script setup>
// 검색박스/리스트박스가 공통으로 쓰는 카드 레이아웃. 내용물은 전부 slot으로 주입받는다.
// (핸즈온 3의 components/handson/BaseDashboardCard.vue와 같은 컴포넌트지만,
//  이번 과제 폴더 구조 요구사항대로 components/exercise/ 밑에 따로 둔다)
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <div class="dashboard-card">
    <p v-if="title" class="dashboard-card-title">{{ title }}</p>
    <slot></slot>
  </div>
</template>

<style scoped>
.dashboard-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 14px;
}

.dashboard-card-title {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 0.85rem;
  opacity: 0.85;
}
</style>
