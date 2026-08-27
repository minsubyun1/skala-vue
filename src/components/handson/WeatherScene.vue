<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const props = defineProps({
  status: { type: String, default: '맑음' },
})

const canvasRef = ref(null)

const STATUS_PRESET = {
  맑음: { mode: 'dust', color: 0xffe1a3, count: 50 },
  구름: { mode: 'none', color: 0xcfd8e3, count: 0 },
  비: { mode: 'rain', color: 0x9ecbff, count: 420 },
  눈: { mode: 'snow', color: 0xffffff, count: 260 },
  안개: { mode: 'fog', color: 0xb9c2cf, count: 50 },
}

let renderer, composer, bloomPass, scene, camera
let precipitation, sun, moon, starField
let animationId
const timer = new THREE.Timer()
const pointer = { x: 0, y: 0 }

function isNightNow() {
  const hour = new Date().getHours()
  return hour < 5 || hour >= 19
}

// 외부 이미지 자산 없이 캔버스 그라디언트로 부드러운 원형 텍스처 생성
function createSoftDiscTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.55)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

const softDiscTexture = createSoftDiscTexture()

function buildRain(count) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 2 * 3)
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 9
    const y = (Math.random() - 0.5) * 6
    const z = (Math.random() - 0.5) * 5
    const length = 0.12 + Math.random() * 0.12
    positions.set([x, y, z, x - 0.03, y - length, z], i * 6)
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.LineBasicMaterial({
    color: STATUS_PRESET['비'].color,
    transparent: true,
    opacity: 0.6,
  })
  const lines = new THREE.LineSegments(geometry, material)
  lines.userData.speed = 0.16
  return lines
}

function buildPoints(preset) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(preset.count * 3)
  for (let i = 0; i < preset.count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 7
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const sizeByMode = { snow: 0.16, fog: 0.9, dust: 0.05, none: 0.05 }
  const speedByMode = { snow: 0.012, fog: 0.0009, dust: -0.0015, none: 0 }
  const opacityByMode = { snow: 0.9, fog: 0.35, dust: 0.5, none: 0 }
  const material = new THREE.PointsMaterial({
    color: preset.color,
    size: sizeByMode[preset.mode] ?? 0.08,
    map: softDiscTexture,
    transparent: true,
    opacity: opacityByMode[preset.mode] ?? 0.7,
    depthWrite: false,
    blending: preset.mode === 'dust' ? THREE.AdditiveBlending : THREE.NormalBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.userData.speed = speedByMode[preset.mode] ?? 0.004
  points.userData.sway = preset.mode === 'snow' ? 0.55 : 0.15
  return points
}

function buildStarField() {
  const count = 220
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = Math.random() * 5 + 0.5
    positions[i * 3 + 2] = -4 - Math.random() * 4
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.045,
    map: softDiscTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Points(geometry, material)
}

function buildGlowingOrb(colorRgb) {
  const orb = new THREE.Group()

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 32),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(...colorRgb) }),
  )
  orb.add(core)

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: softDiscTexture,
      color: new THREE.Color(colorRgb[0] * 0.6, colorRgb[1] * 0.6, colorRgb[2] * 0.6),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  glow.scale.set(1.1, 1.1, 1)
  orb.add(glow)

  return { orb, core, glow }
}

function setPrecipitation(mode, preset) {
  if (precipitation) {
    scene.remove(precipitation)
    precipitation.geometry.dispose()
    precipitation.material.dispose()
    precipitation = null
  }
  if (mode === 'rain') {
    precipitation = buildRain(preset.count)
  } else if (mode !== 'none') {
    precipitation = buildPoints(preset)
  }
  if (precipitation) scene.add(precipitation)
}

function applyStatus(status) {
  const preset = STATUS_PRESET[status] ?? STATUS_PRESET['맑음']
  setPrecipitation(preset.mode, preset)

  const night = isNightNow()
  const showSun = status === '맑음' && !night
  const showMoon = status === '맑음' && night
  sun.orb.visible = showSun
  moon.orb.visible = showMoon
}

