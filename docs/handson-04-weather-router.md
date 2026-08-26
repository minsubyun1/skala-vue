# 핸즈온 4 - Weather Router

[← README로 돌아가기](../README.md)

경로: `/handson/weather-router` (+ `/about`, `/weather/:cityId`, `/stats`)

## 과제 요구사항

프로젝트 폴더 트리 지정:

```
src/
├── main.js               # 라우터 인스턴스 전역 주입
├── App.vue                # Navigation Bar(RouterLink) + RouterView
├── router/index.js        # routes 배열, Lazy Loading
├── components/exercise/   # BaseDashboardCard.vue, SearchBar.vue, WeatherCard.vue
└── views/
    ├── WeatherHomeView.vue
    ├── WeatherAboutView.vue
    ├── WeatherDetailView.vue
    └── NotFoundView.vue
```

1. Vue Router 설정: 라우터 지연 로딩, Catch-all Route 적용
2. App.vue: Navigation Bar(RouterLink) + 메인 콘텐츠 영역(RouterView)
3. WeatherHomeView.vue: WeatherParent 대체. 상세보기 버튼은 `window.alert()`/모달 대신 Programmatic Navigation(`router.push`)
4. WeatherDetailView.vue: `:cityId` 동적 라우트로 도시 상세 정보 표시, Mock Data에서 Mount 시점에 조회
5. WeatherAboutView.vue: 소개 내용 + 메인으로 돌아가기
6. 본인 추가 view 작성 및 라우팅

## 구현 내용

### 폴더 구조는 요구사항 그대로 따랐습니다

처음에 `BaseDashboardCard`/`SearchBar`/`WeatherCard`를 핸즈온 3에서 쓰던 `components/handson/` 걸 재사용하려고 했는데, 슬라이드가 `components/exercise/`라는 이름으로 명시해뒀길래 재사용 대신 그 이름으로 새로 만들었습니다(내용은 기존 것과 동일). `WeatherGlyph`/`AddCityForm`/`LiveWeatherPanel`/`NowPanel`/`WeatherScene`처럼 슬라이드에 이름이 안 나온 것들은 계속 `components/handson/`에 둡니다.

### App.vue의 Navigation Bar 요구사항

이 프로젝트는 처음부터 `App.vue`에 사이트 전체 사이드바(`RouterLink` 모음)와 `RouterView`가 이미 있어서, 요구사항 2번은 기존 구조로 이미 충족됩니다. 다만 사이드바는 전체 실습 목록용이라 Weather Router 전용 내비게이션과는 성격이 다르다고 판단해서, `WeatherRouterNav.vue`라는 작은 내비게이션 바를 따로 만들어 `WeatherHomeView`/`WeatherAboutView`/`WeatherDetailView`/`WeatherStatsView` 화면 안에 공통으로 넣었습니다. `<RouterLink>`로 홈/소개/통계를 오가는 실제 요구사항(Navigation Bar)은 이 컴포넌트가 담당합니다.

### WeatherHomeView - Programmatic Navigation

핸즈온 3의 `WeatherParent.vue`를 그대로 가져오고, 상세보기 버튼 핸들러만 바꿨습니다.

```js
// 이전(핸즈온 3): 모달을 여는 방식
function handleClickDetail(city) {
  detailCity.value = city
}

// 이번(핸즈온 4): 라우터로 페이지 이동
function handleClickDetail(city) {
  router.push(`/handson/weather-router/weather/${city.id}`)
}
```

### WeatherDetailView - 동적 라우트 + Mock Data

```js
const route = useRoute()
const city = ref(null)

onMounted(() => {
  const found = weatherMockData.find((item) => item.id === route.params.cityId)
  city.value = found ?? null
})
```

`WeatherHomeView`와 `WeatherDetailView`는 서로 다른 라우트, 즉 서로 다른 컴포넌트 인스턴스라서 메모리를 공유하지 않습니다. 그래서 두 화면이 같이 참조할 수 있는 정적 목데이터 모듈(`src/data/weatherMockData.js`)을 따로 빼뒀습니다. 홈 화면에서 "나만의 도시 추가하기"로 새로 만든 도시는 이 목데이터에는 없어서, 그 도시의 상세보기로 들어가면 "관측 데이터를 찾을 수 없습니다" 안내가 뜨도록 처리했습니다 — 실제 서비스라면 API 호출로 대체될 부분이라, 요구사항 문구("Mock Data를 임시로 활용")에 맞춰 이 정도 선에서 정리했습니다.

### Catch-all Route

```js
// router/index.js, routes 배열의 가장 마지막
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
}
```

정의되지 않은 아무 경로로나 들어가면 `NotFoundView`가 뜨는 걸 확인했습니다. `weather-router` 하위 경로 전용 catch-all을 따로 만들지는 않았는데, 이 라우트 하나가 앱 전체의 모든 미정의 경로를 이미 커버하기 때문입니다.

### 본인 추가 view - WeatherStatsView

요구사항 6번에 맞춰 통계 페이지를 하나 더 만들었습니다. 목데이터를 computed로 가공해서 평균 기온·최고/최저 기온 도시·날씨 상태별 도시 수를 보여줍니다. 별도 상태 없이 순수 계산만 하는 페이지라 `computed()` 활용 사례를 하나 더 늘린 셈입니다.

## 검증

Playwright로 홈에서 상세보기 클릭 시 alert/모달 없이 `router.push`로 URL이 실제로 바뀌는지, 소개/통계 페이지 이동, 존재하지 않는 도시 코드 처리, 그리고 아무 경로나 쳤을 때 Catch-all Route가 NotFoundView를 띄우는지까지 전부 확인했습니다.
