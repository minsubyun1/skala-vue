# 핸즈온 1 - Weather Mockup

[← README로 돌아가기](../README.md)

경로: `/handson/weather-mockup` · 컴포넌트: `src/components/handson/WeatherMockup.vue`

## 과제 요구사항

1. 배열 렌더링 (v-for): 임의의 날씨 데이터 배열을 카드로 반복 출력, `:key`에 id 바인딩
2. 조건부 렌더링 (v-if): 기온 기준으로 라벨 분기 (조건은 자유)
3. 양방향 바인딩 및 한글 처리 (`:value`, `@input`): 도시 이름 검색
4. 이벤트 및 수식어: 카드 클릭 시 상태바 갱신, 상세보기 버튼은 `.stop`으로 버블링 방지, `window.alert`로 상세 정보 표시
5. 본인만의 데이터를 추가하고 이를 기초로 Mockup 추가

## 구현 내용

예시 데이터(서울/수원/부산)를 그대로 쓰지 않고 도시 8곳(인천·대전·광주·울산·제주·강릉·전주·포항)으로 새로 구성했습니다. 습도·풍속 필드도 추가했습니다.

온도 라벨은 요구사항에 나온 2단계(더움/선선함) 대신 4단계(폭염/더움/선선함/쌀쌀함)로 세분화했습니다.

"OO이 선택되었습니다" 문구를 그냥 하드코딩하면 "여수가"가 "여수이"로 출력되는 문제가 있어서, 이름 마지막 글자의 받침 유무를 판별해 조사(이/가)를 자동으로 붙이는 함수를 작성했습니다.

상세보기는 처음에 요구사항대로 `alert()`로 구현했는데, 눌러볼수록 UX가 별로여서 모달로 바꿨습니다. `.stop` 수식어는 그대로 유지했습니다 — 지우면 상세보기를 누를 때 카드 클릭 이벤트까지 같이 발생합니다.

디자인을 더 다듬어보라는 피드백을 받고 나서 three.js로 배경에 파티클 효과를 추가했습니다. 날씨 상태(맑음/비/눈/구름/안개)에 따라 파티클의 색상과 움직임이 달라집니다. 이후 실시간 날씨 조회 기능도 추가했는데, API Key가 필요 없는 Open-Meteo를 사용했습니다.

## 주요 기능 구현

### 온도별 라벨 분류

`v-if` / `v-else-if` / `v-else`를 연달아 써서 4단계로 나눴습니다.

```html
<p v-if="city.temp >= 30" class="badge badge-hot">🔥 폭염 (30도 이상)</p>
<p v-else-if="city.temp >= 25" class="badge badge-warm">🌡️ 더움 (25도 이상)</p>
<p v-else-if="city.temp >= 18" class="badge badge-cool">🍃 선선함 (18~24도)</p>
<p v-else class="badge badge-cold">🧊 쌀쌀함 (18도 미만)</p>
```

### 검색 필터링 (computed)

```js
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})
```

검색어가 비어 있으면 원본 배열을 그대로 반환합니다. 템플릿에서는 이 배열의 길이로 "전체 출력 / 필터된 결과 출력 / 일치하는 도시 없음" 세 가지 상태를 분기합니다.

### 조사(이/가) 자동 처리

한글 완성형 문자는 유니코드 상에서 (초성·중성·종성) 조합으로 계산할 수 있다는 점을 이용해서, 이름 마지막 글자에 받침이 있는지 판별하는 함수를 만들었습니다.

```js
function withSubjectParticle(name) {
  const lastChar = name.charCodeAt(name.length - 1) - 0xac00
  const hasBatchim = lastChar >= 0 && lastChar <= 11171 && lastChar % 28 !== 0
  return `${name}${hasBatchim ? '이' : '가'}`
}
```

`(완성형 문자 코드 - 0xAC00) % 28`이 0이면 받침 없음, 아니면 받침 있음이라는 한글 유니코드 조합 규칙을 이용한 것입니다.

### 날씨 상태 분류 (WMO 코드 → 5개 상태)

Open-Meteo 현재 날씨 API는 날씨를 WMO 코드(정수)로 내려주는데, 이 프로젝트는 화면에서 맑음/구름/비/눈/안개 5개 상태만 쓰기 때문에 매핑 테이블을 만들어 변환했습니다.

```js
// src/api/openMeteo.js
const WMO_STATUS_MAP = {
  0: '맑음', 1: '맑음',
  2: '구름', 3: '구름',
  45: '안개', 48: '안개',
  51: '비', 53: '비', 55: '비', 56: '비', 57: '비',
  61: '비', 63: '비', 65: '비', 66: '비', 67: '비',
  71: '눈', 73: '눈', 75: '눈', 77: '눈',
  80: '비', 81: '비', 82: '비',
  85: '눈', 86: '눈',
  95: '비', 96: '비', 99: '비',
}

export function weatherCodeToStatus(code) {
  return WMO_STATUS_MAP[code] ?? '구름'
}
```

