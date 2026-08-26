<script setup>
import { ref } from 'vue'
import axios from 'axios'

const posts = ref([])
const isLoading = ref(false)

// JSONPlaceholder: 테스트용 더미 JSON을 제공하는 공개 API
async function fetchPosts() {
  isLoading.value = true
  try {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts', {
      params: { _limit: 5 },
    })
    posts.value = data
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>Axios JSON Example</h2>

    <button :disabled="isLoading" @click="fetchPosts">
      {{ isLoading ? '불러오는 중...' : 'JSON 5개 불러오기' }}
    </button>

    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.id }}. {{ post.title }}</li>
    </ul>
  </div>
</template>
