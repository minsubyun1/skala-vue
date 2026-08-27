import axios from 'axios'

// API 3 (기타 외부 API) - 키 없이 바로 쓸 수 있는 IP 기반 위치 조회.
// 접속한 브라우저의 공인 IP로 대략적인 도시를 추정해서, "내 위치 자동 감지" 기능에 사용한다.
export async function fetchMyCity() {
  try {
    const { data } = await axios.get('https://ipwho.is/')
    if (!data.success) throw new Error('위치를 확인할 수 없습니다.')
    return { city: data.city, country: data.country }
  } catch {
    throw new Error('현재 위치를 확인하지 못했습니다.')
  }
}
