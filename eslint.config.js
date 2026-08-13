import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import globals from 'globals';

export default ts.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'output/**',
      'docs/**',
      '.agents/**',
      '.cursor/**',
      '.playwright-cli/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    files: ['src/**/*.{ts,vue}', 'vite.config.ts'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ['scripts/**/*.{js,mjs}', 'eslint.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    rules: {
      // ── TypeScript ──────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],

      // ── Vue ─────────────────────────────────────────────────────
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'error',
      'vue/no-unused-emit-declarations': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-dupe-keys': 'error',
      'vue/no-template-shadow': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],

      // ── General ─────────────────────────────────────────────────
      'no-console': 'off',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
);
