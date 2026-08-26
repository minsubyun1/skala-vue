<script setup>
import { ref } from 'vue'

const mousePos = ref({ x: 0, y: 0 })
const lastKey = ref('')

function trackMouse(event) {
  mousePos.value = { x: event.clientX, y: event.clientY }
}

function trackKey(event) {
  lastKey.value = event.key
}
</script>

<template>
  <div class="practice-section">
    <h2>Event Object 학습</h2>

    <h3>1) 마우스 이벤트 객체</h3>
    <div class="mouse-area" @mousemove="trackMouse">이 영역 위에서 마우스를 움직여 보세요</div>
    <p>좌표: ({{ mousePos.x }}, {{ mousePos.y }})</p>

    <h3>2) 키보드 이벤트 객체</h3>
    <input @keyup="trackKey" placeholder="아무 키나 눌러보세요" />
    <p>마지막으로 누른 키: {{ lastKey || '(없음)' }}</p>
  </div>
</template>

<style scoped>
.mouse-area {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--color-border-hover);
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>
