# Code Challenge - UI Libraries (Element Plus)

[← README로 돌아가기](../README.md)

경로: `/ui-library/form`, `/ui-library/product`, `/ui-library/progress` · 컴포넌트: `ElementFormExample.vue`, `ElementProductExample.vue`, `ElementProgressExample.vue`

슬라이드에 제시된 코드(`userForm`, `ElMessage`, `el-card`/`el-input-number`, `ElMessageBox.confirm` 등)가 전부 Element Plus API라서, 이 챌린지를 위해 `element-plus` 패키지를 새로 설치했습니다. CSS는 `main.js`에서 한 번만 전역으로 불러오고, 컴포넌트 자체는 각 페이지에서 필요한 것만 개별 import 해서 라우트별로 코드 스플리팅되게 했습니다.

## Form Validation Example

이메일 형식과 약관 동의 여부를 검사해서 `ElMessage.error`/`ElMessage.warning`/`ElMessage.success`로 각각 다른 안내를 띄웁니다.

## Product Card Example

`el-card` 안에 `el-input-number`(구매 수량)와 `el-rate`(별점)를 배치한 상품 카드입니다.

## Progress & Confirm Example

`el-progress`로 다운로드 진행률을 `setInterval`로 애니메이션하고, `ElMessageBox.confirm`으로 삭제 확인 다이얼로그를 띄워 확인/취소에 따라 다른 메시지를 보여줍니다. `setInterval`은 컴포넌트가 언마운트될 때 `onBeforeUnmount`에서 정리해서, 페이지를 벗어나도 타이머가 계속 도는 일이 없게 했습니다.
