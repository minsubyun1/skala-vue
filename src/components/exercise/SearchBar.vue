<script setup>
// 부모로부터 검색어(searchQuery)를 props로 받아 표시하고,
// 사용자가 입력하면 update-query 이벤트로 부모에게 새 검색어를 전달한다.
defineProps({
  searchQuery: { type: String, default: '' },
})
const emit = defineEmits(['update-query'])

function handleInput(event) {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div>
    <label class="search-label">🔍 도시 검색 (실습 데이터)</label>
    <input :value="searchQuery" @input="handleInput" type="text" placeholder="검색할 도시 이름 입력" />
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

input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
}

.search-hint {
  margin-top: 6px;
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
