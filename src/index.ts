import js from '@eslint/js'
import { type Linter } from 'eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

const baseconfig: {
  js: Linter.Config
  ts: Linter.Config
} = {
  js: {
    name: 'eslint-config-base-js',
    rules: {
      'guard-for-in': 'error',
      'no-implied-eval': 'off',
      'no-throw-literal': 'off',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-console': ['warn', { allow: ['assert', 'warn', 'error'] }],
    },
  },
  ts: {
    name: 'eslint-config-base-ts',
    rules: {
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',

      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
          allowAny: false,
          allowNullish: true,
          allowRegExp: true,
        },
      ],

      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      '@typescript-eslint/no-namespace': 'off',
    },
  },
}

const jsconfig: Linter.Config[] = defineConfig(
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  baseconfig.js,
)

const tsconfig: Linter.Config[] = defineConfig(
  {
    ignores: ['dist/**'],
  },
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['test.ts', 'eslint.config.mjs'],
        },
        sourceType: 'module',
      },
    },
  },
  baseconfig.js,
  baseconfig.ts,
)

export { baseconfig, jsconfig, tsconfig, tseslint }
