module.exports = {
  parser: '@babel/eslint-parser', // allows JSX parsing
  parserOptions: {
    requireConfigFile: false, // no full babel config needed
    babelOptions: {
      presets: ['@babel/preset-react'], // JSX support
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['react', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    fetch: 'readonly',
    WebSocket: 'readonly',
    console: 'readonly',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
