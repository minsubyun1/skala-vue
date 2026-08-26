// WeatherHomeView / WeatherDetailView / WeatherStatsView가 공통으로 참조하는 목데이터.
// 서로 다른 라우트(= 서로 다른 컴포넌트 인스턴스)에서도 같은 도시 정보를 찾을 수 있도록
// 컴포넌트 바깥의 별도 모듈로 분리했다.
export const weatherMockData = [
  { id: 'city_incheon', name: '인천', temp: 27, status: '맑음', humidity: 55, wind: 3.1 },
  { id: 'city_daejeon', name: '대전', temp: 31, status: '맑음', humidity: 40, wind: 1.8 },
  { id: 'city_gwangju', name: '광주', temp: 23, status: '비', humidity: 82, wind: 4.4 },
  { id: 'city_ulsan', name: '울산', temp: 26, status: '구름', humidity: 61, wind: 2.6 },
  { id: 'city_jeju', name: '제주', temp: 19, status: '안개', humidity: 88, wind: 5.2 },
  { id: 'city_gangneung', name: '강릉', temp: 4, status: '눈', humidity: 70, wind: 3.9 },
  { id: 'city_jeonju', name: '전주', temp: 22, status: '구름', humidity: 58, wind: 2.1 },
  { id: 'city_pohang', name: '포항', temp: 29, status: '비', humidity: 76, wind: 6.0 },
]
