<script setup>
import { ref } from 'vue'

const clickCount = ref(0)
function increment() {
  clickCount.value++
}

function greet(name) {
  window.alert(`안녕하세요, ${name}님!`)
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 핸들러 학습</h2>

    <h3>1) 메서드 핸들러</h3>
    <p>클릭 횟수: {{ clickCount }}</p>
    <button @click="increment">클릭 (메서드 방식)</button>

    <h3>2) 인라인 핸들러</h3>
    <button @click="clickCount += 10">클릭 (인라인 방식, +10)</button>

    <h3>3) 인라인 핸들러에서 인자 전달</h3>
    <button @click="greet('Skala')">인자를 전달하는 인라인 핸들러</button>
  </div>
</template>
