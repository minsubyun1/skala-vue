import axios from 'axios'

// Nominatim(OpenStreetMap) 역지오코딩: 좌표 → 지명. Key 불필요.
// 사용 정책상 초당 1회 제한이 있어서, 지도 클릭처럼 사람이 직접 누르는 경우에만 쓴다.
export async function reverseGeocode(lat, lon) {
  const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: { lat, lon, format: 'json', 'accept-language': 'ko' },
  })
  const address = data.address ?? {}
  return address.city ?? address.town ?? address.county ?? address.village ?? data.display_name
}
