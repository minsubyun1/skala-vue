# Code Challenge - Composition API: Reactive State

[← README로 돌아가기](../README.md)

경로: `/composition/ref`, `/composition/reactive` · 컴포넌트: `RefExample.vue`, `ReactiveExample.vue`

슬라이드 요구 항목: ref() Example / reactive() Example

## ref()

원시값(숫자, 문자열)을 반응형으로 감싸고 `.value`로 읽고 씁니다. 객체를 `ref()`로 감싸는 것도 가능한데, 이 경우 내부적으로 `reactive()`가 한 번 더 적용됩니다.

## reactive()

객체·배열 전용입니다. `.value` 없이 프로퍼티에 바로 접근합니다. 다만 `reactive()`로 만든 객체를 통째로 다른 변수에 재할당하면 반응성이 끊기는 제약이 있어서, 원시값 하나만 다룰 땐 `ref()`를 더 자주 씁니다.

```js
const state = reactive({ count: 0, user: { name: '홍길동', age: 20 }, todos: [] })
state.count++          // OK - 반응형 유지
state.todos.push('할 일') // OK - 배열도 반응형
```
