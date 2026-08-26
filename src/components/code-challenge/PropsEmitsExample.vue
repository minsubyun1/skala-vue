<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

const counter = ref(0)

function handleIncrement() {
  counter.value++
}
function handleReset() {
  counter.value = 0
}
</script>

<template>
  <div class="practice-section">
    <h2>Props &amp; Emits Example</h2>
    <p class="hint">
      "데이터는 위에서 아래로(Props), 이벤트는 아래에서 위로(Emits)" 구조를 그대로 보여주는
      예제입니다. 부모가 <code>title</code>/<code>count</code>를 자식에게 내려주고, 자식은
      버튼 클릭을 <code>increment</code>/<code>reset</code> 이벤트로 부모에게 쏘아 올립니다.
    </p>

    <PropsEmitsChild
      title="공용 카운터"
      :count="counter"
      @increment="handleIncrement"
      @reset="handleReset"
    />
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 14px;
}
</style>
