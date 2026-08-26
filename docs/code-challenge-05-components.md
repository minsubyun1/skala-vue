# Code Challenge - Vue Components

[← README로 돌아가기](../README.md)

경로: `/components/*` · 컴포넌트: `LifecycleExample.vue`(+`LifecycleChild.vue`), `PropsEmitsExample.vue`(+`PropsEmitsChild.vue`), `DefaultSlotExample.vue`/`NamedSlotExample.vue`/`ScopedSlotExample.vue`(+`SlotCard.vue`)

슬라이드 요구 항목: Component Lifecycle Hook Example / Props & Emits Example / Component Slot (Default/Named/Scoped)

## Component Lifecycle

자식 컴포넌트를 `v-if`로 마운트/언마운트하고, count를 증가시켜 리렌더링을 유발하면서 6개 훅이 찍히는 순서를 직접 확인합니다.

```
onBeforeMount → onMounted → (업데이트 발생) → onBeforeUpdate → onUpdated → (제거) → onBeforeUnmount → onUnmounted
```

## Props & Emits

"데이터는 위에서 아래로(Props), 이벤트는 아래에서 위로(Emits)"라는 Vue 컴포넌트 연동 구조를 그대로 보여줍니다. 부모가 `title`/`count`를 자식에게 내려주고, 자식은 버튼 클릭을 `increment`/`reset` 이벤트로 부모에게 쏘아 올립니다.

## Component Slot

하나의 자식 컴포넌트(`SlotCard.vue`)에 default/named(`header`)/scoped(`item`) 슬롯을 전부 만들어두고, 3개의 페이지에서 각각 다른 사용 패턴만 보여주도록 구성했습니다.

- **Default Slot**: 이름 없는 슬롯 자리에 부모가 넣은 내용이 그대로 렌더링
- **Named Slot**: `#header`로 이름 붙은 자리를 골라서 채움
- **Scoped Slot**: 자식이 `v-slot="{ item, index }"`로 자기 데이터를 부모 쪽 슬롯 콘텐츠에 넘겨줌
