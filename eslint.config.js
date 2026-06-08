import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // React Compiler rules — disabled for React Three Fiber compatibility.
      // R3F intentionally operates outside React's rendering model: useFrame runs
      // outside the React scheduler, refs are mutated in animation loops, and
      // Math.random() inside useMemo-equivalent patterns is deliberate design.
      // These are not bugs; they are R3F idioms that the compiler rules cannot model.
      'react-hooks/purity':            'off',
      'react-hooks/refs':              'off',
      'react-hooks/immutability':      'off',
      'react-hooks/set-state-in-effect': 'off',

      // react-refresh HMR rule — turned off globally.
      // main.tsx is an entry point (lazy imports look like components to the rule),
      // and context files intentionally co-export providers + hooks.
      'react-refresh/only-export-components': 'off',

      // Allow unused vars when prefixed with _ (convention for intentionally ignored args)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
])
