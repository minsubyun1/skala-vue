# skala-vue

Skala Vue 강의 종합과제 저장소입니다. Vue 3 + Composition API(`<script setup>`)로 작성한 실습 컴포넌트를 Vue Router로 페이지별로 분리하고, 사이드바 내비게이션 + 홈 대시보드 형태의 실습 뷰어 앱으로 구성했습니다.

- 배포 URL: _(Vercel/Netlify/GitHub Pages 배포 후 링크 추가 예정)_

## 실행 방법

```sh
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
npm run lint     # ESLint + Oxlint
npm run format   # Prettier
```

## 프로젝트 구조

```
src/
  components/practices/
    basic/        기본 문법 실습 (Reactivity, Text Interpolation)
    directive/    Vue Directive 실습 (v-html, v-bind, v-if, v-for, v-memo 등 14개)
  router/
    practiceRoutes.js   실습 라우트 + 사이드바 메뉴의 단일 소스(Single Source of Truth)
    index.js            practiceRoutes를 기반으로 라우터 생성
  views/
    HomeView.vue         실습 목록 카드형 대시보드
  App.vue                 상단 헤더 + 좌측 사이드바 + RouterView 레이아웃
```

## 단원별 실습 & Customization 기록

### 1. 개발 환경 구성 (Dev Setup)

- `create-vue@3.22.3` 기준으로 Router / Pinia / ESLint / Prettier 옵션을 켜서 프로젝트를 생성했습니다.
- 실습 컴포넌트를 `App.vue`에 바로 몰아넣지 않고, 처음부터 `components/practices/기능분류/` 하위에 정리해서 이후 실습이 늘어나도 구조가 깨지지 않도록 했습니다.

### 2. Vue Syntax 기초 (반응형 데이터, Text Interpolation)

- 일반 변수(`let`)와 `ref()`의 화면 갱신 차이를 비교하는 예제를 구현했습니다.
- `v-text` 예제에서 `{{}}` 문자 자체를 화면에 출력해야 하는데, Vue 템플릿 파서가 문자열 안의 `{{`를 실제 mustache 문법으로 오인해 파싱 에러가 나는 이슈가 있어 HTML 엔티티(`&#123;&#123;&#125;&#125;`)로 우회 처리했습니다.

### 3. Vue Directive 실습

- 슬라이드에 나온 `v-html` / `v-html XSS` / `v-text` / `v-bind`(기본·Class·Style·단축 문법) / `v-if`·`v-else-if`·`v-else` / `v-show` / `v-for` / `v-pre` / `v-cloak` / `v-once` / `v-memo` 14개 예제를 각각 독립된 컴포넌트로 구현했습니다.
- `v-html XSS` 예제는 실습 목적의 취약점 데모이며, 실제 서비스 코드가 아님을 인지하고 별도 페이지로 격리했습니다.

### 4. Vue Router 적용 & UI 커스터마이징 (자체 확장)

과제 요구사항인 "실습 종류별로 라우터로 연결해서 예쁘게" 정리하기 위해 아래 구조를 직접 설계했습니다.

- **단일 소스 라우팅**: `router/practiceRoutes.js`에 `{ groupId, label, items: [{ path, name, label, component }] }` 형태로 실습 메타데이터를 한 번만 정의하고, 이 배열을 `router/index.js`(라우트 등록)와 `App.vue`/`HomeView.vue`(사이드바·카드 메뉴 렌더링) 양쪽에서 재사용하도록 구성했습니다. 실습을 추가할 때 이 파일 한 곳만 수정하면 라우트와 메뉴가 동시에 반영됩니다.
- **레이아웃**: `App.vue`를 상단 헤더 + 좌측 카테고리별 사이드바 + `<RouterView />` 구조로 재작성하고, 현재 페이지에 해당하는 메뉴는 Vue 브랜드 컬러(`#42b883`)로 강조되도록 `active-class`를 적용했습니다.
- **홈 대시보드**: `HomeView.vue`에서 전체 실습 개수를 자동 집계하고, 카테고리별 카드 그리드로 모든 실습에 바로 진입할 수 있도록 구현했습니다.
- **성능**: 모든 실습 컴포넌트를 라우트 레벨 코드 스플리팅(`() => import(...)`)으로 지연 로딩하여, 빌드 시 실습별로 별도 청크가 생성되도록 했습니다.
- **디자인 시스템**: 모든 실습 컴포넌트가 공통으로 쓰는 `.practice-section` 클래스를 전역 스타일로 통일해 카드형 UI로 일관되게 보이도록 했고, 기존 `create-vue` 기본 템플릿의 2단 그리드 CSS(랜딩 페이지용)는 새 레이아웃과 충돌해서 제거했습니다.
- 기본 스캐폴드에 포함되어 있던 `HelloWorld` / `TheWelcome` / `AboutView` 등 실습과 무관한 샘플 컴포넌트는 정리했습니다.

## 제출 체크리스트

- [ ] GitHub Public 저장소 push (`git push -u origin main`)
- [ ] 시크릿 창에서 저장소 접속 시 로그인 없이 소스 확인
- [ ] Vercel / Netlify / GitHub Pages 등 정적 배포 후 위 배포 URL 항목 업데이트
