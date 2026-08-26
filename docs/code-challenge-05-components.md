# Code Challenge - Vue Components

[← README로 돌아가기](../README.md)

경로: `/components/*` · 컴포넌트: `LifecycleExample.vue`(+`LifecycleChild.vue`), `PropsEmitsExample.vue`(+`PropsEmitsChild.vue`), `DefaultSlotExample.vue`/`NamedSlotExample.vue`/`ScopedSlotExample.vue`(+각각 전용 Child 컴포넌트)

슬라이드 요구 항목: Component Lifecycle Hook Example / Props & Emits Example / Component Slot (Default/Named/Scoped)

## Component Lifecycle

처음엔 "6개 훅을 다 보여주는 예제"로 직접 만들었는데(버튼 눌러서 count++), 나중에 슬라이드의 실제 예제 코드를 보니 완전히 다른 내용이었습니다. **3초마다 자동으로 증가하는 타이머**를 `onMounted`에서 켜고, `onUpdated`에서 그때의 count를 로그로 남기고, `onUnmounted`에서 `clearInterval`로 타이머를 정리하지 않으면 컴포넌트가 사라져도 메모리 누수가 난다는 게 핵심 교훈이었습니다.

```js
onMounted(() => {
  timerId = setInterval(() => { count.value++ }, 3000)
})
onUpdated(() => {
  log(`3. [onUpdated] ... 현재 count: ${count.value}`)
})
onUnmounted(() => {
  clearInterval(timerId) // 이거 안 하면 백그라운드에서 타이머가 영원히 돈다
})
```

부모에서 `v-if`로 자식을 껐다 켰다 하면서 mount → (3초마다 update) → unmount 전체 흐름을 로그로 확인할 수 있습니다.

## Props & Emits

슬라이드 원본 그대로 `parentData` prop과 `update-request` emit 이벤트 이름을 썼습니다. 부모가 `message`라는 로컬 상태를 자식에게 prop으로 내려주고, 자식은 버튼을 누르면 `update-request` 이벤트로 새 문자열을 부모에게 올려보내서 부모의 `message`를 갱신합니다.

## Component Slot

슬라이드가 Default/Named/Scoped 슬롯마다 별도의 자식 컴포넌트를 쓰고 있어서(`SlotDefaultChild`, `SlotNamedChild`, `SlotScopedChild`), 처음에 하나로 통합해서 만들었던 공용 컴포넌트를 버리고 3개로 다시 쪼갰습니다.

- **Default Slot**: 자식을 3번 사용하는데, 마지막 하나는 내용을 안 채워서 `<slot>` 태그 안의 기본 콘텐츠가 대신 나오는 걸 보여줍니다.
- **Named Slot**: `<template v-slot:header>`로 이름 붙은 자리를 채우고, 본문은 기본 슬롯으로 채웁니다.
- **Scoped Slot**: 자식이 `:text="message" :count="userCount"`로 자기 데이터를 슬롯에 실어 보내면, 부모는 `v-slot="slotBag"`로 통째로 받아서 `slotBag.text`, `slotBag.count`로 꺼내 씁니다. 여기도 부모가 내용을 안 채운 두 번째 사용에서는 자식의 기본 콘텐츠가 나옵니다.
