# Weather Dashboard (통합) - 핸즈온 기능 통합 데모

[← README로 돌아가기](../README.md)

경로: `/handson/weather-dashboard` (사이드바 "핸즈온 과제" 맨 위)

과제로 요구된 항목은 아닙니다. 핸즈온 1~8을 순서대로 진행하면서 화면이 여러 개로 나뉘다 보니, 실시간 검색과 지도가 서로 분리된 기능처럼 보이는 게 아쉬워서 하나로 합친 데모 화면입니다.

## 무엇을 합쳤나

핸즈온 1(Weather Mockup)의 디자인(다크 히어로 + three.js 파티클)을 그대로 가져오고, 그 위에 나머지 핸즈온에서 만든 기능을 얹었습니다.

| 출처 | 가져온 것 |
|---|---|
| 핸즈온 1 | 다크 히어로 레이아웃, three.js 상태별 배경(`WeatherScene.vue`) |
| 핸즈온 4 (Router) | 상세보기 → `router.push('/handson/weather-router/weather/' + city.id)` (같은 라우트/목데이터 재사용) |
| 핸즈온 5 (Store) | `UnitToggler`로 `configStore`의 온도·풍속 단위 전환 |
| 핸즈온 6 (Axios) | OpenWeatherMap 검색, ipwho.is 내 위치 조회, Open-Meteo + Nominatim 기반 지도 클릭 |
| 핸즈온 7 (UI Library) | `BaseDashboardCard`/`SearchBar`/`WeatherCard`/`AddCityForm`/`UnitToggler` 등 Element Plus 컴포넌트 |

## 검색과 지도를 하나의 목록으로

기존에는 "도시 이름 검색"과 "지도에서 관심 지역 추가"가 서로 다른 화면(Weather Axios)에서도 사실상 분리된 기능이었습니다. 이 화면에서는 검색 결과를 지도 클릭과 같은 방식(`upsertRegion`)으로 처리해서, 검색하면 그 즉시 지도에 마커가 찍히고 기온이 뜹니다.

```js
async function performSearch(city) {
  await owm.search(city)
  if (owm.current.value) {
    upsertRegion({
      lat: owm.current.value.lat,
      lon: owm.current.value.lon,
      name: owm.current.value.name,
      temp: owm.current.value.temp,
      status: owm.current.value.status,
      humidity: owm.current.value.humidity,
      wind: owm.current.value.wind,
    })
  }
}
```

같은 이름으로 다시 검색하면 새로 추가하지 않고 기존 항목을 갱신합니다. 이 로직은 핸즈온 6(Weather Axios)에도 그대로 적용해서, 두 화면 모두 검색 → 지도 반영이 되도록 맞췄습니다.

## 사이드바 위치

"핸즈온 과제" 그룹의 맨 위, `Weather Mockup`보다 앞에 두었습니다. 개별 핸즈온을 하나씩 보기 전에 전체가 어떻게 맞물리는지 먼저 볼 수 있게 하기 위해서입니다.

## 검증

- 도시 이름 검색(OpenWeatherMap) → 실시간 카드 표시 + 지도 마커/목록에 동시 반영 확인
- 같은 도시 재검색 시 목록이 중복되지 않고 갱신되는지 확인
- 카드 클릭 → 상세보기 → `router.push`로 핸즈온 4의 상세 페이지로 정상 이동하는지 확인
- 단위 토글(Pinia) 클릭 시 카드 온도가 실시간으로 변환되는지 확인 (27°C → 81°F)
- 나만의 도시 추가(Element Plus Form) 정상 동작 확인
- 콘솔/페이지 에러 없음 확인
