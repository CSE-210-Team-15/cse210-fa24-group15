import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        jest: true,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      eqeqeq: 'error',
      curly: 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
    },
  },
];
