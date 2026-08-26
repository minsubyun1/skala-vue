# Code Challenge - Composition API: Computed & Watchers

[← README로 돌아가기](../README.md)

경로: `/composition/computed`, `/composition/watch`, `/composition/watch-multi-source`, `/composition/watch-deep`, `/composition/watch-reactive`, `/composition/watch-effect`

슬라이드 요구 항목: computed() / watch() / watch() Multi-Source / watch() Deep Watch / watch() reactive 감시 / watchEffect()

## computed()

`price * quantity`처럼 다른 반응형 값에서 파생되는 값을 계산합니다. 의존하는 값이 안 바뀌면 다시 계산하지 않고 캐싱된 값을 그대로 씁니다.

## watch()

`(newValue, oldValue)` 콜백 시그니처로 이전 값과 새 값을 둘 다 받을 수 있다는 걸 보여주는 기본 예제입니다.

## watch() Multi-Source

배열로 여러 소스를 한 번에 넘기면, 콜백도 각 소스의 새 값/이전 값을 배열로 받습니다.

```js
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => { ... })
```

## watch() Deep Watch

`watch(someRef, cb)`처럼 ref를 직접 감시 소스로 넘기면, `.value` 자체가 재할당될 때만 반응하고 내부 프로퍼티 변경(`user.value.age++`)에는 반응하지 않습니다. `{ deep: true }`를 추가하면 내부 프로퍼티 변경까지 추적합니다.

이 페이지는 얕은 watch와 deep watch를 나란히 두고 같은 조작(나이만 증가 / 객체 통째로 교체)에 대해 각각 어떻게 반응하는지 직접 비교할 수 있게 만들었습니다. 실제로 브라우저에서 클릭해서 확인한 결과:

| 조작 | 얕은 watch | deep watch |
|---|---|---|
| `user.age++` (내부 프로퍼티만 변경) | 반응 안 함 | 반응함 |
| `user = { ... }` (객체 통째로 교체) | 반응함 | 반응함 |

## watch() - reactive 데이터 감시

`reactive()`로 만든 객체를 직접 watch하면, `ref`와 달리 `{ deep: true }` 옵션 없이도 기본적으로 deep 감시가 적용됩니다.

## watchEffect()

감시 대상을 따로 지정하지 않고, 콜백 안에서 읽은 반응형 값을 자동으로 추적합니다. 컴포넌트가 마운트되는 즉시 1회 실행되고, 이후 참조한 값이 바뀔 때마다 다시 실행됩니다.
