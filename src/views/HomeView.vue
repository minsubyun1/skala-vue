<script setup>
import { practiceGroups } from '@/router/practiceRoutes'

const totalCount = practiceGroups.reduce((sum, group) => sum + group.items.length, 0)
</script>

<template>
  <div class="home">
    <section class="hero practice-section">
      <p class="eyebrow">TWL — Today's Weather Log</p>
      <h2>Vue 3 실습을 날씨 관측 일지처럼 기록합니다</h2>
      <p class="lede">
        Skala-Vue 부트캠프 실습을, 실제 외부 API로 데이터를 받아와 검증하는 날씨 앱 형태로
        구현했습니다.
      </p>
      <p class="meta">
        Composition API 실습 {{ totalCount }}개를 카테고리별로 정리했습니다. 왼쪽 사이드바 또는
        아래 카드를 클릭해서 확인하세요.
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
.eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #42b883;
  margin-bottom: 6px;
}

.hero h2 {
  word-break: keep-all;
}

.hero .lede {
  margin-top: 10px;
  color: var(--color-heading);
  font-size: 1.05rem;
  line-height: 1.6;
}

.hero .meta {
  margin-top: 10px;
  color: var(--color-text);
  opacity: 0.75;
  font-size: 0.88rem;
  line-height: 1.6;
}

.hero {
  animation: hero-in 0.6s ease both;
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero {
    animation: none;
  }
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
