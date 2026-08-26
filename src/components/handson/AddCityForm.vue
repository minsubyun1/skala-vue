<script setup>
import { ref } from 'vue'

defineProps({
  statusOptions: { type: Array, required: true },
})
const emit = defineEmits(['add-city'])

const newCity = ref({ name: '', temp: 20, status: '맑음' })

function submit() {
  const name = newCity.value.name.trim()
  if (!name) return
  emit('add-city', { ...newCity.value, name })
  newCity.value = { name: '', temp: 20, status: '맑음' }
}
</script>

<template>
  <form class="add-city" @submit.prevent="submit">
    <p class="add-city-title">➕ 나만의 도시 추가하기</p>
    <input v-model="newCity.name" type="text" placeholder="도시 이름" required />
    <div class="add-city-row">
      <input v-model.number="newCity.temp" type="number" placeholder="기온(°C)" />
      <select v-model="newCity.status">
        <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>
    <button type="submit">추가</button>
  </form>
</template>

<style scoped>
.add-city {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 12px 14px;
}

.add-city-title {
  font-size: 0.8rem;
  opacity: 0.85;
}

.add-city-row {
  display: flex;
  gap: 8px;
}

.add-city input,
.add-city select {
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
  min-width: 0;
}

.add-city input[type='text'] {
  width: 100%;
}

.add-city-row input {
  flex: 1;
}

.add-city button {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #ffd166;
  background: transparent;
  color: #ffd166;
  cursor: pointer;
}
</style>
