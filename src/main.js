import './assets/main.css'
import 'element-plus/dist/index.css'
// Weather Router/Store 화면만 다크 테마로 보여주기 위한 변수 파일.
// html.dark 클래스가 붙어있을 때만 적용되며, 토글은 router/index.js의 afterEach에서 한다.
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
