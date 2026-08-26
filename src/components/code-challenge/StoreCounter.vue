<script setup>
import { useCounterStore } from '@/stores/counter'

// useCounterStore()를 부르기만 하면, 어느 컴포넌트에서든 같은 store 인스턴스를 공유한다.
const counterStore = useCounterStore()
</script>

<template>
  <div class="practice-section">
    <h2>Pinia Store (counter.js) 사용하기</h2>

    <p>count: {{ counterStore.count }}</p>
    <p>doubleCount (getter): {{ counterStore.doubleCount }}</p>
    <button @click="counterStore.increment()">increment()</button>

    <p class="hint">
      <code>src/stores/counter.js</code>에 정의된 Store를 그대로 가져다 썼습니다. 이 페이지를
      벗어났다 돌아와도 count 값은 유지됩니다 (Store는 앱 전체에서 하나만 존재). Vue Devtools의
      Pinia 탭에서도 같은 값을 확인할 수 있습니다.
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
