// 실습 페이지 목록을 이 배열 하나로 관리
// 라우터 등록과 사이드바 메뉴 렌더링에 동일한 배열을 재사용 (중복 관리 방지)
export const practiceGroups = [
  {
    groupId: 'handson',
    label: '핸즈온 과제',
    items: [
      {
        path: '/handson/weather-mockup',
        name: 'handson-weather-mockup',
        label: 'Weather Mockup',
        component: () => import('@/components/practices/handson/WeatherMockup.vue'),
      },
      {
        path: '/handson/weather-composition',
        name: 'handson-weather-composition',
        label: 'Weather Composition',
        component: () => import('@/components/practices/handson/WeatherComposition.vue'),
      },
    ],
  },
  {
    groupId: 'basic',
    label: '기본 문법 (Vue Syntax)',
    items: [
      {
        path: '/basic/reactivity',
        name: 'basic-reactivity',
        label: '반응형 데이터 (Reactivity)',
        component: () => import('@/components/practices/basic/SampleOne.vue'),
      },
      {
        path: '/basic/text-interpolation',
        name: 'basic-text-interpolation',
        label: 'Text Interpolation (JS Expression)',
        component: () => import('@/components/practices/basic/SampleTwo.vue'),
      },
    ],
  },
  {
    groupId: 'directive',
    label: 'Vue Directive',
    items: [
      {
        path: '/directive/v-html',
        name: 'directive-v-html',
        label: 'v-html',
        component: () => import('@/components/practices/directive/VHtmlSample.vue'),
      },
      {
        path: '/directive/v-html-xss',
        name: 'directive-v-html-xss',
        label: 'v-html XSS',
        component: () => import('@/components/practices/directive/VHtmlXss.vue'),
      },
      {
        path: '/directive/v-text',
        name: 'directive-v-text',
        label: 'v-text',
        component: () => import('@/components/practices/directive/VTextSample.vue'),
      },
      {
        path: '/directive/v-bind-basic',
        name: 'directive-v-bind-basic',
        label: 'v-bind (기본, 축약형)',
        component: () => import('@/components/practices/directive/VBindBasic.vue'),
      },
      {
        path: '/directive/v-bind-class',
        name: 'directive-v-bind-class',
        label: 'v-bind (Class Binding)',
        component: () => import('@/components/practices/directive/VBindClass.vue'),
      },
      {
        path: '/directive/v-bind-style',
        name: 'directive-v-bind-style',
        label: 'v-bind (Style Binding)',
        component: () => import('@/components/practices/directive/VBindStyle.vue'),
      },
      {
        path: '/directive/v-bind-shorthand',
        name: 'directive-v-bind-shorthand',
        label: 'v-bind (Same-name 단축 문법)',
        component: () => import('@/components/practices/directive/VBindShorthand.vue'),
      },
      {
        path: '/directive/v-if',
        name: 'directive-v-if',
        label: 'v-if / v-else-if / v-else',
        component: () => import('@/components/practices/directive/VIfSample.vue'),
      },
      {
        path: '/directive/v-show',
        name: 'directive-v-show',
        label: 'v-show',
        component: () => import('@/components/practices/directive/VShowSample.vue'),
      },
      {
        path: '/directive/v-for',
        name: 'directive-v-for',
        label: 'v-for',
        component: () => import('@/components/practices/directive/VForSample.vue'),
      },
      {
        path: '/directive/v-pre',
        name: 'directive-v-pre',
        label: 'v-pre',
        component: () => import('@/components/practices/directive/VPreSample.vue'),
      },
      {
        path: '/directive/v-cloak',
        name: 'directive-v-cloak',
        label: 'v-cloak',
        component: () => import('@/components/practices/directive/VCloakSample.vue'),
      },
      {
        path: '/directive/v-once',
        name: 'directive-v-once',
        label: 'v-once',
        component: () => import('@/components/practices/directive/VOnceSample.vue'),
      },
      {
        path: '/directive/v-memo',
        name: 'directive-v-memo',
        label: 'v-memo',
        component: () => import('@/components/practices/directive/VMemoSample.vue'),
      },
    ],
  },
]

export const practiceRoutes = practiceGroups.flatMap((group) =>
  group.items.map((item) => ({
    path: item.path,
    name: item.name,
    component: item.component,
    meta: { label: item.label, group: group.label },
  })),
)
