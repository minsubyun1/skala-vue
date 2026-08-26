<script setup>
// Vite는 실행 모드에 맞는 .env 파일을 자동으로 읽어서 import.meta.env에 주입한다.
// 개발 서버(npm run dev)는 mode가 'development'라 .env.staging/.env.production은 적용되지 않고,
// npm run build:staging / npm run build 를 실행할 때만 각각 반영된다.
const apiUrl = import.meta.env.VITE_API_URL
const mode = import.meta.env.MODE

console.log('[env] VITE_API_URL =', apiUrl)
console.log('[env] MODE =', mode)
</script>

<template>
  <div class="practice-section">
    <h2>환경 변수 (.env) Example</h2>

    <p>현재 모드: <strong>{{ mode }}</strong></p>
    <p>VITE_API_URL: <strong>{{ apiUrl ?? '(설정 안 됨)' }}</strong></p>

    <p class="hint">
      개발 서버에서는 <code>.env.staging</code> / <code>.env.production</code>이 적용되지
      않습니다. <code>npm run build:staging</code> 또는 <code>npm run build</code>로 빌드한 뒤
      <code>dist/</code>의 결과물을 확인해야 실제 반영된 값을 볼 수 있습니다.
    </p>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-top: 10px;
}
</style>
