# Code Challenge - Vue Event Handling

[← README로 돌아가기](../README.md)

경로: `/event/*` · 컴포넌트: `src/components/code-challenge/VOnBasic.vue`, `VOnEventObject.vue`, `VOnModifiers.vue`

슬라이드 요구 항목: v-on Event Handler Example / Event Object Example / Event Modifier Example

처음엔 이 세 예제를 슬라이드 목차 제목만 보고 직접 지어냈는데, 나중에 슬라이드에 실제 코드가 그대로 실려 있는 걸 발견하고 그 코드로 다시 맞췄습니다.

## v-on Event Handler

인라인 연산(`@click="count++"`)과 스크립트 함수 호출(`@click="showAlert"`) 두 가지 형태를 비교합니다.

## Event Object

버튼 클릭 시 이벤트 객체를 그대로 활용하는 두 가지 패턴을 보여줍니다.

```js
const getOnlyEvent = (e) => {
  position.value = `좌표: X=${e.clientX}, Y=${e.clientY}`
}
const getWithParam = (name, e) => {
  tagName.value = `대상: ${name} / 클릭된 태그: ${e.target.tagName}`
}
```

`@click="getOnlyEvent"`처럼 함수명만 적으면 이벤트 객체가 첫 번째 인자로 묵시적으로 전달되고, `@click="getWithParam('회원A', $event)"`처럼 다른 인자와 같이 넘기려면 `$event`를 명시적으로 적어줘야 합니다.

## Event Modifier

`.prevent`로 링크의 기본 동작(페이지 이동)을 막고, `.stop`으로 자식 버튼 클릭이 부모 영역까지 버블링되는 걸 막습니다. 두 자식 버튼 중 하나만 `.stop`을 붙여서 차이를 바로 비교할 수 있게 했습니다.
