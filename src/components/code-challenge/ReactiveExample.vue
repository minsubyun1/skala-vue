<script setup>
import { reactive } from 'vue'

// reactive()는 객체/배열 전용이다. .value 없이 프로퍼티에 바로 접근한다.
const state = reactive({
  count: 0,
  user: { name: '홍길동', age: 20 },
  todos: ['Vue 공부하기'],
})

function addTodo() {
  state.todos.push(`할 일 ${state.todos.length + 1}`)
}
</script>

<template>
  <div class="practice-section">
    <h2>reactive() Example</h2>

    <h3>1) 프로퍼티 직접 접근 (.value 없음)</h3>
    <p>count: {{ state.count }}</p>
    <button @click="state.count++">count++</button>

    <h3>2) 중첩 객체도 그대로 반응형</h3>
    <p>{{ state.user.name }} ({{ state.user.age }}세)</p>
    <button @click="state.user.age++">나이 증가</button>

    <h3>3) 배열도 반응형</h3>
    <ul>
      <li v-for="(todo, index) in state.todos" :key="index">{{ todo }}</li>
    </ul>
    <button @click="addTodo">할 일 추가</button>

    <p class="hint">
      reactive()로 만든 객체는 통째로 다른 변수에 재할당하면 반응성이 끊긴다는 제약이 있어서,
      원시값 하나만 다룰 땐 ref()를 더 많이 쓴다.
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
