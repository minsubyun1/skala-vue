import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { practiceRoutes } from './practiceRoutes'

// Weather Router 핸즈온의 하위 페이지(소개/상세/통계)는 사이드바에 따로 노출하지 않고
// 화면 안의 WeatherRouterNav 링크로만 이동하므로, practiceRoutes와 별도로 여기서 등록한다.
const weatherRouterSubRoutes = [
  {
    path: '/handson/weather-router/about',
    name: 'weather-router-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/handson/weather-router/weather/:cityId',
    name: 'weather-router-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/handson/weather-router/stats',
    name: 'weather-router-stats',
    component: () => import('../views/WeatherStatsView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    ...practiceRoutes,
    ...weatherRouterSubRoutes,
    // Catch-all Route: 위 라우트 어디에도 안 걸리는 경로는 전부 NotFoundView로.
    // 반드시 routes 배열의 가장 마지막에 위치해야 한다.
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

// Element Plus의 다크 테마 변수 파일(theme-chalk/dark/css-vars.css)은 반드시
// html.dark 셀렉터를 기준으로 하기 때문에, Weather Router/Store 화면에 들어가 있는
// 동안만 documentElement에 dark 클래스를 붙였다 뗀다.
router.afterEach((to) => {
  document.documentElement.classList.toggle('dark', to.path.startsWith('/handson/weather-router'))
})

export default router
