# Code Challenge - Vue Form Handling

[← README로 돌아가기](../README.md)

경로: `/form/*` · 컴포넌트: `src/components/code-challenge/VModelBasic.vue`, `VModelFormElements.vue`, `VModelModifiers.vue`, `VueStyleExample.vue`

슬라이드 요구 항목: v-model 양방향 데이터 바인딩 / HTML Form 요소와 v-model 매핑 / v-model Modifiers / Vue Style Example

## v-model 양방향 데이터 바인딩

`v-model`이 사실 `:value` + `@input`을 하나로 묶은 문법 설탕이라는 걸 다시 확인하는 기본 예제입니다.

## HTML Form 요소와 v-model 매핑

같은 `v-model`이라도 엮이는 요소에 따라 값의 형태가 달라집니다.

- checkbox 단일 → boolean
- checkbox 여러 개(같은 v-model, 다른 value) → 배열
- radio → 선택된 value 하나
- select → 선택된 option의 value
- textarea → 문자열

## v-model Modifiers

- `.lazy` - input 이벤트 대신 change 시점에만 반영
- `.number` - 문자열이 아니라 숫자로 자동 변환
- `.trim` - 앞뒤 공백 자동 제거

## Vue Style Example

Vue 컴포넌트의 `<style>` 블록 안에서 `v-bind()`를 쓰면, JS 반응형 값을 CSS 속성값으로 그대로 흘려보낼 수 있습니다.

```css
.dynamic-text {
  color: v-bind(themeColor);
  font-size: v-bind('fontSize + "px"');
}
```

color picker나 range 슬라이더를 움직이면 별도의 클래스 토글 없이 스타일이 실시간으로 바뀝니다.
