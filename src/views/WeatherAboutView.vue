<script setup>
import WeatherRouterNav from '@/components/handson/WeatherRouterNav.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Router</h2>
    <WeatherRouterNav />

    <div class="about-card">
      <h3>이 서비스는 무엇인가요?</h3>
      <p>
        Skala-Vue 실습 중 하나로 만든 미니 날씨 대시보드입니다. 도시를 검색하고, 카드를
        클릭해서 선택하고, 상세보기를 누르면 <code>/handson/weather-router/weather/:cityId</code>
        경로로 이동해서 해당 도시의 상세 관측 정보를 확인할 수 있습니다.
      </p>

      <h3>사용한 기술</h3>
      <ul>
        <li>Vue Router의 Lazy Loading, 동적 라우트 매칭(<code>:cityId</code>), Catch-all Route</li>
        <li>Programmatic Navigation (<code>router.push</code>)</li>
        <li>Open-Meteo API를 이용한 실시간 날씨 조회</li>
        <li>three.js로 만든 날씨 상태별 배경 파티클</li>
      </ul>

      <RouterLink to="/handson/weather-router" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.about-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  max-width: 520px;
}

.about-card h3 {
  margin-bottom: 8px;
}

.about-card p {
  margin-bottom: 16px;
  line-height: 1.6;
}

.about-card ul {
  margin-bottom: 20px;
  padding-left: 20px;
  line-height: 1.8;
}

.back-link {
  display: inline-block;
  color: #42b883;
  text-decoration: none;
  font-weight: 700;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
