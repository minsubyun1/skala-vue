<script setup>
import { ref } from 'vue'

const log = ref([])
function push(msg) {
  log.value.unshift(msg)
  if (log.value.length > 8) log.value.pop()
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어(Event Modifier) 학습</h2>

    <h3>1) .stop - 버블링 중단</h3>
    <div class="box" @click="push('부모 영역 클릭됨')">
      부모 영역
      <button @click.stop="push('자식 버튼 클릭 (버블링 안 됨)')">자식 버튼</button>
    </div>

    <h3>2) .prevent - 기본 동작 방지</h3>
    <form @submit.prevent="push('폼이 제출됐지만 새로고침은 발생하지 않음 (.prevent)')">
      <button type="submit">제출</button>
    </form>

    <h3>3) .once - 한 번만 실행</h3>
    <button @click.once="push('이 버튼은 한 번만 반응함')">한 번만 반응하는 버튼</button>

    <h3>4) .enter - 키 수식어</h3>
    <input @keyup.enter="push('Enter 키가 눌림')" placeholder="Enter를 눌러보세요" />

    <h3>로그</h3>
    <ul class="log-list">
      <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
    </ul>
  </div>
</template>

<style scoped>
.box {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 8px;
}

.log-list {
  font-size: 0.9rem;
  opacity: 0.85;
}
</style>
