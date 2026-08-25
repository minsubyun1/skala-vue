<script setup>
import { practiceGroups } from '@/router/practiceRoutes'

const totalCount = practiceGroups.reduce((sum, group) => sum + group.items.length, 0)
</script>

<template>
  <div class="home">
    <section class="hero practice-section">
      <h2>Skala-Vue 실습 모음</h2>
      <p>
        Vue 3 Composition API로 작성한 실습 컴포넌트 {{ totalCount }}개를 카테고리별로 정리했습니다.
        왼쪽 사이드바 또는 아래 카드를 클릭해서 실습을 확인하세요.
      </p>
    </section>

    <section v-for="group in practiceGroups" :key="group.groupId" class="group-section">
      <h3>{{ group.label }}</h3>
      <div class="card-grid">
        <RouterLink v-for="item in group.items" :key="item.path" :to="item.path" class="card">
          {{ item.label }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero p {
  margin-top: 8px;
  color: var(--color-text);
  opacity: 0.85;
  line-height: 1.6;
}

.group-section {
  margin-bottom: 28px;
}

.group-section h3 {
  margin-bottom: 12px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.card {
  display: block;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.card:hover {
  border-color: #42b883;
  color: #42b883;
}
</style>
