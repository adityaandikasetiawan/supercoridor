module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  ignorePatterns: ['dist', 'node_modules'],
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  overrides: [
    {
      files: ['*.cjs'],
      env: { node: true, commonjs: true, es2020: true },
    },
    {
      files: ['server/**/*.{js,mjs,cjs}'],
      env: { node: true, es2020: true },
    },
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'react-refresh/only-export-components': 'off',
  },
};
