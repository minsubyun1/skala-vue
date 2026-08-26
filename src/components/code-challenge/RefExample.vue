<script setup>
import { ref } from 'vue'

// ref()는 원시값(숫자, 문자열, boolean)을 반응형으로 감싼다. .value로 읽고 쓴다.
const count = ref(0)
const message = ref('안녕하세요')

// 객체도 ref()로 감쌀 수 있다 - 내부적으로 reactive()로 다시 한번 감싸진다.
const user = ref({ name: '홍길동', age: 20 })
</script>

<template>
  <div class="practice-section">
    <h2>ref() Example</h2>

    <h3>1) 원시값</h3>
    <p>count: {{ count }}</p>
    <button @click="count++">count++</button>

    <h3>2) 문자열</h3>
    <p>{{ message }}</p>
    <button @click="message = message + '!'">느낌표 추가</button>

    <h3>3) 객체를 담은 ref</h3>
    <p>{{ user.name }} ({{ user.age }}세)</p>
    <button @click="user.age++">나이 증가 (user.age++)</button>
  </div>
</template>
