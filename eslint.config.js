import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            prettier,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'simple-import-sort': simpleImportSort,
            'sort-destructure-keys': sortDestructureKeys,
            'sort-keys-fix': sortKeysFix,
        },
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': 'error',
            'sort-destructure-keys/sort-destructure-keys': 'warn',
            'sort-keys-fix/sort-keys-fix': 'warn',
        },
    },
]);
