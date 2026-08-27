<script setup>
import { ElButton, ElCard } from 'element-plus'
import WeatherRouterNav from '@/components/handson/WeatherRouterNav.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Hands on - Weather Router / Store / UI Library</h2>
    <div class="nav-row">
      <WeatherRouterNav />
      <UnitToggler />
    </div>

    <ElCard shadow="never" class="about-card">
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
        <li>Pinia로 만든 온도/풍속 단위 설정(<code>stores/configStore.js</code>)</li>
        <li>Open-Meteo API를 이용한 실시간 날씨 조회</li>
        <li>three.js로 만든 날씨 상태별 배경 파티클</li>
        <li>Element Plus(외부 UI Library)로 만든 카드/버튼/폼/스위치/통계 표 등 화면 전체 UI</li>
      </ul>

      <ElButton tag="router-link" to="/handson/weather-router" text>← 메인 대시보드로 돌아가기</ElButton>
    </ElCard>
  </div>
</template>

<style scoped>
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.about-card {
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
</style>
