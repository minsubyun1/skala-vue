// 지도 마커(WeatherMapPanel)와 관심 지역 카드(WeatherAxiosView)가 같은 상태별 색상/이모지를 쓰도록 공유한다.
const STATUS_STYLE = {
  맑음: { emoji: '☀️', color: '#f59e0b' },
  구름: { emoji: '☁️', color: '#64748b' },
  비: { emoji: '🌧️', color: '#3b82f6' },
  눈: { emoji: '❄️', color: '#0ea5e9' },
  안개: { emoji: '🌫️', color: '#94a3b8' },
}

export function getStatusStyle(status) {
  return STATUS_STYLE[status] ?? { emoji: '🌡️', color: '#42b883' }
}
