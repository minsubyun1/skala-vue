<script setup>
import { ref } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from 'element-plus'

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
  <div class="add-city">
    <p class="add-city-title">➕ 나만의 도시 추가하기</p>
    <ElForm label-position="top" size="small" @submit.prevent="submit">
      <ElFormItem label="도시 이름">
        <ElInput v-model="newCity.name" placeholder="도시 이름" />
      </ElFormItem>
      <div class="add-city-row">
        <ElFormItem label="기온(°C)">
          <ElInputNumber v-model="newCity.temp" :controls="false" />
        </ElFormItem>
        <ElFormItem label="날씨">
          <ElSelect v-model="newCity.status">
            <ElOption v-for="status in statusOptions" :key="status" :label="status" :value="status" />
          </ElSelect>
        </ElFormItem>
      </div>
      <ElButton type="primary" plain @click="submit">추가</ElButton>
    </ElForm>
  </div>
</template>

<style scoped>
.add-city {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 12px 14px;
}

.add-city-title {
  font-size: 0.8rem;
  opacity: 0.85;
  margin-bottom: 10px;
}

.add-city-row {
  display: flex;
  gap: 12px;
}

.add-city-row :deep(.el-form-item) {
  flex: 1;
}
</style>
