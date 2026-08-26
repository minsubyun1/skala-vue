<script setup>
import { ref } from 'vue'
import { ElButton, ElCheckbox, ElInput, ElMessage } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('✅ 가입이 완료되었습니다.')
}
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus - Form Validation Example</h2>

    <ElInput v-model="userForm.email" placeholder="이메일을 입력하세요" style="max-width: 320px" />
    <br /><br />
    <ElCheckbox v-model="userForm.agree">이용약관에 동의합니다</ElCheckbox>
    <br /><br />
    <ElButton type="primary" @click="handleRegister">가입하기</ElButton>
  </div>
</template>
