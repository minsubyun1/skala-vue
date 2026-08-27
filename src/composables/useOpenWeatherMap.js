import { ref } from 'vue'
import { fetchCurrentWeather, fetchForecast } from '@/api/openWeatherMap'

export function useOpenWeatherMap() {
  const isLoading = ref(false)
  const error = ref('')
  const current = ref(null)
  const forecast = ref([])

  async function search(city) {
    const query = city.trim()
    error.value = ''
    current.value = null
    forecast.value = []
    if (!query) return

    isLoading.value = true
    try {
      // 두 API를 동시에 호출해서 대기 시간을 줄인다.
      const [currentResult, forecastResult] = await Promise.all([
        fetchCurrentWeather(query),
        fetchForecast(query),
      ])
      current.value = currentResult
      forecast.value = forecastResult
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, current, forecast, search }
}
