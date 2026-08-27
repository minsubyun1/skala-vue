# 핸즈온 7 - Weather UI Library

[← README로 돌아가기](../README.md)

경로: 핸즈온 4~6과 같은 화면들(`/handson/weather-router` 등)에 이어서 작업

## 과제 요구사항

▪ 외부 UI Library를 선정하고 3일차 과제에 외부 UI Library를 자유롭게 적용해 본다.

PDF 원문에는 이 문장 아래에 번호 목록(1. OpenWeatherMap API로 실제 데이터 적용 2. OpenWeatherMap 추가 API로 기능 확장 3. 기타 외부 API 추가)이 붙어 있는데, 이건 핸즈온 6(Weather Axios) 슬라이드의 요구사항 목록이 그대로 복사되어 들어간 것으로 보입니다. Weather Axios 슬라이드(5502번 줄 근처)의 목록과 문구가 완전히 동일하고, "외부 UI Library를 자유롭게 적용해 본다"라는 문장과 내용상 맞지도 않습니다. 그래서 이 핸즈온은 첫 문장(UI 라이브러리 선정 및 적용)만 실제 요구사항으로 보고 진행했습니다.

## 라이브러리 선정 - Element Plus

같은 슬라이드에서 Vue 3 생태계 UI 라이브러리로 소개된 것 중 Element Plus를 골랐습니다. Composition API와 궁합이 맞고, 폼/카드/스위치/설명 목록처럼 이번 대시보드에 바로 대응되는 컴포넌트가 많았습니다.

```bash
npm install element-plus
```

```js
// src/main.js
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
```

## 적용 범위

핵심 컴포넌트 몇 개만 교체하는 대신, Weather Router/Store 화면 전체(홈/소개/상세/통계 4개 뷰)에 넓게 적용했습니다.

| 화면/컴포넌트 | 적용한 Element Plus 컴포넌트 |
|---|---|
| `BaseDashboardCard.vue` | `ElCard` (헤더 슬롯) |
| `SearchBar.vue` | `ElInput` (clearable) |
| `WeatherCard.vue` | `ElCard`, `ElTag`(온도 배지), `ElButton` |
| `AddCityForm.vue` | `ElForm`, `ElFormItem`, `ElInput`, `ElInputNumber`, `ElSelect`/`ElOption`, `ElButton` |
| `LiveWeatherPanel.vue` | `ElInput`, `ElButton`(loading/icon), `ElCard` |
| `UnitToggler.vue` | `ElSwitch` 2개 |
| `WeatherAboutView.vue` | `ElCard`, `ElButton`(뒤로가기) |
| `WeatherDetailView.vue` | `ElCard`, `ElDescriptions`/`ElDescriptionsItem`, `ElButton` |
| `WeatherStatsView.vue` | `ElCard`, `ElDescriptions`/`ElDescriptionsItem`, `ElTag`(상태별 개수) |

## 구현 중 신경 쓴 부분

### el-input의 @input 페이로드

기존 `<input>`에서는 `@input="handleInput($event)"`로 받아서 `event.target.value`를 꺼냈는데, `el-input`의 `@input`은 DOM 이벤트가 아니라 변경된 문자열 값을 그대로 넘겨줍니다.

```js
function handleInput(value) {
  emit('update-query', value)
}
```

### 다크 테마는 html.dark 기준

Element Plus의 다크 테마 변수 파일(`theme-chalk/dark/css-vars.css`)은 `.dark`가 아니라 `html.dark` 셀렉터를 기준으로 동작합니다. 처음에는 각 화면의 최상위 `<div>`에 `dark` 클래스를 붙였는데 셀렉터가 맞지 않아 적용되지 않았고, 라우터의 `afterEach`에서 경로가 `/handson/weather-router`로 시작할 때만 `document.documentElement`에 `dark` 클래스를 토글하는 방식으로 바꿨습니다. 이 화면을 벗어나면 다시 원래(라이트) 상태로 돌아가서 다른 실습 화면에는 영향이 없습니다.

```js
// src/router/index.js
router.afterEach((to) => {
  document.documentElement.classList.toggle('dark', to.path.startsWith('/handson/weather-router'))
})
```

### 온도 배지 분류 기준은 그대로 유지

핸즈온 5에서 정한 대로, `ElTag`로 바뀐 온도 배지도 표시 단위와 무관하게 항상 섭씨 원본 값으로 danger/warning/primary/info 타입을 정합니다.

## 검증

- `npm run lint`, `npm run build` 통과 확인
- Playwright로 홈/소개/상세/통계 4개 화면을 순회하며 `el-card`/`el-switch`/`el-descriptions`/`el-tag`가 렌더링되는지 개수로 확인
- 검색 필터(`el-input`), 단위 토글(`el-switch`), 도시 추가 폼(`el-form` 계열), 상세보기 이동(`router.push`)까지 기존 기능이 모두 그대로 동작하는지 확인
- 콘솔/페이지 에러 없음 확인
