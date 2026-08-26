# Code Challenge - Vue Form Handling

[← README로 돌아가기](../README.md)

경로: `/form/*` · 컴포넌트: `src/components/code-challenge/VModelBasic.vue`, `VModelFormElements.vue`, `VModelModifiers.vue`, `VueStyleExample.vue`

슬라이드 요구 항목: v-model 양방향 데이터 바인딩 / HTML Form 요소와 v-model 매핑 / v-model Modifiers / Vue Style Example

## v-model 양방향 데이터 바인딩

`v-model`이 사실 `:value` + `@input`을 하나로 묶은 문법 설탕이라는 걸 다시 확인하는 기본 예제입니다.

## HTML Form 요소와 v-model 매핑

같은 `v-model`이라도 엮이는 요소에 따라 값의 형태가 달라집니다. (checkbox 단일→boolean, checkbox 여러 개→배열, radio→선택된 value, select→선택된 option, textarea→문자열)

## v-model Modifiers

슬라이드 원본 예제를 그대로 가져왔습니다.

- `.lazy` - input 이벤트 대신 change 시점에만 반영
- `.number` - 문자열이 아니라 숫자로 자동 변환
- `.trim` - 앞뒤 공백 자동 제거
- **Chaining** - `v-model.trim.number`처럼 수식어를 이어 붙여서 동시에 적용 가능 (처음엔 이 체이닝 부분을 빠뜨렸다가 나중에 추가했습니다)

## Vue Style Example

`<style scoped>`와 일반 `<style>`(비-scoped)을 한 컴포넌트 안에서 같이 써서 차이를 비교합니다.

```html
<style scoped>
/* 이 컴포넌트에서만 적용 */
.title { color: #ff7675; }
</style>

<style>
/* 외부 CSS 파일을 통째로 가져와서 전역 적용 */
@import '@/assets/challenge.css';
</style>
```

`.btn-external` 클래스는 컴포넌트 안에 정의하지 않고 `src/assets/challenge.css`라는 별도 파일에 정의해두고 `@import`로 가져왔습니다. (처음엔 이 예제를 `v-bind()`로 색상을 실시간 바꾸는 다른 내용으로 잘못 만들었는데, 실제 슬라이드는 scoped + 외부 CSS import를 보여주는 예제라 이후 이걸로 다시 만들었습니다.)
