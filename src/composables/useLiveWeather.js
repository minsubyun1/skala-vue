import { ref } from 'vue'
import { fetchCurrentWeather, geocodeCity } from '@/api/openMeteo'

// 실시간 날씨 조회 로직을 컴포넌트에서 분리한 composable
// 지오코딩 → 좌표 기반 날씨 조회 순서로 처리
export function useLiveWeather() {
  const isLoading = ref(false)
  const error = ref('')
  const result = ref(null)

  async function search(cityName) {
    const query = cityName.trim()
    error.value = ''
    result.value = null
    if (!query) return

    isLoading.value = true
    try {
      const place = await geocodeCity(query)
      if (!place) {
        error.value = `"${query}"에 해당하는 도시를 찾지 못했습니다. 영문 지명으로도 시도해 보세요.`
        return
      }

      const weather = await fetchCurrentWeather(place.latitude, place.longitude)
      result.value = {
        id: `live_${place.id}`,
        name: place.name,
        country: place.country,
        ...weather,
      }
    } catch {
      error.value = '날씨 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, result, search }
}
