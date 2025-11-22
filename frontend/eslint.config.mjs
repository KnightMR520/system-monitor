import js from '@eslint/js'
import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        browser: true,
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        WebSocket: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      react,
      prettier,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', { varsIgnorePattern: 'React' }],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