function resize() {
  const el = canvasRef.value
  if (!el || !renderer) return
  const width = el.clientWidth || 1
  const height = el.clientHeight || 1
  renderer.setSize(width, height, false)
  composer.setSize(width, height)
  bloomPass.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

function onWindowPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1
}

function animate() {
  animationId = requestAnimationFrame(animate)
  timer.update()
  const elapsed = timer.getElapsed()

  if (precipitation) {
    const positions = precipitation.geometry.attributes.position
    const speed = precipitation.userData.speed ?? 0.005
    const sway = precipitation.userData.sway ?? 0

    if (precipitation.type === 'LineSegments') {
      for (let i = 0; i < positions.count; i += 2) {
        const y = positions.getY(i) - speed
        const y2 = positions.getY(i + 1) - speed
        if (y < -3) {
          const dy = positions.getY(i) - positions.getY(i + 1)
          positions.setY(i, 3)
          positions.setY(i + 1, 3 - dy)
        } else {
          positions.setY(i, y)
          positions.setY(i + 1, y2)
        }
      }
    } else {
      for (let i = 0; i < positions.count; i++) {
        let y = positions.getY(i) - speed
        const x = positions.getX(i) + Math.sin(elapsed * 0.6 + i) * sway * 0.004
        if (speed >= 0 && y < -2.6) y = 2.6
        if (speed < 0 && y > 2.6) y = -2.6
        positions.setY(i, y)
        positions.setX(i, x)
      }
    }
    positions.needsUpdate = true
  }

  if (sun.orb.visible) {
    sun.orb.rotation.y += 0.0015
    sun.glow.material.opacity = 0.5 + Math.sin(elapsed * 0.8) * 0.07
  }
  if (moon.orb.visible) {
    moon.glow.material.opacity = 0.4 + Math.sin(elapsed * 0.6) * 0.05
  }

  if (starField) {
    const target = isNightNow() ? 0.8 : 0
    starField.material.opacity += (target - starField.material.opacity) * 0.02
  }

  // 마우스 위치 기반 패럴랙스 + 자동 궤도 회전
  const autoOrbitX = Math.sin(elapsed * 0.05) * 0.3
  camera.position.x += (pointer.x * 0.7 + autoOrbitX - camera.position.x) * 0.03
  camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.03
  camera.lookAt(0, 0, 0)

  composer.render()
}

onMounted(() => {
  const el = canvasRef.value
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0b1220, 0.05)

  camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 20)
  camera.position.z = 4.4

  renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(el.clientWidth, el.clientHeight),
    0.35,
    0.3,
    0.55,
  )
  composer.addPass(bloomPass)
  composer.addPass(new OutputPass())

  starField = buildStarField()
  scene.add(starField)

  sun = buildGlowingOrb([1.8, 1.5, 0.8])
  sun.orb.position.set(1.8, 1.4, -3.2)
  scene.add(sun.orb)

  moon = buildGlowingOrb([1.1, 1.2, 1.4])
  moon.orb.position.set(-1.8, 1.4, -3.2)
  scene.add(moon.orb)

  resize()
  applyStatus(props.status)
  animate()

  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onWindowPointerMove)
})

watch(
  () => props.status,
  (status) => applyStatus(status),
)

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onWindowPointerMove)

  precipitation?.geometry.dispose()
  precipitation?.material.dispose()
  starField?.geometry.dispose()
  starField?.material.dispose()
  softDiscTexture.dispose()
  ;[sun, moon].forEach(({ core, glow }) => {
    core.geometry.dispose()
    core.material.dispose()
    glow.material.dispose()
  })

  composer?.dispose()
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="weather-scene"></canvas>
</template>

<style scoped>
.weather-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
</style>
