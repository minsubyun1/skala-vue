<script setup>
import { ref } from 'vue'

const isAgreed = ref(false)
const selectedFruits = ref([])
const selectedPlan = ref('basic')
const selectedCity = ref('seoul')
const bio = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>HTML Form 요소와 v-model 매핑</h2>

    <h3>1) checkbox (단일)</h3>
    <label><input v-model="isAgreed" type="checkbox" /> 약관에 동의합니다 ({{ isAgreed }})</label>

    <h3>2) checkbox (배열)</h3>
    <label><input v-model="selectedFruits" type="checkbox" value="사과" /> 사과</label>
    <label><input v-model="selectedFruits" type="checkbox" value="바나나" /> 바나나</label>
    <label><input v-model="selectedFruits" type="checkbox" value="딸기" /> 딸기</label>
    <p>선택한 과일: {{ selectedFruits.join(', ') || '(없음)' }}</p>

    <h3>3) radio</h3>
    <label><input v-model="selectedPlan" type="radio" value="basic" /> Basic</label>
    <label><input v-model="selectedPlan" type="radio" value="pro" /> Pro</label>
    <p>선택한 플랜: {{ selectedPlan }}</p>

    <h3>4) select</h3>
    <select v-model="selectedCity">
      <option value="seoul">서울</option>
      <option value="busan">부산</option>
      <option value="daegu">대구</option>
    </select>
    <p>선택한 도시: {{ selectedCity }}</p>

    <h3>5) textarea</h3>
    <textarea v-model="bio" rows="3" placeholder="자기소개를 입력해 보세요"></textarea>
    <p>글자 수: {{ bio.length }}</p>
  </div>
</template>
