# Code Challenge - Vue Event Handling

[← README로 돌아가기](../README.md)

경로: `/event/*` · 컴포넌트: `src/components/code-challenge/VOnBasic.vue`, `VOnEventObject.vue`, `VOnModifiers.vue`

슬라이드 요구 항목: v-on Event Handler Example / Event Object Example / Event Modifier Example

## v-on Event Handler

메서드 핸들러(`@click="increment"`)와 인라인 핸들러(`@click="clickCount += 10"`), 인자를 전달하는 인라인 핸들러(`@click="greet('Skala')"`) 세 가지 형태를 비교했습니다.

## Event Object

네이티브 이벤트 객체가 실제로 어떤 정보를 담고 있는지 확인하는 예제입니다. 마우스 좌표(`event.clientX/clientY`)와 키보드 입력(`event.key`)을 화면에 바로 출력합니다.

```js
function trackMouse(event) {
  mousePos.value = { x: event.clientX, y: event.clientY }
}
function trackKey(event) {
  lastKey.value = event.key
}
```

## Event Modifier

`.stop`(버블링 중단), `.prevent`(기본 동작 방지), `.once`(한 번만 실행), `.enter`(키 수식어) 네 가지를 각각 눌러보고 로그로 확인할 수 있게 만들었습니다.