로컬 데이터(`weatherList`)는 처음부터 5개 상태 문자열을 직접 넣어뒀고, 실시간 조회 결과만 이 함수를 거쳐서 같은 5개 상태로 맞춥니다.

### three.js 상태별 파티클 연출

날씨 상태마다 파티클의 색상·개수·움직임 방식을 다르게 주기 위해, 상태를 key로 하는 프리셋 객체를 만들어 관리했습니다.

```js
// src/components/handson/WeatherScene.vue
const STATUS_PRESET = {
  맑음: { mode: 'dust', color: 0xffe1a3, count: 50 },
  구름: { mode: 'none', color: 0xcfd8e3, count: 0 },
  비: { mode: 'rain', color: 0x9ecbff, count: 420 },
  눈: { mode: 'snow', color: 0xffffff, count: 260 },
  안개: { mode: 'fog', color: 0xb9c2cf, count: 50 },
}
```

`mode` 값에 따라 파티클을 다르게 생성합니다. `rain`은 `THREE.LineSegments`로 실제 빗줄기처럼 사선을 그리고, `snow`/`fog`/`dust`는 `THREE.Points`에 캔버스로 직접 그린 부드러운 원형 텍스처를 입혀서 표현했습니다. `props.status`가 바뀌면 `watch`로 감지해서 파티클을 다시 생성합니다.

### 상세보기 모달 (.stop + Teleport)

```html
<article class="weather-card" @click="selectCity(city)">
  ...
  <button class="detail-btn" @click.stop="showDetail(city)">상세보기</button>
</article>
```

`.stop`을 붙이지 않으면 상세보기 버튼을 눌렀을 때 카드의 `@click`(도시 선택)까지 같이 발생합니다. 모달 자체는 `<Teleport to="body">`로 DOM 최상단에 렌더링해서 부모 요소의 `overflow`/`z-index`에 영향받지 않게 했고, `Escape` 키와 배경 클릭으로도 닫히게 만들었습니다.

## 트러블슈팅

### 태양 발광 효과(Bloom)를 세게 줬더니 카드 글씨까지 하얗게 씻겨나감

`WeatherScene.vue`에 `UnrealBloomPass`로 태양 발광 효과를 추가했는데, 처음 설정한 `strength` 값으로는 화면 전체가 뿌옇게 번져서 카드 텍스트가 거의 안 보이는 수준이 됐습니다. 발광 스프라이트의 크기·색상 값을 낮추고, `strength`/`threshold` 값도 같이 낮춰가면서 확인한 끝에 카드 내용은 읽히면서 태양만 은은하게 빛나는 값을 찾았습니다.

### 구름을 3D로 만들었더니 마인크래프트 블록처럼 보임

같은 파일에서 구름을 `IcosahedronGeometry(radius, 0)`로 표현했는데, 조명이 없는 재질(`MeshBasicMaterial`)이라 면과 면 사이 각진 경계가 그대로 드러나서 저해상도 블록처럼 보였습니다. 각진 도형 대신, 빗방울·눈에 쓰던 것과 같은 부드러운 원형 그라디언트 텍스처를 입힌 스프라이트로 바꿔서 해결했습니다.

### 그 스프라이트를 정리하다가 태양·달까지 같이 사라짐

구름 스프라이트를 언마운트할 때 `geometry.dispose()`와 `material.dispose()`를 같이 호출하도록 짰는데, 페이지를 왔다갔다 하니 태양이랑 달 이펙트까지 이상해지는 현상이 있었습니다. 찾아보니 three.js의 `Sprite`는 geometry를 인스턴스끼리 공유하는 구조라, 구름 스프라이트의 geometry를 지우면 같은 geometry를 쓰는 태양·달 스프라이트까지 영향을 받는 것이었습니다. geometry는 그대로 두고 material만 정리하도록 고쳤습니다.

### 실시간 검색에 "서울"을 치면 결과가 안 나옴

`openMeteo.js`의 지오코딩 함수에 "서울"을 그대로 넘기면 결과가 0건으로 돌아왔습니다. 같은 요청을 "Seoul"로 바꿔서 보내보니 정상적으로 매칭되는 걸 확인했고, 자주 검색될 만한 도시 이름을 영문으로 미리 바꿔서 요청하는 매핑 테이블을 추가해 해결했습니다.

### 배경 사진 API가 계속 503을 뱉음

날씨 상태별 배경 이미지를 `source.unsplash.com`의 키워드 기반 랜덤 이미지 URL로 불러오려 했는데 계속 503 에러가 났습니다. 직접 주소를 열어보니 해당 서비스 자체가 종료된 상태였고, 대신 `images.unsplash.com`에 특정 사진 ID로 직접 링크하는 방식으로 바꿔서 해결했습니다.
