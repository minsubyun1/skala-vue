import axios from 'axios'

// Open-Meteo: API Key 없이 바로 호출 가능한 무료 API
// 지오코딩 API + 현재 날씨 API 조합해서 사용
const geocodeClient = axios.create({ baseURL: 'https://geocoding-api.open-meteo.com/v1' })
const forecastClient = axios.create({ baseURL: 'https://api.open-meteo.com/v1' })

// WMO 날씨 코드를 프로젝트 상태값 5종(맑음/구름/비/눈/안개)으로 매핑
const WMO_STATUS_MAP = {
  0: '맑음',
  1: '맑음',
  2: '구름',
  3: '구름',
  45: '안개',
  48: '안개',
  51: '비',
  53: '비',
  55: '비',
  56: '비',
  57: '비',
  61: '비',
  63: '비',
  65: '비',
  66: '비',
  67: '비',
  71: '눈',
  73: '눈',
  75: '눈',
  77: '눈',
  80: '비',
  81: '비',
  82: '비',
  85: '눈',
  86: '눈',
  95: '비',
  96: '비',
  99: '비',
}

export function weatherCodeToStatus(code) {
  return WMO_STATUS_MAP[code] ?? '구름'
}

// 지오코딩 API에 "서울"을 그대로 넣으면 검색 결과 0건 (직접 호출로 확인)
// "Seoul"로 요청하면 정상 매칭되어, 자주 쓰는 도시는 영문명으로 치환 후 요청
const KOREAN_CITY_ALIASES = {
  서울: 'Seoul',
  부산: 'Busan',
  대구: 'Daegu',
  대전: 'Daejeon',
  인천: 'Incheon',
  광주: 'Gwangju',
  울산: 'Ulsan',
  수원: 'Suwon',
  제주: 'Jeju',
  강릉: 'Gangneung',
  전주: 'Jeonju',
  포항: 'Pohang',
  청주: 'Cheongju',
  춘천: 'Chuncheon',
  여수: 'Yeosu',
  도쿄: 'Tokyo',
  오사카: 'Osaka',
  교토: 'Kyoto',
  삿포로: 'Sapporo',
  후쿠오카: 'Fukuoka',
  베이징: 'Beijing',
  상하이: 'Shanghai',
  홍콩: 'Hong Kong',
  타이베이: 'Taipei',
  뉴욕: 'New York',
  로스앤젤레스: 'Los Angeles',
  런던: 'London',
  파리: 'Paris',
  로마: 'Rome',
  베를린: 'Berlin',
  방콕: 'Bangkok',
  싱가포르: 'Singapore',
  시드니: 'Sydney',
  두바이: 'Dubai',
  모스크바: 'Moscow',
}

// 동명의 소도시가 함께 검색될 수 있어 인구수 최댓값 기준으로 선택
export async function geocodeCity(name) {
  const trimmed = name.trim()
  if (!trimmed) return null
  const query = KOREAN_CITY_ALIASES[trimmed] ?? trimmed

  const tryFetch = async (params) => {
    const { data } = await geocodeClient.get('/search', {
      params: { name: query, count: 5, format: 'json', ...params },
    })
    return data.results ?? []
  }

  let results = await tryFetch({ language: 'ko' })
  if (results.length === 0) results = await tryFetch({})
  if (results.length === 0) return null

  return [...results].sort((a, b) => (b.population ?? 0) - (a.population ?? 0))[0]
}

export async function fetchCurrentWeather(latitude, longitude) {
  const { data } = await forecastClient.get('/forecast', {
    params: {
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
      timezone: 'auto',
    },
  })
  return {
    temp: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    wind: data.current.wind_speed_10m,
    status: weatherCodeToStatus(data.current.weather_code),
  }
}
