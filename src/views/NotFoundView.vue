<script setup></script>

<template>
  <div class="not-found">
    <p class="code">404</p>
    <p class="message">요청하신 페이지를 찾을 수 없습니다.</p>
    <RouterLink to="/" class="home-link">홈으로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
}

.code {
  font-size: 4rem;
  font-weight: 800;
  color: #42b883;
}

.message {
  opacity: 0.75;
  margin-bottom: 12px;
}

.home-link {
  color: #42b883;
  text-decoration: none;
  font-weight: 700;
}

.home-link:hover {
  text-decoration: underline;
}
</style>
