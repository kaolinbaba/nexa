import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'qa-reports', 'test-results', 'playwright-report', 'node_modules']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: { ecmaVersion: 2023, globals: globals.browser },
  },
  {
    files: ['qa/**/*.{ts,mjs}', '*.config.{ts,js}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    // QA scripts pass callbacks to page.evaluate(), which run in the browser.
    languageOptions: { ecmaVersion: 2023, globals: { ...globals.node, ...globals.browser } },
  },
])
