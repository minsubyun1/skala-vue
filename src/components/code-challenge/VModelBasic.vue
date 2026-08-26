<script setup>
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>v-model 양방향 데이터 바인딩 학습</h2>

    <input v-model="name" placeholder="이름을 입력해 보세요" />
    <p>입력한 값: {{ name || '(비어있음)' }}</p>

    <p class="hint">
      v-model은 <code>:value</code>와 <code>@input</code>을 한 번에 묶어주는 문법 설탕(Syntax
      Sugar)입니다. 입력창에 값을 넣으면 <code>name</code>이 바뀌고, 반대로
      <code>name</code>을 코드에서 바꾸면 입력창 값도 같이 바뀝니다.
    </p>
    <button @click="name = 'Skala'">코드에서 값 바꾸기</button>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
  margin: 10px 0;
}
</style>
