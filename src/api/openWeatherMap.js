import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY

const client = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'kr',
  },
})

// 지도 마커가 쓰는 5개 상태(맑음/구름/비/눈/안개)와 맞추기 위한 아이콘 코드 매핑.
// https://openweathermap.org/weather-conditions
const ICON_STATUS_MAP = {
  '01': '맑음',
  '02': '구름',
  '03': '구름',
  '04': '구름',
  '09': '비',
  10: '비',
  11: '비',
  13: '눈',
  50: '안개',
}

function iconToStatus(icon) {
  return ICON_STATUS_MAP[icon.slice(0, 2)] ?? '구름'
}

function toFriendlyError(error) {
  if (error.response?.status === 401) {
    return 'API Key가 아직 비활성 상태입니다. OpenWeatherMap은 발급 후 활성화까지 최대 몇 시간 걸릴 수 있습니다.'
  }
  if (error.response?.status === 404) {
    return '해당 이름의 도시를 찾을 수 없습니다.'
  }
  return '날씨 정보를 가져오지 못했습니다.'
}

// OpenWeatherMap Current Weather Data
export async function fetchCurrentWeather(city) {
  try {
    const { data } = await client.get('/weather', { params: { q: city } })
    return {
      name: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      status: iconToStatus(data.weather[0].icon),
    }
  } catch (error) {
    throw new Error(toFriendlyError(error), { cause: error })
  }
}

// OpenWeatherMap 5 Day / 3 Hour Forecast
export async function fetchForecast(city) {
  try {
    const { data } = await client.get('/forecast', { params: { q: city } })
    // 3시간 간격 40개 중, 정오(12:00:00) 항목만 골라서 "일자별 예보" 형태로 축약한다.
    const noonEntries = data.list.filter((entry) => entry.dt_txt.includes('12:00:00'))
    return noonEntries.map((entry) => ({
      date: entry.dt_txt.slice(0, 10),
      temp: Math.round(entry.main.temp),
      description: entry.weather[0].description,
      icon: entry.weather[0].icon,
    }))
  } catch (error) {
    throw new Error(toFriendlyError(error), { cause: error })
  }
}
