# 핸즈온 6 - Weather Axios

[← README로 돌아가기](../README.md)

경로: `/handson/weather-axios`

## 과제 요구사항

▪ Axios 활용 준비
1. Axios 라이브러리 설치
2. OpenWeatherMap API 가입 및 Key 발급

▪ 과제 요구사항
1. OpenWeatherMap API를 통해 실제 날씨 데이터를 가져와 적용한다.
2. OpenWeatherMap에서 제공되는 API를 추가하여 Application 기능을 확장한다.
3. 기타 외부 API를 추가하여 Application 기능을 확장한다.

## API Key 관련

Axios는 핸즈온 1(Weather Mockup)에서 Open-Meteo 연동할 때 이미 설치해뒀어서 새로 설치할 건 없었습니다. OpenWeatherMap API Key는 개인 계정으로 발급받아야 하는 부분이라, 발급받은 키를 `.env.local`에 `VITE_OPENWEATHERMAP_API_KEY`로 넣어뒀습니다 (`.gitignore`의 `*.local` 규칙에 걸려 git에는 올라가지 않습니다).

발급 직후에 테스트해보니 `401 Invalid API key`가 떴는데, OpenWeatherMap은 키 발급 후 활성화까지 시간이 걸리는 게 잘 알려진 특성이라 코드/에러 처리까지 전부 만들어두고, 실제 데이터 확인은 키가 활성화된 뒤로 미뤘습니다.

```js
if (error.response?.status === 401) {
  return 'API Key가 아직 비활성 상태입니다. OpenWeatherMap은 발급 후 활성화까지 최대 몇 시간 걸릴 수 있습니다.'
}
```

## 구현 내용 - 외부 API 3개

### 1. OpenWeatherMap Current Weather Data (필수)

```js
// src/api/openWeatherMap.js
export async function fetchCurrentWeather(city) {
  const { data } = await client.get('/weather', { params: { q: city } })
  return { name: data.name, temp: Math.round(data.main.temp), ... }
}
```

### 2. OpenWeatherMap 5 Day / 3 Hour Forecast (OpenWeatherMap이 제공하는 추가 API)

같은 provider(OpenWeatherMap)의 다른 엔드포인트로 기능을 확장했습니다. 3시간 간격 40개 항목 중 `12:00:00`인 것만 골라서 "하루 대표 기온" 형태로 축약해 보여줍니다.

```js
const noonEntries = data.list.filter((entry) => entry.dt_txt.includes('12:00:00'))
```

### 3. ipwho.is - 기타 외부 API

키가 필요 없는 IP 기반 위치 조회 API입니다. "📍 내 위치로 조회" 버튼을 누르면 접속한 브라우저의 공인 IP로 도시를 추정해서 그 도시로 바로 검색합니다. 날씨 앱에 실제로 쓸모 있는 기능이라 임의의 API보다 이걸 골랐습니다.

```js
// src/api/ipGeolocation.js
export async function fetchMyCity() {
  const { data } = await axios.get('https://ipwho.is/')
  return { city: data.city, country: data.country }
}
```

두 OpenWeatherMap API는 `Promise.all`로 동시에 호출해서 대기 시간을 줄였습니다.

```js
const [currentResult, forecastResult] = await Promise.all([
  fetchCurrentWeather(query),
  fetchForecast(query),
])
```

## 검증

키가 아직 비활성 상태라 실제 날씨 데이터로는 확인 못 했지만, 다음은 확인했습니다.

- 검색 시 401 에러가 친절한 한글 안내 문구로 바뀌어 나오는지 (콘솔에는 401 에러가 그대로 찍히지만 화면은 정상적으로 안내)
- "내 위치로 조회" 버튼이 ipwho.is로 실제 위치(예: Seongnam-si)를 가져와서 입력창에 채우고 검색을 시도하는지

OpenWeatherMap 키가 활성화되면 `/handson/weather-axios`에서 실제 도시를 검색해 데이터가 정상적으로 나오는지 재확인이 필요합니다.
