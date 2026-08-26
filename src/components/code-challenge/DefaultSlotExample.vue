<script setup>
import SlotDefaultChild from './SlotDefaultChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot 레이아웃 주입 실습</h2>
    <SlotDefaultChild>
      <p>단순한 텍스트 문장을 주입합니다.</p>
    </SlotDefaultChild>
    <SlotDefaultChild>
      <h2 style="color: #e74c3c">🔥 경고 상태</h2>
      <button>확인</button>
    </SlotDefaultChild>
    <SlotDefaultChild></SlotDefaultChild>
    <p class="hint">
      마지막 카드는 부모가 아무 내용도 넣지 않아서, 자식의 <code>&lt;slot&gt;</code> 태그 안에
      적어둔 기본 콘텐츠("기본 콘텐츠 영역입니다.")가 대신 보입니다.
    </p>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
}
</style>
