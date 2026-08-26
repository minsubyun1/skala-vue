import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    name: 'app/custom-rules',
    rules: {
      // 느슨한 비교(==)를 쓰면 타입 강제 변환 때문에 예상 밖의 버그가 생기기 쉬워 강제로 막는다.
      eqeqeq: ['error', 'always'],
      // 개발 중 디버깅용 console.log는 편하게 쓸 수 있도록 허용한다.
      'no-console': 'off',
    },
  },

  skipFormatting,
])
