<script setup>
import { ref } from 'vue'
import { ElCard, ElInputNumber, ElRate } from 'element-plus'

const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus - Product Card Example</h2>

    <ElCard style="max-width: 320px">
      <template #header>
        <span>Vue.js 스티커 팩</span>
      </template>

      <p>구매 수량</p>
      <ElInputNumber v-model="productQuantity" :min="1" :max="10" />

      <p style="margin-top: 12px">별점</p>
      <ElRate v-model="productRate" />

      <p style="margin-top: 12px">선택 수량: {{ productQuantity }}개 · 별점: {{ productRate }}점</p>
    </ElCard>
  </div>
</template>
