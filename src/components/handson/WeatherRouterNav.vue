<script setup>
// App.vue는 이미 사이트 전체 사이드바(RouterLink 모음)를 갖고 있어서, 이 핸즈온 전용
// 내비게이션 바는 Weather Router 화면들(Home/About/Stats) 안에서만 노출되는 작은 상단 바로 만들었다.
</script>

<template>
  <nav class="weather-router-nav">
    <RouterLink to="/handson/weather-router" active-class="active">홈</RouterLink>
    <RouterLink to="/handson/weather-router/about" active-class="active">소개</RouterLink>
    <RouterLink to="/handson/weather-router/stats" active-class="active">통계</RouterLink>
  </nav>
</template>

<style scoped>
.weather-router-nav {
  display: flex;
  gap: 8px;
}

.weather-router-nav a {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.85rem;
}

.weather-router-nav a:hover {
  border-color: #42b883;
  color: #42b883;
}

.weather-router-nav a.active {
  background: #42b883;
  border-color: #42b883;
  color: white;
}
</style>
