# Code Challenge - Axios

[← README로 돌아가기](../README.md)

경로: `/axios/weather`, `/axios/json` · 컴포넌트: `AxiosWeatherExample.vue`, `AxiosJsonExample.vue`

슬라이드 요구 항목: Axios 설치 / Axios Weather Example / Axios JSON Example

Axios는 이미 핸즈온 1(Weather Mockup)의 실시간 날씨 기능에서 설치·사용 중이라, 이 챌린지는 별도 설치 없이 바로 진행했습니다.

## Axios Weather Example

API Key가 필요 없는 Open-Meteo로 `axios.get(url, { params })` 기본 사용법을 확인합니다.

```js
const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
  params: { latitude: 37.5665, longitude: 126.978, current: 'temperature_2m' },
})
```

## Axios JSON Example

JSONPlaceholder(테스트용 더미 JSON을 제공하는 공개 API)에서 게시글 5개를 받아와 뿌려주는 예제입니다.
