import js from '@eslint/js';
import { type Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint, { type ConfigArray } from 'typescript-eslint';

const baseconfig: {
  js: Linter.Config;
  ts: Linter.Config;
} = {
  js: {
    name: 'eslint-config-base-js',
    rules: {
      'guard-for-in': 'error',
      'no-async-promise-executor': 'error',
      'no-implied-eval': 'off',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  ts: {
    name: 'eslint-config-base-ts',
    rules: {
      '@typescript-eslint/no-implied-eval': 'error',
      'no-throw-literal': 'off',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',

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
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
};

const jsconfig: Linter.Config[] = defineConfig(
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  baseconfig.js,
);

const tsconfig: ConfigArray = tseslint.config(
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        sourceType: 'module',
      },
    },
  },
  baseconfig.js,
  baseconfig.ts,
);

export { baseconfig, jsconfig, tsconfig, tseslint, type ConfigArray };
