# 핸즈온 2 - Weather Composition

[← README로 돌아가기](../README.md)

경로: `/handson/weather-composition` · 컴포넌트: `src/components/handson/WeatherComposition.vue`

computed / watch / watchEffect 활용을 연습하는 과제입니다. 데이터는 핸즈온 1(Weather Mockup)에서 쓰던 목록을 그대로 재사용했습니다.

## 과제 요구사항

1. 반응형 상태 관리: 검색어(`searchQuery`), 선택된 도시(`selectedCityInfo`), 지역별 날씨 데이터 배열(`weatherList`)을 반응형 상태로 정의
2. 검색 도시 (computed 활용): 검색어가 도시 이름에 포함된 항목만 필터링한 `filteredWeatherList`
3. 반응형 변수 변화 감시: `selectedCityInfo`는 watch로, `searchQuery`는 watchEffect로 감시하며 각각 콘솔로그 작성
4. 검색 결과 표시: 검색어가 비었을 때는 원본, 일치 데이터가 있으면 해당 데이터, 없으면 안내 문구
5. 본인만의 반응형 상태 변수, computed, watcher 추가

## 구현 내용

요구사항에 명시된 변수명(`searchQuery`, `selectedCityInfo`, `weatherList`, `filteredWeatherList`)을 그대로 사용했습니다.

콘솔을 매번 열어서 확인하기 번거로워서, 로그를 화면 하단에도 함께 출력하도록 만들었습니다(터미널처럼 생긴 로그 패널). `pushLog` 함수 하나로 `console.log`와 화면 출력을 동시에 처리합니다.

본인 추가 요구사항은 즐겨찾기(별표) 기능으로 채웠습니다 — 상태 변수 1개, computed 1개(즐겨찾기 개수), watch 1개.

이후 디자인을 카드 그리드 형태로 다듬고, 상세보기도 Mockup에서 만든 모달 컴포넌트(`WeatherDetailModal.vue`)를 그대로 재사용해서 `alert()` 대신 모달로 띄우도록 바꿨습니다.

## 주요 기능 구현

### watch와 watchEffect, 왜 나눠 썼는가

둘 다 반응형 값이 바뀌면 자동으로 다시 실행된다는 점은 같지만, 이 과제에서는 의도적으로 다른 이유로 나눠 썼습니다.

```js
// selectedCityInfo(상태바 문구)가 바뀔 때만 반응 — 감시 대상이 명확한 경우
watch(selectedCityInfo, (next) => {
  pushLog('👁️ watch', `상태바 문구 변경 -> "${next}"`)
})

// searchQuery뿐 아니라 filteredWeatherList까지 콜백 안에서 자동으로 추적됨
watchEffect(() => {
  pushLog('🔔 watchEffect', `검색어 "${searchQuery.value}" 로 필터링 -> ${filteredWeatherList.value.length}건`)
})
```

`watch`는 감시 대상을 첫 번째 인자로 명시적으로 지정하고, 콜백에서 이전 값과 새 값을 둘 다 받을 수 있습니다. `watchEffect`는 감시 대상을 따로 안 적어도 콜백 안에서 `.value`로 읽은 반응형 값을 전부 자동으로 추적합니다. 위 코드의 watchEffect는 `searchQuery.value`와 `filteredWeatherList.value` 두 개를 동시에 참조하고 있는데, 둘 다 별도 등록 없이 알아서 추적됩니다.

### 검색 필터링 (computed)

```js
const filteredWeatherList = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return weatherList.value
  return weatherList.value.filter((c) => c.name.includes(q))
})
```

Mockup 과제와 로직은 거의 동일합니다. 검색어가 비어 있으면 원본을 그대로 반환하고, 템플릿에서는 이 배열의 길이(`length === 0`)로 "검색 결과와 일치하는 도시가 없습니다" 안내를 분기합니다.

### 즐겨찾기 기능 (본인 추가 요구사항)

도시 id를 배열에 담아두는 방식으로 구현했습니다.

```js
const favoriteIds = ref([])
const favoriteCount = computed(() => favoriteIds.value.length)

function toggleFavorite(city) {
  const idx = favoriteIds.value.indexOf(city.id)
  if (idx === -1) favoriteIds.value.push(city.id)
  else favoriteIds.value.splice(idx, 1)
}

watch(
  favoriteIds,
  (list) => pushLog('⭐ watch', `즐겨찾기 ${list.length}개로 변경됨`),
  { deep: true },
)
```

## 트러블슈팅

### 즐겨찾기를 눌러도 watch 콜백이 안 찍힘

처음에는 `watch(favoriteIds, ...)`만 쓰고 별을 눌러봤는데 로그가 하나도 안 찍혔습니다. `favoriteIds`는 `ref([])`라서 배열 자체를 재할당하지 않고 `push`/`splice`로 안쪽 값만 바꾸는 얕은 변경은 기본 watch로 감지가 안 된다는 걸 뒤늦게 확인했습니다. 세 번째 인자로 `{ deep: true }`를 넘겨주니 정상적으로 로그가 찍혔습니다.
