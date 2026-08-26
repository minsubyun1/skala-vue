<script setup>
import { reactive, ref, watch } from 'vue'

// reactive 객체를 직접 watch하면, ref와 달리 별도 옵션 없이도 기본적으로 deep 감시가 된다.
const state = reactive({ name: '홍길동', age: 20 })
const log = ref([])

watch(state, () => {
  log.value.unshift(`age = ${state.age} (deep 옵션 없이도 감지됨)`)
})
</script>

<template>
  <div class="practice-section">
    <h2>watch() - reactive 반응형 데이터 감시 Example</h2>

    <p>{{ state.name }} ({{ state.age }}세)</p>
    <button @click="state.age++">나이 증가</button>

    <h3>로그</h3>
    <ul>
      <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
    </ul>
  </div>
</template>
