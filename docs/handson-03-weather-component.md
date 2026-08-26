# 핸즈온 3 - Weather Component

[← README로 돌아가기](../README.md)

경로: `/handson/weather-component` · 컴포넌트: `src/components/handson/WeatherParent.vue` 외 6개

## 과제 요구사항

기능 변경 없이 Weather Mockup을 아래 4개 컴포넌트로 분리합니다.

1. `WeatherParent.vue` - 모든 반응형 데이터 유지
2. `BaseDashboardCard.vue` - 검색박스/리스트박스 공통 카드 디자인, `<slot>`으로 내용 주입
3. `SearchBar.vue` - 검색어를 props로 받아 표시, `update-query` 이벤트로 부모에 검색어 전달
4. `WeatherCard.vue` - 도시 객체를 props로 받아 표시, `select-card`/`click-detail` 이벤트를 부모에 전달
5. 각 컴포넌트는 `<style scoped>`로 디자인 분리
6. 본인 판단으로 추가 컴포넌트 분리 가능

## 구현 내용

Weather Mockup(핸즈온 1)과 완전히 같은 기능을 새 라우트(`/handson/weather-component`)에서 컴포넌트 트리로 다시 짰습니다. 데이터·로직은 그대로 복사했고, 템플릿만 4개 컴포넌트로 쪼갰습니다.

요구사항 6번("본인 판단으로 추가 분리")에 맞춰 3개를 더 뽑아냈습니다.

- `AddCityForm.vue` - 도시 추가 폼, `add-city` 이벤트로 새 도시 데이터를 부모에 전달
- `LiveWeatherPanel.vue` - 실시간 날씨 조회 UI. `isLoading`/`error`/`result`는 부모가 들고 있는 `useLiveWeather()` composable 상태를 그대로 props로 받고, `search` 이벤트로 조회를 요청한다.
- `NowPanel.vue` - 상단 "지금 날씨" 요약 패널

여기에 핸즈온 1에서 이미 분리해뒀던 `WeatherScene.vue`(three.js 배경), `WeatherGlyph.vue`(아이콘), `WeatherDetailModal.vue`(상세보기 모달)도 그대로 재사용했습니다.

## 적용한 핵심 개념

### 왜 컴포넌트를 나누는가

