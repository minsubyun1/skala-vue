<script setup>
import { ref, watch } from 'vue'

const user = ref({ name: '홍길동', age: 20 })
const shallowLog = ref([])
const deepLog = ref([])

// 얕은 watch: ref.value 자체를 재할당해야만 반응. 내부 프로퍼티만 바꾸면 감지 못함.
watch(user, () => {
  shallowLog.value.unshift(`(얕은 watch) 발생 시각: ${new Date().toLocaleTimeString()}`)
})

// deep: true를 주면 객체 내부 프로퍼티 변경까지 추적한다.
watch(
  user,
  () => {
    deepLog.value.unshift(`(deep watch) age = ${user.value.age}`)
  },
  { deep: true },
)
</script>

<template>
  <div class="practice-section">
    <h2>watch() Deep Watch Example</h2>

    <p>{{ user.name }} ({{ user.age }}세)</p>
    <button @click="user.age++">나이만 증가 (내부 프로퍼티 변경)</button>
    <button @click="user = { name: '이순신', age: 30 }">객체 통째로 교체</button>

    <h3>얕은 watch 로그 (내부 프로퍼티 변경은 감지 못함)</h3>
    <ul>
      <li v-for="(entry, index) in shallowLog" :key="index">{{ entry }}</li>
    </ul>

    <h3>deep watch 로그 (내부 프로퍼티 변경도 감지)</h3>
    <ul>
      <li v-for="(entry, index) in deepLog" :key="index">{{ entry }}</li>
    </ul>
  </div>
</template>
