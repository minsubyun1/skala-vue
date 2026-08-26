# Code Challenge - Composition API: Computed & Watchers

[← README로 돌아가기](../README.md)

경로: `/composition/computed`, `/composition/watch`, `/composition/watch-multi-source`, `/composition/watch-deep`, `/composition/watch-reactive`, `/composition/watch-effect`

슬라이드 요구 항목: computed() / watch() / watch() Multi-Source / watch() Deep Watch / watch() reactive 감시 / watchEffect()

이 6개는 슬라이드에 실제 코드가 그대로 실려 있어서, 변수명·콘솔 로그 문구까지 원본 그대로 옮겼습니다.

## computed()

`price * quantity` 같은 계산이 아니라, **캐싱 동작 자체**를 증명하는 예제입니다. `count`에 의존하는 `computed`와, `count`만 참조하지만 `computed`가 아닌 일반 함수를 나란히 두고, 둘 다 템플릿에서 호출되게 했습니다.

```js
const getMethodResult = () => {
  console.log('❌ 일반 함수 실행됨!')
  return count.value * 2
}
const doubleCount = computed(() => {
  console.log('✅ Computed 연산 실행됨!')
  return count.value * 2
})
```

`count`를 증가시키면 두 로그가 다 찍히지만, `count`와 무관한 `dummy`를 증가시키면(컴포넌트가 리렌더링되긴 하므로) 일반 함수 로그만 찍히고 computed 로그는 안 찍힙니다. computed가 캐싱된 값을 재사용한다는 증거입니다.

## watch()

`(newValue, oldValue)` 콜백 시그니처로 이전 값과 새 값을 둘 다 받을 수 있다는 걸 보여주는 기본 예제입니다.

## watch() Multi-Source

배열로 여러 소스를 한 번에 넘기면, 콜백도 각 소스의 새 값/이전 값을 배열로 받습니다.

```js
watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => { ... })
```

## watch() Deep Watch

이 예제가 저한테는 제일 까다로웠습니다. 처음엔 "얕은 watch는 안 잡히고 deep:true는 잡힌다"는 단순 비교로 만들었는데, 슬라이드가 실제로 말하는 요점은 그게 아니라 **"deep:true를 쓰면 newValue와 oldValue가 똑같이 최신 값으로 나와서 과거 값을 못 본다"**는 것이었습니다. 대신 감시 대상을 `() => user.value.age`처럼 getter로 콕 집으면 예전 값이 정상 보존됩니다.

```js
// deep: true - 반응은 하지만 예전 값을 못 봄
watch(user, (newVal) => { ... }, { deep: true })

// 타겟 getter - 예전 값을 정상적으로 볼 수 있음
watch(() => user.value.age, (newAge, oldAge) => { ... })
```

## watch() - reactive 데이터 감시

`reactive()` 객체는 `{ deep: true }` 없이도 기본적으로 deep 감시가 되지만, 마찬가지로 `newVal`/`oldVal`을 봐도 값이 똑같이 나오는 함정이 있습니다. 여기서도 특정 속성만 getter로 감시하면 예전 값을 볼 수 있다는 걸 나란히 비교합니다.

## watchEffect()

감시 대상을 따로 지정하지 않고, 콜백 안에서 읽은 반응형 값(`username`, `age`)을 자동으로 추적합니다. 새로고침하자마자 버튼을 안 눌러도 로그가 이미 한 번 찍혀있다는 게 `watch()`와의 눈에 띄는 차이입니다.
