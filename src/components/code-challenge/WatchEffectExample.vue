<script setup>
import { ref, watchEffect } from 'vue'

const a = ref(1)
const b = ref(2)
const log = ref([])

// watchEffect는 감시 대상을 지정하지 않는다. 콜백 안에서 읽은 반응형 값을 자동으로 추적한다.
// 컴포넌트가 마운트되는 즉시 1회 실행되고, 이후 a나 b가 바뀔 때마다 다시 실행된다.
watchEffect(() => {
  log.value.unshift(`a(${a.value}) + b(${b.value}) = ${a.value + b.value}`)
})
</script>

<template>
  <div class="practice-section">
    <h2>watchEffect() Example</h2>

    <label>a: <input v-model.number="a" type="number" /></label>
    <label>b: <input v-model.number="b" type="number" /></label>

    <p class="hint">
      콜백 안에서 <code>a.value</code>와 <code>b.value</code>를 둘 다 읽고 있어서, 둘 중 어느
      쪽을 바꿔도 자동으로 다시 실행됩니다. watch()처럼 감시 대상을 따로 적을 필요가 없습니다.
    </p>

    <h3>실행 로그</h3>
    <ul>
      <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
    </ul>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
  margin: 10px 0;
}
</style>
