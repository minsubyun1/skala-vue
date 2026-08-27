<script setup>
import { ElInput } from 'element-plus'

// 부모로부터 검색어(searchQuery)를 props로 받아 표시하고,
// 사용자가 입력하면 update-query 이벤트로 부모에게 새 검색어를 전달한다.
defineProps({
  searchQuery: { type: String, default: '' },
})
const emit = defineEmits(['update-query'])

// el-input의 @input은 네이티브 이벤트 대신 입력된 문자열 값을 그대로 넘겨준다.
function handleInput(value) {
  emit('update-query', value)
}
</script>

<template>
  <div>
    <label class="search-label">🔍 도시 검색 (실습 데이터)</label>
    <ElInput
      :model-value="searchQuery"
      placeholder="검색할 도시 이름 입력"
      clearable
      @input="handleInput"
      @clear="handleInput('')"
    />
    <p class="search-hint">검색 중인 도시: {{ searchQuery || '전체' }}</p>
  </div>
</template>

<style scoped>
.search-label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 6px;
  opacity: 0.85;
}

.search-hint {
  margin-top: 6px;
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