Vue 공식 가이드의 [Component Basics](https://vuejs.org/guide/essentials/component-basics.html)는 컴포넌트를 재사용 가능하고 독립적인 코드 조각으로 다루라고 설명합니다. `WeatherMockup.vue` 하나에 검색·카드·모달·폼이 전부 들어있으면 파일 하나가 비대해져서 특정 기능을 수정할 때 관련 없는 코드까지 다 훑어야 합니다. 이번 과제에서는 그 파일을 역할 단위로 쪼갰고, 그 결과:

- `WeatherCard`는 카드 한 장을 어떻게 그릴지만 알면 됩니다(원본 배열 위치·검색 로직은 몰라도 됨).
- `BaseDashboardCard`는 카드 테두리 디자인만 책임지고, 안에 뭐가 들어가는지는 몰라도 됩니다.
- `WeatherParent`는 언제 무엇을 보여줄지 상태 관리에만 집중하고, 개별 UI의 세부 마크업은 몰라도 됩니다.

이렇게 관심사가 겹치지 않게 나누는 설계 원칙을 소프트웨어 공학에서는 흔히 단일 책임(Single Responsibility) 원칙이라고 부릅니다. Vue 자체 용어는 아니고 일반적인 설계 원칙인데, 컴포넌트를 나눌 때도 그대로 적용됩니다.

### Props - 단방향 데이터 흐름

```js
// WeatherCard.vue
defineProps({ city: { type: Object, required: true } })
```

공식 문서의 [Props](https://vuejs.org/guide/components/props.html) 챕터는 props가 부모→자식으로만 흐르는 단방향(One-Way) 바인딩이라고 설명합니다. 자식이 props를 직접 변경하는 건 안티패턴으로 취급되고 Vue가 개발 모드에서 경고를 띄우는데, 이 프로젝트에서도 `WeatherCard`는 `city`를 화면에 그리기만 할 뿐 `city.temp = ...`처럼 직접 고치지 않습니다. 값을 바꾸고 싶으면 무조건 이벤트를 emit해서 부모에게 요청하는 구조를 지켰습니다. `type`/`required`를 명시해서 잘못된 타입의 데이터가 들어오면 개발 중 콘솔에 경고가 뜨도록 했습니다([Props Validation](https://vuejs.org/guide/components/props.html#prop-validation)).

### Emits - 커스텀 이벤트

```js
// SearchBar.vue
const emit = defineEmits(['update-query'])
```

공식 문서의 [Custom Events](https://vuejs.org/guide/components/events.html) 챕터는 이벤트 이름을 kebab-case로 짓기를 권장합니다. 템플릿의 HTML 속성 표기 관례와 맞추기 위해서입니다. 그래서 `updateQuery`가 아니라 `update-query`, `selectCard`가 아니라 `select-card`로 이름 지었습니다. 부모는 `@update-query="..."`처럼 그대로 받아서 처리합니다. `defineEmits`에 이벤트 이름을 배열로 먼저 선언해두는 것도, 이 컴포넌트가 내보낼 수 있는 이벤트 목록을 코드만 보고 파악할 수 있게 하는 문서화 역할을 합니다.

### Slot - 콘텐츠와 스코프

```html
<BaseDashboardCard>
  <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />
</BaseDashboardCard>
```

공식 문서의 [Slots](https://vuejs.org/guide/components/slots.html) 챕터에 나오는 규칙을 그대로 확인했습니다: 부모 템플릿 안에 작성된 슬롯 콘텐츠는 부모의 스코프에서 컴파일됩니다. `SearchBar`는 시각적으로 `BaseDashboardCard`의 `<slot>` 안에 위치하지만, `:search-query`와 `@update-query`는 `BaseDashboardCard`가 아니라 `WeatherParent`의 스코프에서 그대로 평가됩니다. `BaseDashboardCard`는 이 코드 조각 안에 어떤 변수가 쓰이는지 전혀 몰라도 되고, 전달받은 마크업을 정해진 위치에 배치만 합니다. 그래서 별도의 전달 처리 없이도 `WeatherParent`의 데이터에 바로 접근할 수 있었습니다.

## Provide/Inject는 적용하지 않았습니다

슬라이드에도 Provide/Inject 개념 설명은 있었지만, Hands-on 3 요구사항이나 Code Challenge 목록 어디에도 포함되어 있지 않아 이번 과제에는 쓰지 않았습니다. 공식 문서의 [Provide / Inject](https://vuejs.org/guide/components/provide-inject.html) 챕터에 따르면 이 기능은 Props Drilling, 즉 중간 컴포넌트가 필요도 없는 데이터를 그냥 통과만 시켜야 하는 문제를 해결하기 위한 것입니다. 이 컴포넌트 트리는 `WeatherParent → BaseDashboardCard(slot) → SearchBar/WeatherCard`로 최대 2단계밖에 안 되고, `BaseDashboardCard`는 애초에 아무 데이터도 중계하지 않기 때문에(슬롯이라 통과시킬 필요조차 없음) Props Drilling 자체가 발생하지 않았습니다. 트리가 3~4단계 이상으로 깊어지는 상황이 생기면 그때 Provide/Inject를 검토하는 게 맞다고 생각합니다.

## 검증

Playwright로 검색 필터링, 카드 클릭 → 상태바 갱신, 상세보기 버튼의 `.stop`(카드 클릭과 분리되는지), 도시 추가, 실시간 검색(Tokyo)까지 Weather Mockup과 동일하게 동작하는 걸 확인했습니다.

검색 필터 테스트 중에 한 번 카드 8개가 그대로 남아있는 것처럼 잘못 나온 적이 있었는데, 알고 보니 제 테스트 스크립트의 대기 시간(300ms)이 `TransitionGroup`의 카드 삭제 애니메이션 길이(0.3s)와 정확히 겹쳐서, 애니메이션 도중(DOM에서 아직 안 지워진 상태)에 개수를 센 것이었습니다. 실제 버그는 아니었고, 대기 시간을 늘려서 정상 동작을 재확인했습니다.
