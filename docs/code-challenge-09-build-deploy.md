# Code Challenge - Vite Build & Deployment

[← README로 돌아가기](../README.md)

슬라이드 요구 항목: ESLint Custom 규칙 / Prettier / env / build

이 네 가지는 페이지로 만들 수 있는 게 아니라 "직접 명령어를 실행하고 결과를 관찰하는" 미션이라, 컴포넌트 대신 실제로 수행하고 검증한 절차를 기록합니다.

## ESLint Custom 규칙

`eslint.config.js`에 커스텀 규칙을 추가했습니다.

```js
{
  name: 'app/custom-rules',
  rules: {
    eqeqeq: ['error', 'always'],
    'no-console': 'off',
  },
},
```

검증: 임의의 컴포넌트에 `if (userAge == 20)`처럼 느슨한 비교 구문을 임시로 넣고 `npx eslint`를 돌려서, 아래처럼 정확히 규칙 위반이 잡히는 걸 확인한 뒤 다시 제거했습니다.

```
error  Expected '===' and instead saw '=='  eqeqeq
```

## Prettier

임의의 `<script setup>`에 정렬이 엉망인 코드(`const     myRegion   = \`Suwon\`;`)를 넣고 `npm run format`을 실행하면, 불필요한 공백이 정리되고 세미콜론·따옴표 스타일이 프로젝트 설정(`.prettierrc.json`)대로 통일되는 걸 확인했습니다.

## env (.env.staging / .env.production)

루트에 두 환경 파일을 만들고, `package.json`에 `build:staging` 스크립트를 추가했습니다.

```
# .env.staging
VITE_API_URL=https://api-stage.skcc.com

# .env.production
VITE_API_URL=https://api-prod.skcc.com
```

```json
"build:staging": "vite build --mode staging"
```

`/build-deploy/env` 페이지(`EnvExample.vue`)에서 `import.meta.env.VITE_API_URL`과 `import.meta.env.MODE`를 출력합니다. `npm run build`와 `npm run build:staging`을 각각 실행해서 `dist/assets/`에 생성된 청크 안에 각 환경의 URL이 올바르게 주입되는 것까지 확인했습니다.

## build

`npm run build` 실행 후 `dist/` 폴더와 `dist/assets/` 안에 라우트별로 쪼개진 JS 청크(예: `WeatherMockup-[hash].js`)가 생성되는 것을 확인했습니다. 청크 해시가 파일 내용이 바뀔 때만 바뀐다는 것도 재빌드해서 비교해봤습니다.
