# skala-vue

Skala Vue 수업 과제 정리용 repository입니다. Vue 3 + Composition API(`<script setup>`)로 작성한 실습 컴포넌트들을 모아두었고, 페이지 수가 늘어나면서 Vue Router를 붙여 사이드바로 이동할 수 있도록 구성했습니다.

- 배포 URL: _(배포 후 추가 예정)_

## 실행 방법

```sh
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # eslint + oxlint
npm run format   # prettier
```

## 폴더 구조

```
docs/                          핸즈온 과제별 상세 기록
src/
  components/
    code-challenge/   Code Challenge 실습 16개 (반응성, Text Interpolation, v-if, v-for, v-bind, v-memo 등)
    handson/          채점 대상 핸즈온 과제
  api/openMeteo.js          실시간 날씨 API 호출
  composables/useLiveWeather.js
  router/practiceRoutes.js  라우트 + 사이드바 메뉴 정의
  App.vue                    헤더 + 사이드바 + RouterView 레이아웃
```

## 진행 개요

**1일차 - 개발환경 세팅, 기초 문법 / Directive 실습**

`create-vue`로 Router/Pinia 옵션을 켜서 프로젝트를 생성하고, 컴포넌트를 `components/code-challenge/` 하위에 정리했습니다. 슬라이드에 나온 반응형 데이터·Text Interpolation과 v-html / v-html XSS / v-text / v-bind(기본·Class·Style·단축) / v-if·v-else-if·v-else / v-show / v-for / v-pre / v-cloak / v-once / v-memo를 각각 별도 컴포넌트로 구현했습니다(총 16개). v-html XSS 데모는 실제로 스크립트가 실행되는 예제라 별도 페이지로 분리했습니다.

**2일차 - Event Handling, Form Handling, Composition API (~watchEffect)**

Vue Event Handling(v-on, Event Object, Event Modifier), Vue Form Handling(v-model 3종, Vue Style), Composition API(ref/reactive, computed, watch 4종, watchEffect) Code Challenge를 구현했습니다.

**3일차 - Vue Components, Router**

Vue Components(Lifecycle Hook, Props & Emits, Slot 3종) Code Challenge를 구현했습니다. 실습 페이지 수가 늘어나면서 이 단계에서 Vue Router와 사이드바 메뉴도 함께 도입했습니다. `practiceRoutes.js` 한 파일에 라우트 목록과 사이드바 메뉴 정보를 같이 정의해서, 페이지 추가 시 한 곳만 수정하면 되도록 만들었습니다.

## Code Challenge

슬라이드 전체를 한 번 더 훑어서, 지금까지 빠져 있던 항목들을 마저 구현했습니다. 항목별 상세 설명과 코드는 각 문서에 정리했습니다.

- [Vue Event Handling](docs/code-challenge-01-event-handling.md) — v-on, Event Object, Event Modifier
- [Vue Form Handling](docs/code-challenge-02-form-handling.md) — v-model 3종 + Vue Style(`v-bind()` in `<style>`)
- [Composition API - Reactive State](docs/code-challenge-03-composition-reactive.md) — ref() / reactive()
- [Composition API - Computed & Watchers](docs/code-challenge-04-composition-watchers.md) — computed / watch(다중소스·deep) / reactive 감시 / watchEffect
- [Vue Components](docs/code-challenge-05-components.md) — Lifecycle Hook / Props & Emits / Slot(Default·Named·Scoped)
- [Pinia](docs/code-challenge-06-pinia.md) — Store(counter.js) 작성·사용
- [Axios](docs/code-challenge-07-axios.md) — Weather Example / JSON Example
- [UI Libraries (Element Plus)](docs/code-challenge-08-ui-library.md) — Form Validation / Product Card / Progress & Confirm
- [Vite Build & Deployment](docs/code-challenge-09-build-deploy.md) — ESLint 커스텀 규칙 / Prettier / env / build

## 핸즈온 과제

과제별 요구사항, 구현 방식, 코드 스니펫, 트러블슈팅은 각 문서에 따로 정리했습니다.

- [핸즈온 1 - Weather Mockup](docs/handson-01-weather-mockup.md) — v-for/v-if/양방향 바인딩/이벤트 수식어 실습 + three.js 인터랙티브 배경, Open-Meteo 실시간 날씨, 상세보기 모달
- [핸즈온 2 - Weather Composition](docs/handson-02-weather-composition.md) — computed/watch/watchEffect 실습 + 즐겨찾기 기능
- [핸즈온 3 - Weather Component](docs/handson-03-weather-component.md) — Weather Mockup을 4개 컴포넌트(+추가 3개)로 분리, props/emits/slot 실습
- [핸즈온 4 - Weather Router](docs/handson-04-weather-router.md) — 동적 라우트(`:cityId`), Programmatic Navigation, Catch-all Route, Lazy Loading
- [핸즈온 5 - Weather Store](docs/handson-05-weather-store.md) — Pinia `configStore`로 온도/풍속 단위 전역 상태 관리
- [핸즈온 6 - Weather Axios](docs/handson-06-weather-axios.md) — OpenWeatherMap 2개 API + 키 없는 IP 위치 API, 총 3개 외부 API 연동
- [핸즈온 7 - Weather UI Library](docs/handson-07-weather-ui-library.md) — Element Plus 도입, Weather Router/Store 화면 전체에 적용

나머지 핸즈온(Deployment)은 순서대로 진행 예정입니다.

## 체크리스트

- [ ] GitHub push
- [ ] 시크릿 창에서 로그인 없이 접속되는지 확인
- [ ] 배포 후 위 링크 업데이트
