<script setup>
import { ref } from 'vue'

const normalValue = ref('')
const lazyValue = ref('')
const numberValue = ref(0)
const trimValue = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>v-model Modifiers 학습</h2>

    <h3>1) 기본 (입력할 때마다 즉시 반영)</h3>
    <input v-model="normalValue" placeholder="타이핑하는 즉시 반영" />
    <p>값: "{{ normalValue }}"</p>

    <h3>2) .lazy - change 이벤트 시점에만 반영</h3>
    <input v-model.lazy="lazyValue" placeholder="포커스를 벗어나야 반영" />
    <p>값: "{{ lazyValue }}"</p>

    <h3>3) .number - 문자열 대신 숫자로 변환</h3>
    <input v-model.number="numberValue" type="text" placeholder="숫자를 입력해 보세요" />
    <p>값: {{ numberValue }} (타입: {{ typeof numberValue }})</p>

    <h3>4) .trim - 앞뒤 공백 제거</h3>
    <input v-model.trim="trimValue" placeholder="앞뒤에 공백을 넣어보세요" />
    <p>값: "{{ trimValue }}" (길이: {{ trimValue.length }})</p>
  </div>
</template>
