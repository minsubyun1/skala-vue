# 핸즈온 5 - Weather Store

[← README로 돌아가기](../README.md)

경로: 핸즈온 4(Weather Router)와 같은 화면들(`/handson/weather-router` 등)에 이어서 작업

## 과제 요구사항

`stores/configStore.js`:

| | 이름 | 내용 |
|---|---|---|
| state | `unit` | 단위를 저장하는 변수 (초기값: celsius) |
| getters | `unitSymbol` | 현재 단위 상태에 맞는 기호 (℃ / ℉) |
| actions | `toggleUnit` | 'celsius'와 'fahrenheit'를 토글하는 함수 |

1. `UnitToggler.vue`: 대시보드 상단에 배치되어 단위 설정을 변경하는 UI
2. Navigation Bar 옆에 `UnitToggler.vue` 배치
3. 메인과 상세 날씨에 단위 설정 변경 적용
4. 본인만의 추가 Store를 작성하거나, `configStore`에 state/getter/action 추가

## 구현 내용

### 1. configStore.js

요구사항 표 그대로 만들었습니다.

```js
export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }
  return { unit, unitSymbol, toggleUnit /* ... */ }
})
```

### 2. UnitToggler.vue + Navigation Bar 배치

핸즈온 4에서 만든 `WeatherRouterNav.vue`(홈/소개/통계 이동 바) 옆에 `<UnitToggler />`를 나란히 놓았습니다. `WeatherHomeView`/`WeatherAboutView`/`WeatherDetailView`/`WeatherStatsView` 네 화면 전부 같은 배치입니다.

```html
<div class="nav-row">
  <WeatherRouterNav />
  <UnitToggler />
</div>
```

### 3. 메인/상세 화면에 단위 적용

슬라이드에 나온 `displayTemp` computed 패턴을 그대로 썼습니다.

```js
const displayTemp = computed(() => {
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
```

`components/exercise/WeatherCard.vue`(메인 카드)와 `WeatherDetailView.vue`(상세 페이지) 둘 다 원본 데이터(`city.temp`)는 항상 섭씨로 유지하고, 화면에 보여줄 때만 `displayTemp`로 변환합니다. 온도별 배지(폭염/더움/선선함/쌀쌀함) 분류는 일부러 변환 전 섭씨 원본 값으로 판단하게 뒀습니다 — 화씨로 바꿔서 "폭염(30도 이상)"이라고 쓰여있는데 실제로는 화씨 30도(=영하권)인 상황이 생기면 오히려 헷갈리기 때문입니다.

### 4. 본인 추가 - 풍속 단위 토글

`configStore`에 같은 패턴으로 `windUnit`(state) / `windUnitLabel`(getter) / `toggleWindUnit`(action)을 추가해서, `UnitToggler.vue`에 버튼을 하나 더 뒀습니다. m/s ↔ km/h 변환(`× 3.6`)도 메인 카드와 상세 페이지에 동일하게 적용했습니다.

## Pinia라서 가능했던 것

홈 화면에서 화씨로 바꾸고 카드 상세보기를 눌러 `WeatherDetailView`(완전히 다른 라우트, 다른 컴포넌트 인스턴스)로 이동해도 단위 설정이 그대로 유지되는 걸 확인했습니다. `WeatherHomeView`와 `WeatherDetailView`는 부모-자식 관계가 전혀 아닌데도 같은 `configStore` 인스턴스를 참조하기 때문입니다 — 이 부분이 지난번 이야기했던 "Pinia는 컴포넌트 트리 위치와 무관하게 상태를 공유한다"는 걸 실제로 확인한 지점입니다.

## 검증

Playwright로 온도 변환(27℃ → 81℉, 반올림 확인), 풍속 변환(3.1m/s → 11.2km/h), 그리고 홈에서 바꾼 단위 설정이 상세 페이지로 이동해도 유지되는지까지 확인했습니다.
