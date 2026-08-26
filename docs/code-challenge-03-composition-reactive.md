# Code Challenge - Composition API: Reactive State

[← README로 돌아가기](../README.md)

경로: `/composition/ref`, `/composition/reactive` · 컴포넌트: `RefExample.vue`, `ReactiveExample.vue`

슬라이드 요구 항목: ref() Example / reactive() Example

## ref()

원시값(count), 문자열(name, `v-model`로 양방향 바인딩), boolean(isActive), 배열(items), 객체(user)까지 - 원시값이든 객체든 전부 `ref()` 하나로 감쌀 수 있다는 걸 보여줍니다.

## reactive()

객체·배열 전용입니다. `.value` 없이 프로퍼티에 바로 접근합니다.

```js
const userReactive = reactive({ name: '이순신', age: 30 })
const items = reactive(['사과', '바나나'])
```

다만 `reactive()`로 만든 객체를 통째로 다른 값으로 재할당(`state = {...}`)하면 반응성 연결이 끊기는 제약이 있어서, 실무에서는 원시값뿐 아니라 객체를 다룰 때도 `ref()`로 통일하는 경우가 많다고 슬라이드에 나와 있습니다.
