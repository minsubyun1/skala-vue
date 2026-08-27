<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getStatusStyle } from '@/utils/weatherStatusStyle'

const props = defineProps({
  regions: { type: Array, required: true },
})
const emit = defineEmits(['map-click'])

const mapContainer = ref(null)
let map = null
let markersLayer = null

// Leaflet 기본 핀 아이콘은 레티나 디스플레이에서 iconRetinaUrl을 별도로 요구하는데,
// 그 경로를 안 맞춰주면 화면 깨짐(broken image)이 생겨서 상태별 색상 + 이모지로 된
// 커스텀 아이콘으로 대체했다.
function createRegionIcon(status) {
  const style = getStatusStyle(status)
  return L.divIcon({
    className: 'region-marker-icon',
    html: `<span class="region-marker" style="background:${style.color}">${style.emoji}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  })
}

function renderMarkers(regions) {
  markersLayer.clearLayers()
  regions.forEach((region) => {
    L.marker([region.lat, region.lon], { icon: createRegionIcon(region.status) })
      .addTo(markersLayer)
      .bindPopup(
        `<div class="region-popup"><b>${region.name}</b><br/>${region.temp}°C · ${region.status}<br/>습도 ${region.humidity}% · 풍속 ${region.wind}m/s</div>`,
      )
  })
}

let regionCount = props.regions.length
let resizeObserver = null

onMounted(() => {
  map = L.map(mapContainer.value).setView([36.5, 127.8], 7)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
  markersLayer = L.layerGroup().addTo(map)
  map.on('click', (event) => {
    // 클릭한 지점으로 부드럽게 이동해서, 응답을 기다리는 동안에도 반응하는 느낌을 준다.
    map.flyTo(event.latlng, Math.max(map.getZoom(), 9), { duration: 0.6 })
    emit('map-click', { lat: event.latlng.lat, lon: event.latlng.lng })
  })
  renderMarkers(props.regions)

  // Leaflet은 처음 만들 때의 컨테이너 크기를 기억해두는데, 모바일 브라우저에서 주소창이
  // 접혔다 펴지며 뷰포트가 바뀌거나 flex 레이아웃이 재계산되면 지도가 그 크기를 그대로
  // 들고 있어서 어긋나 보인다. 컨테이너 크기가 바뀔 때마다 다시 계산하도록 한다.
  resizeObserver = new ResizeObserver(() => map?.invalidateSize())
  resizeObserver.observe(mapContainer.value)
})

watch(
  () => props.regions,
  (regions) => {
    renderMarkers(regions)
    // 검색으로 추가된 지역은 지도 클릭이 없어서, 새 지역이 생기면 그쪽으로도 이동시켜준다.
    if (regions.length > regionCount) {
      const added = regions[regions.length - 1]
      map.flyTo([added.lat, added.lon], Math.max(map.getZoom(), 9), { duration: 0.6 })
    }
    regionCount = regions.length
  },
  { deep: true },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  map?.remove()
})
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
}
</style>

<style>
/* leaflet이 마커/팝업 DOM을 지도 컨테이너에 직접 붙이기 때문에 scoped가 안 먹어서 전역으로 둔다. */
.region-marker-icon {
  background: none;
  border: none;
}

.region-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 16px;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  animation: region-marker-pop 0.35s ease;
  transition: transform 0.15s ease;
}

.region-marker:hover {
  transform: scale(1.15);
}

@keyframes region-marker-pop {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.region-popup {
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
