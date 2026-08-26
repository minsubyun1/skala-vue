# Code Challenge - Pinia

[← README로 돌아가기](../README.md)

경로: `/pinia/store-counter` · 컴포넌트: `src/components/code-challenge/StoreCounter.vue` · 스토어: `src/stores/counter.js`

슬라이드 요구 항목: Store(counter.js) 작성 → Pinia 등록(main.js) → Store 사용

`create-vue` 스캐폴딩 시 이미 생성돼 있던 `stores/counter.js`를 그대로 사용했습니다.

```js
// src/stores/counter.js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubleCount, increment }
})
```

`useCounterStore()`를 부르기만 하면 어느 컴포넌트에서든 같은 인스턴스를 공유합니다. 이 페이지를 벗어났다 돌아와도 count 값이 유지되는 걸 확인할 수 있고, Vue Devtools의 Pinia 탭에서도 같은 상태를 볼 수 있습니다.
