<script setup>
import { ref, watch } from 'vue'

const user = ref({
  name: '홍길동',
  age: 20,
})

const logDeep = ref('아직 반응 없음')
const logTarget = ref('아직 반응 없음')

// 실패하는 예시 (가장 많이 범하는 오류)
// watch(user, () => { console.log('이 로그는 영원히 안 찍힙니다.') })

// 해결책 1: deep 옵션을 켜서 객체 하위 속성 전체 감시하기
watch(
  user,
  (newVal) => {
    logDeep.value = `[deep 감지] 누군가 변경됨! 현재 이름: ${newVal.name}, 나이: ${newVal.age}`
  },
  { deep: true },
)

// 해결책 2: 화살표 함수로 특정 속성(age)만 콕 집어 감시하기 (★이전 값 추적 가능!)
watch(
  () => user.value.age,
  (newAge, oldAge) => {
    logTarget.value = `[타겟 감지] 나이가 ${oldAge}세 ➡️ ${newAge}세로 변경됨!`
  },
)
</script>

<template>
  <div class="practice-section">
    <h2>ref 객체/배열 감시</h2>
    <h3>👨‍💻 회원 데이터 조작 panel</h3>
    <p>이름: {{ user.name }} / 나이: {{ user.age }}세</p>
    <button @click="user.name = '이순신'">이름만 변경</button>
    <button @click="user.age++">나이만 변경 (age++)</button>

    <div class="monitor">
      <p>👁️‍🗨️ 1) deep: true 모니터 (전체 감시)</p>
      <p>{{ logDeep }}</p>
      <small style="color: gray">
        ※ 주의: deep:true를 쓰면 newVal이 이미 최신 상태를 가리키는 같은 객체라서, oldValue를 봐도
        결국 최신값과 똑같이 나옵니다 (과거 값 추적 불가).
      </small>
    </div>

    <div class="monitor target">
      <p>🎯 2) 화살표 함수 모니터 (나이만 타겟 감시)</p>
      <p>{{ logTarget }}</p>
      <small style="color: gray"
        >※ 특정 속성만 getter로 콕 집으면 이전 값이 정상적으로 보존됩니다.</small
      >
    </div>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.monitor.target {
  border-color: #42b883;
}
</style>
