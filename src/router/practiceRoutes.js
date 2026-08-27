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
        component: () => import('@/components/handson/WeatherMockup.vue'),
      },
      {
        path: '/handson/weather-composition',
        name: 'handson-weather-composition',
        label: 'Weather Composition',
        component: () => import('@/components/handson/WeatherComposition.vue'),
      },
      {
        path: '/handson/weather-component',
        name: 'handson-weather-component',
        label: 'Weather Component',
        component: () => import('@/components/handson/WeatherParent.vue'),
      },
      {
        path: '/handson/weather-router',
        name: 'handson-weather-router',
        label: 'Weather Router',
        component: () => import('@/views/WeatherHomeView.vue'),
      },
      {
        path: '/handson/weather-axios',
        name: 'handson-weather-axios',
        label: 'Weather Axios',
        component: () => import('@/views/WeatherAxiosView.vue'),
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
        component: () => import('@/components/code-challenge/SampleOne.vue'),
      },
      {
        path: '/basic/text-interpolation',
        name: 'basic-text-interpolation',
        label: 'Text Interpolation (JS Expression)',
        component: () => import('@/components/code-challenge/SampleTwo.vue'),
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
        component: () => import('@/components/code-challenge/VHtmlSample.vue'),
      },
      {
        path: '/directive/v-html-xss',
        name: 'directive-v-html-xss',
        label: 'v-html XSS',
        component: () => import('@/components/code-challenge/VHtmlXss.vue'),
      },
      {
        path: '/directive/v-text',
        name: 'directive-v-text',
        label: 'v-text',
        component: () => import('@/components/code-challenge/VTextSample.vue'),
      },
      {
        path: '/directive/v-bind-basic',
        name: 'directive-v-bind-basic',
        label: 'v-bind (기본, 축약형)',
        component: () => import('@/components/code-challenge/VBindBasic.vue'),
      },
      {
        path: '/directive/v-bind-class',
        name: 'directive-v-bind-class',
        label: 'v-bind (Class Binding)',
        component: () => import('@/components/code-challenge/VBindClass.vue'),
      },
      {
        path: '/directive/v-bind-style',
        name: 'directive-v-bind-style',
        label: 'v-bind (Style Binding)',
        component: () => import('@/components/code-challenge/VBindStyle.vue'),
      },
      {
        path: '/directive/v-bind-shorthand',
        name: 'directive-v-bind-shorthand',
        label: 'v-bind (Same-name 단축 문법)',
        component: () => import('@/components/code-challenge/VBindShorthand.vue'),
      },
      {
        path: '/directive/v-if',
        name: 'directive-v-if',
        label: 'v-if / v-else-if / v-else',
        component: () => import('@/components/code-challenge/VIfSample.vue'),
      },
      {
        path: '/directive/v-show',
        name: 'directive-v-show',
        label: 'v-show',
        component: () => import('@/components/code-challenge/VShowSample.vue'),
      },
      {
        path: '/directive/v-for',
        name: 'directive-v-for',
        label: 'v-for',
        component: () => import('@/components/code-challenge/VForSample.vue'),
      },
      {
        path: '/directive/v-pre',
        name: 'directive-v-pre',
        label: 'v-pre',
        component: () => import('@/components/code-challenge/VPreSample.vue'),
      },
      {
        path: '/directive/v-cloak',
        name: 'directive-v-cloak',
        label: 'v-cloak',
        component: () => import('@/components/code-challenge/VCloakSample.vue'),
      },
      {
        path: '/directive/v-once',
        name: 'directive-v-once',
        label: 'v-once',
        component: () => import('@/components/code-challenge/VOnceSample.vue'),
      },
      {
        path: '/directive/v-memo',
        name: 'directive-v-memo',
        label: 'v-memo',
        component: () => import('@/components/code-challenge/VMemoSample.vue'),
      },
    ],
  },
  {
    groupId: 'event-handling',
    label: 'Vue Event Handling',
    items: [
      {
        path: '/event/v-on-basic',
        name: 'event-v-on-basic',
        label: 'v-on Event Handler',
        component: () => import('@/components/code-challenge/VOnBasic.vue'),
      },
      {
        path: '/event/event-object',
        name: 'event-event-object',
        label: 'Event Object',
        component: () => import('@/components/code-challenge/VOnEventObject.vue'),
      },
      {
        path: '/event/event-modifier',
        name: 'event-event-modifier',
        label: 'Event Modifier',
        component: () => import('@/components/code-challenge/VOnModifiers.vue'),
      },
    ],
  },
  {
    groupId: 'form-handling',
    label: 'Vue Form Handling',
    items: [
      {
        path: '/form/v-model-basic',
        name: 'form-v-model-basic',
        label: 'v-model 양방향 바인딩',
        component: () => import('@/components/code-challenge/VModelBasic.vue'),
      },
      {
        path: '/form/v-model-elements',
        name: 'form-v-model-elements',
        label: 'HTML Form 요소 매핑',
        component: () => import('@/components/code-challenge/VModelFormElements.vue'),
      },
      {
        path: '/form/v-model-modifiers',
        name: 'form-v-model-modifiers',
        label: 'v-model Modifiers',
        component: () => import('@/components/code-challenge/VModelModifiers.vue'),
      },
      {
        path: '/form/vue-style',
        name: 'form-vue-style',
        label: 'Vue Style',
        component: () => import('@/components/code-challenge/VueStyleExample.vue'),
      },
    ],
  },
  {
    groupId: 'composition-reactive',
    label: 'Composition API - Reactive State',
    items: [
      {
        path: '/composition/ref',
        name: 'composition-ref',
        label: 'ref()',
        component: () => import('@/components/code-challenge/RefExample.vue'),
      },
      {
        path: '/composition/reactive',
        name: 'composition-reactive',
        label: 'reactive()',
        component: () => import('@/components/code-challenge/ReactiveExample.vue'),
      },
    ],
  },
  {
    groupId: 'composition-watchers',
    label: 'Composition API - Computed & Watchers',
    items: [
      {
        path: '/composition/computed',
        name: 'composition-computed',
        label: 'computed()',
        component: () => import('@/components/code-challenge/ComputedExample.vue'),
      },
      {
        path: '/composition/watch',
        name: 'composition-watch',
        label: 'watch()',
        component: () => import('@/components/code-challenge/WatchExample.vue'),
      },
      {
        path: '/composition/watch-multi-source',
        name: 'composition-watch-multi-source',
        label: 'watch() Multi-Source',
        component: () => import('@/components/code-challenge/WatchMultiSource.vue'),
      },
      {
        path: '/composition/watch-deep',
        name: 'composition-watch-deep',
        label: 'watch() Deep Watch',
        component: () => import('@/components/code-challenge/WatchDeep.vue'),
      },
      {
        path: '/composition/watch-reactive',
        name: 'composition-watch-reactive',
        label: 'watch() reactive 감시',
        component: () => import('@/components/code-challenge/WatchReactive.vue'),
      },
      {
        path: '/composition/watch-effect',
        name: 'composition-watch-effect',
        label: 'watchEffect()',
        component: () => import('@/components/code-challenge/WatchEffectExample.vue'),
      },
    ],
  },
  {
    groupId: 'components',
    label: 'Vue Components',
    items: [
      {
        path: '/components/lifecycle',
        name: 'components-lifecycle',
        label: 'Component Lifecycle',
        component: () => import('@/components/code-challenge/LifecycleExample.vue'),
      },
      {
        path: '/components/props-emits',
        name: 'components-props-emits',
        label: 'Props & Emits',
        component: () => import('@/components/code-challenge/PropsEmitsExample.vue'),
      },
      {
        path: '/components/slot-default',
        name: 'components-slot-default',
        label: 'Default Slot',
        component: () => import('@/components/code-challenge/DefaultSlotExample.vue'),
      },
      {
        path: '/components/slot-named',
        name: 'components-slot-named',
        label: 'Named Slot',
        component: () => import('@/components/code-challenge/NamedSlotExample.vue'),
      },
      {
        path: '/components/slot-scoped',
        name: 'components-slot-scoped',
        label: 'Scoped Slot',
        component: () => import('@/components/code-challenge/ScopedSlotExample.vue'),
      },
    ],
  },
  {
    groupId: 'pinia',
    label: 'Pinia',
    items: [
      {
        path: '/pinia/store-counter',
        name: 'pinia-store-counter',
        label: 'Store (counter.js)',
        component: () => import('@/components/code-challenge/StoreCounter.vue'),
      },
    ],
  },
  {
    groupId: 'axios',
    label: 'Axios',
    items: [
      {
        path: '/axios/weather',
        name: 'axios-weather',
        label: 'Axios Weather',
        component: () => import('@/components/code-challenge/AxiosWeatherExample.vue'),
      },
      {
        path: '/axios/json',
        name: 'axios-json',
        label: 'Axios JSON',
        component: () => import('@/components/code-challenge/AxiosJsonExample.vue'),
      },
    ],
  },
  {
    groupId: 'ui-library',
    label: 'UI Libraries (Element Plus)',
    items: [
      {
        path: '/ui-library/form',
        name: 'ui-library-form',
        label: 'Form Validation',
        component: () => import('@/components/code-challenge/ElementFormExample.vue'),
      },
      {
        path: '/ui-library/product',
        name: 'ui-library-product',
        label: 'Product Card',
        component: () => import('@/components/code-challenge/ElementProductExample.vue'),
      },
      {
        path: '/ui-library/progress',
        name: 'ui-library-progress',
        label: 'Progress & Confirm',
        component: () => import('@/components/code-challenge/ElementProgressExample.vue'),
      },
    ],
  },
  {
    groupId: 'build-deploy',
    label: 'Vite Build & Deployment',
    items: [
      {
        path: '/build-deploy/env',
        name: 'build-deploy-env',
        label: '환경 변수 (.env)',
        component: () => import('@/components/code-challenge/EnvExample.vue'),
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
