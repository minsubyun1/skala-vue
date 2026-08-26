<script setup>
import { reactive } from 'vue'

const userReactive = reactive({ name: '이순신', age: 30 })
const celebrateReactive = () => {
  userReactive.age++
}

const items = reactive(['사과', '바나나'])
const addItem = () => {
  items.push(`과일 ${items.length + 1}`)
}
const removeItem = (index) => {
  items.splice(index, 1)
}
</script>

<template>
  <div class="practice-section">
    <h2>반응형 상태 reactive() 특징 및 주의점</h2>

    <h3>1) 객체(Object) reactive</h3>
    <p>이름: {{ userReactive.name }} / 나이: {{ userReactive.age }}세</p>
    <button @click="celebrateReactive">reactive 나이 한 살 추가</button>

    <h3>2) 배열(Array) reactive</h3>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
        <button @click="removeItem(index)" style="margin-left: 8px; padding: 2px 6px">삭제</button>
      </li>
    </ul>
    <button @click="addItem">과일 항목 추가</button>

    <p class="hint">
      reactive로 선언된 객체나 배열은 통째로 새 값으로 재할당(<code>state = {...}</code>)하면
      반응성 연결이 끊깁니다. 내부 프로퍼티만 조심스럽게 바꾸거나, 배열이라면 push/splice 같은
      메서드로 다뤄야 합니다.
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
