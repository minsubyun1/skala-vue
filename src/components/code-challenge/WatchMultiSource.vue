<script setup>
import { ref, watch } from 'vue'

const firstName = ref('길동')
const lastName = ref('홍')
const log = ref([])

// 배열로 여러 소스를 한 번에 감시하면, 콜백도 각 소스의 이전/새 값을 배열로 받는다.
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  log.value.unshift(`${oldLast}${oldFirst} → ${newLast}${newFirst}`)
})
</script>

<template>
  <div class="practice-section">
    <h2>watch() Multi-Source Example</h2>

    <label>성: <input v-model="lastName" /></label>
    <label>이름: <input v-model="firstName" /></label>
    <p>전체 이름: {{ lastName }}{{ firstName }}</p>

    <h3>변경 로그</h3>
    <ul>
      <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
    </ul>
  </div>
</template>
