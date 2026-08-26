<script setup>
import { ref, computed } from 'vue'

const price = ref(10000)
const quantity = ref(2)

// 의존하는 값(price, quantity)이 바뀔 때만 다시 계산되고, 그 외엔 캐싱된 값을 재사용한다.
const totalPrice = computed(() => price.value * quantity.value)
</script>

<template>
  <div class="practice-section">
    <h2>computed() Example</h2>

    <label>가격: <input v-model.number="price" type="number" /></label>
    <label>수량: <input v-model.number="quantity" type="number" /></label>

    <p class="total">합계: {{ totalPrice.toLocaleString() }}원</p>

    <p class="hint">
      totalPrice는 함수가 아니라 <code>computed()</code>로 만든 반응형 값이라, price나 quantity가
      바뀔 때만 다시 계산되고 나머지 상황에서는 캐싱된 값을 그대로 씁니다.
    </p>
  </div>
</template>

<style scoped>
.total {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 10px 0;
}
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
}
</style>
