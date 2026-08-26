<script setup>
import { ref } from 'vue'

const themeColor = ref('#42b883')
const fontSize = ref(16)
</script>

<template>
  <div class="practice-section">
    <h2>Vue Style Example</h2>

    <h3>1) &lt;style scoped&gt; - 이 컴포넌트에만 적용되는 스타일</h3>
    <p class="scoped-text">이 문단은 scoped 스타일이 적용됩니다.</p>

    <h3>2) &lt;style&gt; 안에서 v-bind() - JS 반응형 값을 CSS로 그대로 사용</h3>
    <p>글자 색: <input v-model="themeColor" type="color" /></p>
    <p>글자 크기: <input v-model.number="fontSize" type="range" min="12" max="32" /> {{ fontSize }}px</p>
    <p class="dynamic-text">v-bind(themeColor)로 색상을, v-bind(fontSize)로 크기를 실시간 반영합니다.</p>
  </div>
</template>

<style scoped>
.scoped-text {
  color: #42b883;
  font-weight: 700;
}

.dynamic-text {
  color: v-bind(themeColor);
  font-size: v-bind('fontSize + "px"');
  transition:
    color 0.2s,
    font-size 0.2s;
}
</style>
